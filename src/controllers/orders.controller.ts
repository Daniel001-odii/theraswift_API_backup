import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Order from "../models/Order.model";
import Medication from "../models/Medications.model";
import Prescription from "../models/Prescription.model";
// import RefillRequest from '../models/RefillRequest';
import { AddOrderRequestBody } from "../interface/ordersInterface";
import { IOrder, IShippingAddress, IUser } from "../interface/generalInterface";
import TransactionsModel from "../models/Transactions.model";
import { generateOrderId } from "../utils/orderIdGenerator";
import { uploadToS3 } from "../utils/awsS3";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../models/User.model";
import { sendOrderCompleteEmail, sendOrderStatusEmail } from "../utils/sendEmailUtility";
import { request } from "http";
import shippingAddressModel from "../models/ShippingAddress.model";

export const addOrder = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      products,
      prescription_input,
      prescription_id,
      delivery_time_chosen,
      payment,
      shipping_address,
      order_type,
      prescriptionCompleted,
    } = req.body as AddOrderRequestBody;

    console.log("userId ", userId);

    // Check if the user exists in the database
    const existingUser = await UserModel.findOne({ userId });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }

    // Validate the request body
    if (
      !userId ||
      !products ||
      !payment ||
      !shipping_address ||
      !delivery_time_chosen
    ) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Check if the user's wallet balance is less than the payment amount
    if (
      parseInt(existingUser.theraWallet.toString()) <
      parseInt(payment.amount.toString())
    ) {
      // If the user's balance is insufficient, return an error message
      return res.json({
        message: "You do not have enough balance to complete this order",
      });
    }

    // Validate the product IDs and quantities
    for (const { medication_id, quantity } of products) {
      let parsed_medication_id = new mongoose.Types.ObjectId(medication_id);

      console.log("medication_id ", medication_id);

      const medication = await Medication.findById(parsed_medication_id);
      if (!medication) {
        return res
          .status(400)
          .json({ error: `Invalid medication ID: ${parsed_medication_id}` });
      }
      if (quantity <= 0) {
        return res
          .status(400)
          .json({ error: `Invalid medication quantity: ${quantity}` });
      }
    }

    if (prescription_id && prescription_input) {
      return res.status(400).json({
        error: `Invalid entry, only a input prescription_id or new prescription can be accepted`,
      });
    }

    let existingPrescription: any;

    // Validate the prescription ID
    if (prescription_id) {
      let parsed_prescription_id = new mongoose.Types.ObjectId(prescription_id);
      existingPrescription = await Prescription.findById(
        parsed_prescription_id
      );
      if (!existingPrescription) {
        return res
          .status(400)
          .json({ error: `Invalid prescription ID: ${prescription_id}` });
      }
    }

    // Validate the refill request ID
    // if (refill_request_id) {
    //   const existingRefillRequest = await RefillRequest.findById(refill_request_id);
    //   if (!existingRefillRequest) {
    //     return res.status(400).json({ error: `Invalid refill request ID: ${refill_request_id}` });
    //   }
    // }

    let savedPrescription: any;

    if (prescription_input) {
      const addPrescription = async () => {
        try {
          const newPrescription = new Prescription({
            userId,
            type: prescription_input?.type,
            name: prescription_input?.name,
            strength: prescription_input?.strength,
            frequency: prescription_input?.frequency,
            startDate: prescription_input?.startDate,
            endDate: prescription_input?.endDate,
            doctor: prescription_input?.doctor,
            pharmacy: prescription_input?.pharmacy,
          });

          savedPrescription = await newPrescription?.save();
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error adding prescription", error });
        }
      };

      await addPrescription();
    }

    let prescription_image_url = "";

    if (req.file) {
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      prescription_image_url = result.Location;

      const newPrescription = new Prescription({
        userId,
        prescriptionImageUrl: prescription_image_url,
      });

      savedPrescription = await newPrescription?.save();
    }

    let orderId = await generateOrderId();

    // Create a new Order document
    let newOrder: IOrder;
    newOrder = new Order({
      userId,
      orderId,
      type: order_type,
      products,
      prescription: existingPrescription
        ? existingPrescription?._id
        : savedPrescription?._id,
      payment,
      shipping_address,
      delivery_time_chosen,
      prescriptionCompleted,
    });

    if (!newOrder) return;

    let userTheraBalance =
      parseInt(existingUser.theraWallet.toString()) -
      parseInt(payment.amount.toString());

    existingUser.theraWallet = userTheraBalance;

    // update user balance after order
    await existingUser.save();
    // Save the new Order document to the database
    let orderCreated = await newOrder?.save();

    // save the information to transaction history for user
    const newTransactionHistoryLog = new TransactionsModel({
      userId,
      type: "product-order",
      amount: payment.amount,
      details: {
        // orderId: orderCreated._id,
        orderId: orderCreated.orderId,
        amount: payment.amount,
        currency: "NGN",
        payment_status: "success",
        order_status: "pending",
        prescription: existingPrescription
          ? existingPrescription?._id
          : savedPrescription?._id,
        product_order_type: order_type,
      },
      created_at: new Date(),
    });

    let newTransactionHistory = await newTransactionHistoryLog.save();

    // Return the new Order document
    res.status(201).json({ message: "order created successfully", newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};



export const getOrderById = async (req: Request, res: Response) => {
  let { orderId } = req.body;
  try {
    let data = await Order.findOne({ orderId });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error)
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    let data = await Order.find();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error)
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  let { userId } = req.body;
  try {
    let data = await Order.find({ userId });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error)
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  let { orderId, orderStatus } = req.body;
  try {
    const orderInfo = await Order.findOne({ orderId });

    if (!orderInfo) {
      return res.status(404).send({ message: "Order not found " });
    }

    orderInfo.status = orderStatus;

    await orderInfo.save();

    let existingUser: any;

    if (orderStatus === "cancelled") {
      let orderPrice = orderInfo.payment.amount;
      let userId = orderInfo.userId;

      // Check if the email already exists in the database
      existingUser = (await UserModel.findOne({ userId })) as IUser;

      if (!existingUser) {
        return res.status(400).json({ message: "User does not exists" });
      }

      let newBalance =
        parseInt(existingUser.theraWallet.toString()) +
        parseInt(orderPrice.toString());

      existingUser.theraWallet = newBalance;

      await existingUser.save();
    }
    // else if (orderStatus === "dispensed") {

    // }

    let senderEmailOrderStatusData = {
      firstName: `${existingUser!.firstName}`,
      emailTo: existingUser!.email,
      subject: "Therawallet Gift Balance Top-up Notification",
      orderStatus,
    };

    sendOrderStatusEmail(senderEmailOrderStatusData);

    res.send({
      message: "Order updated status successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const uncompletedOrdersControllers = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      order_id,
      user_id,
      finalize_status,
      prescription_id,
      delivery_time_chosen,
      street_address,
      street_number,
      shipping_address_id,
    } = req.body;

    // check if needed parameters are sent in the body
    if (!order_id || !user_id || !finalize_status)
      return res
        .status(400)
        .json({ message: "please send required body queries" });

    const orderInfo = await Order.findOne({ orderId: order_id });

    if (!orderInfo) return res.status(404).json({ message: "order not found" });

    // Check if the user exists in the database
    const existingUser = await UserModel.findOne({ userId: user_id });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }

    if (finalize_status === false) {
      orderInfo.status = "rejected";
      orderInfo.prescriptionCompleted = true;

      await orderInfo.save();
      //TODO send mail to notify user of the rejected order

    let senderEmailOrderStatusData = {
      firstName: `${existingUser!.firstName}`,
      emailTo: existingUser!.email,
      subject: "Therawallet Rejected Order Notification",
      orderStatus: "rejected",
    };

    sendOrderStatusEmail(senderEmailOrderStatusData);

    // mail the admin
    let senderEmailOrderCompletedData = {
      emailTo: existingUser!.email,
      subject: "Therawallet Rejected Order Notification",
      orderId: orderInfo.orderId,
    };

    sendOrderCompleteEmail(senderEmailOrderCompletedData);


    

      // save the information to transaction history for user
      const newTransactionHistoryLog = new TransactionsModel({
        userId: user_id,
        type: "product-order",
        amount: orderInfo.payment.amount,
        details: {
          orderId: orderInfo.orderId,
          amount: orderInfo.payment.amount,
          currency: "NGN",
          payment_status: "error",
          order_status: "rejected",
          prescription: prescription_id,
          product_order_type: "prescription-order",
        },
        created_at: new Date(),
      });

      await newTransactionHistoryLog.save();

      return res.json({ message: "Order rejected successfully" });
    }

    // continue order if not order is not rejected

    let newShippingAddress: IShippingAddress = {} as IShippingAddress;

    if (street_address && street_number) {
      newShippingAddress = new shippingAddressModel({
        userId: user_id,
        street_address,
        street_number,
      });

      await newShippingAddress.save();
    }

    if (!newShippingAddress?._id || !shipping_address_id) {
      return res.json({ message: "please pass in shipping informations" });
    }

    // Check if the user's wallet balance is less than the payment amount
    if (
      parseInt(existingUser.theraWallet.toString()) <
      parseInt(orderInfo.payment.amount.toString())
    ) {
      // If the user's balance is insufficient, return an error message
      return res.json({
        message: "You do not have enough balance to complete this order",
      });
    }

    let userTheraBalance =
      parseInt(existingUser.theraWallet.toString()) -
      parseInt(orderInfo.payment.amount.toString());

    existingUser.theraWallet = userTheraBalance;

    // update user balance after order
    await existingUser.save();

    orderInfo.status = "dispensed";
    orderInfo.prescriptionCompleted = true;
    orderInfo.shipping_address = newShippingAddress
      ? newShippingAddress._id
      : shipping_address_id;
    orderInfo.delivery_time_chosen = delivery_time_chosen;

    await orderInfo.save();
    // send mail to notify user of the dispensed order
    let senderEmailOrderStatusData = {
      firstName: `${existingUser!.firstName}`,
      emailTo: existingUser!.email,
      subject: "Therawallet Dispensed Order Notification",
      orderStatus: "dispensed",
    };

    sendOrderStatusEmail(senderEmailOrderStatusData);

    // mail the admin
    let senderEmailOrderCompletedData = {
      emailTo: existingUser!.email,
      subject: "Therawallet Completed Order Notification",
      // deliveryDate: "20/34/5",
      deliveryDate: delivery_time_chosen,
      orderId: orderInfo.orderId,
    };

    sendOrderCompleteEmail(senderEmailOrderCompletedData);

    // save the information to transaction history for user
    const newTransactionHistoryLog = new TransactionsModel({
      userId: user_id,
      type: "product-order",
      amount: orderInfo.payment.amount,
      details: {
        orderId: orderInfo.orderId,
        amount: orderInfo.payment.amount,
        currency: "NGN",
        payment_status: "success",
        order_status: "dispensed",
        prescription: prescription_id,
        product_order_type: "prescription-order",
        shipping_address: newShippingAddress
          ? newShippingAddress._id
          : shipping_address_id,
      },
      created_at: new Date(),
    });

    await newTransactionHistoryLog.save();

    return res.json({ message: "Order dispensed successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "internal server error" });
  }
};
