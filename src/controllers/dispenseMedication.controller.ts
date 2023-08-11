import { Request, Response } from "express";
import { IDispenseLog } from "../interface/generalInterface";
import DispenseLogModel from "../models/DispenseLog.model";

export const saveDispenseLog = async (req: Request, res: Response) => {
  try {
    const {
      fullName,
      email,
      prescriber,
      dispenser,
      dateOfBirth,
      dateDispensed,
      dosage,
      orderId,
      userId,
    } = req.body;

    // Validate the request body
    if (!fullName || !email || !prescriber || !dispenser) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Create a new Dispense log document
    let newDispenseLog: IDispenseLog;
    newDispenseLog = new DispenseLogModel({
      fullName,
      email,
      prescriber,
      dispenser,
      dateOfBirth,
      dateDispensed,
      dosage,
      orderId,
      userId,
    });

    let dispenseLog = await newDispenseLog.save();

    // Return the new dispense log document
    res
      .status(201)
      .json({ message: "dispense log saved successfully", dispenseLog });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDispenseLogById = async (req: Request, res: Response) => {
  let { id } = req.params;
  try {
    let data = await DispenseLogModel.findById(id);

    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getDispenseLogs = async function (req: Request, res: Response) {
  try {
    const dispenseLogs = await DispenseLogModel.find();
    res.status(200).json({ data: dispenseLogs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserDispenseLogs = async (req: Request, res: Response) => {
  try {
    let { userId } = req.params;
    const userOrders = await DispenseLogModel.find({ userId })

    res.status(200).json({
      user_orders: userOrders,
      message: "User Dispense logs retrieved successfully",
    });

  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
