import { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import Order from "../models/Order.model";
import Medication from "../models/Medications.model";
import Prescription from "../models/Prescription.model";
// import RefillRequest from '../models/RefillRequest';
import { AddOrderRequestBody } from "../interface/ordersInterface";
import { IOrder } from "../interface/generalInterface";
import TransactionsModel from "../models/Transactions.model";
import {generateOrderId} from '../utils/orderIdGenerator'

export const addOrder = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      products,
      prescription_input,
      prescription_id,
      refill_request_id,
      payment,
      shipping_address,
      order_type,
    } = req.body as AddOrderRequestBody;

    console.log("userId ", userId);

    // Validate the request body
    if (!userId || !products || !payment || !shipping_address) {
      return res.status(400).json({ error: "Invalid request body" });
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
            dosage: prescription_input?.dosage,
            frequency: prescription_input?.frequency,
            startDate: prescription_input?.startDate,
            endDate: prescription_input?.endDate,
            doctor: prescription_input?.doctor,
            pharmacy: prescription_input?.pharmacy,
          });

          savedPrescription = await newPrescription?.save();

          //   res.status(201).json({
          //     message: "Prescription added successfully",
          //     prescription: savedPrescription,
          //   });

        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "Error adding prescription", error });
        }
      };

      await addPrescription();
    }

    let orderId = await generateOrderId();

    console.log("orderId ",orderId)

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
    });

    if (!newOrder) return;

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
        prescription: existingPrescription
          ? existingPrescription?._id
          : savedPrescription?._id,
        product_order_type: order_type,
      },
      created_at: new Date(),
    });

    let newTransactionHistory = await newTransactionHistoryLog.save();

    // console.log(newTransactionHistoryLog)

    

    // Return the new Order document
    res.status(201).json({ message: "order created successfully", newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
