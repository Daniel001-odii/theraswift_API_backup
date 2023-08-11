import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Order from "../models/Order.model";
import Medication from "../models/Medications.model";
import Prescription from "../models/Prescription.model";
// import RefillRequest from '../models/RefillRequest';
import { AddOrderRequestBody } from "../interface/ordersInterface";
import {
  IOrder,
  IShippingAddress,
  IUser,
  JwtPayload,
} from "../interface/generalInterface";
import TransactionsModel from "../models/Transactions.model";
import { generateOrderId } from "../utils/orderIdGenerator";
import { uploadToS3 } from "../utils/awsS3";
import { v4 as uuidv4 } from "uuid";
import UserModel from "../models/User.model";
import {
  sendOrderCompleteEmail,
  sendOrderStatusEmail,
} from "../utils/sendEmailUtility";
import shippingAddressModel from "../models/ShippingAddress.model";
import jwt from "jsonwebtoken";

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
      profile_info
    } = req.body as AddOrderRequestBody;

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
      return res.status(500).json({
        message: "You do not have enough balance to complete this order",
      });
    }

    // Validate the product IDs and quantities
    for (const { medication_id, quantity } of products) {
      let parsed_medication_id = new mongoose.Types.ObjectId(medication_id);

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

    if (prescription_id && prescription_input && req.file) {
      return res.status(400).json({
        error: `Invalid entry, only one from either prescription id, prescription input or prescription image can be accepted`,
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
      prescription_image_url = result?.Location!;

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
      prescriptionId: existingPrescription
        ? existingPrescription._id || null
        : savedPrescription?._id || null,
      payment,
      shipping_address,
      delivery_time: delivery_time_chosen,
      prescriptionCompleted,
      profile_info
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
      type: "medication-order",
      amount: payment.amount,
      details: {
        orderId: orderCreated.orderId,
        amount: payment.amount,
        currency: "NGN",
        payment_status: "success",
      },
      created_at: new Date(),
    });

    let newTransactionHistory = await newTransactionHistoryLog.save();

    // Return the new Order document
    res.status(201).json({ message: "order created successfully", newOrder });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  let { orderId } = req.params;
  try {
    let data = await Order.findOne({ orderId }).populate({
      path: "products.medication",
      select: "-_id -medicationForms -medicationTypes",
    });
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getOrders = async function (req: Request, res: Response) {
  try {
    const orders = await Order.find().populate({
      path: "products.medication",
      select: "-_id -medicationForms -medicationTypes",
    });
    res.status(200).json({ data: orders });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const secret = process.env.JWT_SECRET_KEY;
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    const { userId } = jwt.verify(token!, secret!) as { userId: string };

    const userOrders = await Order.find({ userId }).populate({
      path: "products.medication",
      select: "-_id -medicationForms -medicationTypes",
    });

    res
      .status(200)
      .json({
        user_orders: userOrders,
        message: "Orders retrieved successfully",
      });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  let { orderId, orderStatus } = req.body;
  try {
    const orderInfo = await Order.findOne({ orderId });

    if (!orderInfo) {
      return res.status(404).send({ message: "Order not found " });
    }

    if (!orderStatus) {
      return res.status(404).send({ message: "Order status not found " });
    }

    orderInfo.status = orderStatus;

    let existingUser: IUser;

    let userId = orderInfo.userId;

    // Check if the email already exists in the database
    existingUser = (await UserModel.findOne({ userId })) as IUser;

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }

    await orderInfo.save();

    if (orderStatus === "cancelled" || orderStatus === "rejected") {
      let orderPrice = orderInfo.payment.amount;

      let newBalance =
        parseInt(existingUser.theraWallet.toString()) +
        parseInt(orderPrice.toString());

      existingUser.theraWallet = newBalance;

      await existingUser.save();
    } else if (orderStatus === "dispensed") {
      //INFO: There is no need in to do anything here as the order status has been updated before anything above. the "if(){}" block is needed to return the users money and update user balance by returning their money to their balance.
    }

    let senderEmailOrderStatusData = {
      firstName: `${existingUser!.firstName}`,
      emailTo: existingUser!.email,
      subject: "Theraswift Order status update Notification",
      orderStatus,
    };

    sendOrderStatusEmail(senderEmailOrderStatusData);

    res.send({
      message: "Order updated status successfully",
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};


// INFO: this to make users to either accept or cancel the prescription invoice sent from the admin
export const uncompletedOrdersControllers = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      orderId,
      userId,
      finalizeStatus,
      prescriptionId,
      deliveryTimeChosen,
      streetAddress,
      streetNumber,
      shippingAddressId,
    } = req.body;

    // check if needed parameters are sent in the body
    if (!orderId || !userId || !finalizeStatus)
      return res
        .status(400)
        .json({ message: "please send required body queries" });

    const orderInfo = await Order.findOne({ orderId: orderId });

    if (!orderInfo) return res.status(404).json({ message: "order not found" });

    // Check if the user exists in the database
    const existingUser = await UserModel.findOne({ userId: userId });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }

    if (finalizeStatus === 'cancelled') {

      orderInfo.status = "cancelled";
      orderInfo.prescriptionCompleted = true;

      await orderInfo.save();

      //INFO: send mail to notify user of the rejected order
      let senderEmailOrderStatusData = {
        firstName: `${existingUser!.firstName}`,
        emailTo: existingUser!.email,
        subject: "Theraswift Cancelled Order Notification",
        orderStatus: "cancelled",
      };

      sendOrderStatusEmail(senderEmailOrderStatusData);

      // mail the admin
      let senderEmailOrderCompletedData = {
        emailTo: existingUser!.email,
        subject: "Theraswift Cancelled Order Notification",
        orderId: orderInfo.orderId,
      };

      sendOrderCompleteEmail(senderEmailOrderCompletedData);

      // save the information to transaction history for user
      const newTransactionHistoryLog = new TransactionsModel({
        userId,
        type: "medication-order",
        amount: orderInfo.payment.amount,
        details: {
          orderId: orderInfo.orderId,
        },
        created_at: new Date(),
      });

      await newTransactionHistoryLog.save();

      return res.json({ message: "Order rejected successfully" });
    }

    //INFO: continue code execution order if not order is not rejected

    let newShippingAddress: IShippingAddress = {} as IShippingAddress;

    if (streetAddress && streetNumber) {
      newShippingAddress = new shippingAddressModel({
        userId,
        street_address:streetNumber,
        street_number: streetNumber,
      });

      await newShippingAddress.save();
    }

    if (!newShippingAddress?._id || !shippingAddressId) {
      return res.json({ message: "please pass in one shipping information" });
    }

    //INFO: Check if the user's wallet balance is less than the payment amount

    if (
      parseInt(existingUser.theraWallet.toString()) <
      parseInt(orderInfo.payment.amount.toString())
    ) {
      //INFO: If the user's balance is insufficient, return an error message
      return res.json({
        message: "You do not have enough balance to complete this order",
      });
    }

    let userTheraBalance =
      parseInt(existingUser.theraWallet.toString()) -
      parseInt(orderInfo.payment.amount.toString());

    existingUser.theraWallet = userTheraBalance;

    //INFO: update user balance after order to reduce user's balance.
    await existingUser.save();

    orderInfo.status = "dispensed";
    orderInfo.prescriptionCompleted = true;
    orderInfo.shippingAddress = newShippingAddress
      ? newShippingAddress._id
      : shippingAddressId;
    orderInfo.deliveryTime = deliveryTimeChosen;

    await orderInfo.save();

    //INFO: send mail to notify user of the dispensed order
    let senderEmailOrderStatusData = {
      firstName: `${existingUser!.firstName}`,
      emailTo: existingUser!.email,
      subject: "Theraswift Dispensed Order Notification",
      orderStatus: "dispensed",
    };

    sendOrderStatusEmail(senderEmailOrderStatusData);

    //INFO: send mail to notify admin of the dispensed order
    let senderEmailOrderCompletedData = {
      emailTo: existingUser!.email,
      subject: "Therawswift Completed Order Notification",
      deliveryDate: deliveryTimeChosen,
      orderId: orderInfo.orderId,
    };

    sendOrderCompleteEmail(senderEmailOrderCompletedData);

    // save the information to transaction history for user
    const newTransactionHistoryLog = new TransactionsModel({
      userId,
      type: "medication-order",
      amount: orderInfo.payment.amount,
      details: {
        orderId: orderInfo.orderId,
        amount: orderInfo.payment.amount,
        currency: "NGN",
        payment_status: "success",
      },
      created_at: new Date(),
    });

    await newTransactionHistoryLog.save();

    return res.json({ message: "Order dispensed successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
