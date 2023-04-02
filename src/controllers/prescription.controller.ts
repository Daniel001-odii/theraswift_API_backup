import { Request, Response } from "express";
import { Types } from "mongoose";
import { AddPrescriptionRequest } from "../interface/ordersInterface";
import Prescription, { PrescriptionType } from "../models/Prescription.model";

export const addPrescription = async (req: Request, res: Response) => {
  try {
    const {
      userId,
      type,
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      doctor,
      pharmacy,
    } = req.body as AddPrescriptionRequest;

    const prescription = new Prescription({
      userId,
      type,
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      doctor,
      pharmacy,
    });
    await prescription.save();

    res
      .status(201)
      .json({ message: "Prescription added successfully", prescription });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding prescription", error });
  }
};


export  const getPrescription  = async (req: Request, res: Response) => {
    try {

    }catch(error) {
        res.status(500).json({message:"internal server error"})
        // throw Error(error)
    }
}