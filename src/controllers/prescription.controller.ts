import { Request, Response } from "express";
import { Types } from "mongoose";
import { AddPrescriptionRequest } from "../interface/ordersInterface";
import Prescription, { PrescriptionType } from "../models/Prescription.model";
import { CustomFileAppendedRequest } from "../types/generalTypes";
import { uploadToS3 } from "../utils/awsS3";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";
import { JwtPayload, CustomRequest } from "../interface/generalInterface";




export const addPrescription = async (
  req: CustomFileAppendedRequest,
  res: Response
) => {
  try {
  
    let secret = process.env.JWT_SECRET_KEY;
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

   
    const { userId } = jwt.verify(
      token!,
      secret!
    ) as unknown as JwtPayload;


    let prescription_image_url = "";

    if (req.file) {
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      prescription_image_url = result?.Location!;
      console.log(result);
    }

    const prescription = new Prescription({
      userId,
      prescriptionImageUrl:prescription_image_url,
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

export const getPrescriptionById = async (req: Request, res: Response) => {
  let { prescription_id } = req.params;
  try {
    let data = await Prescription.findById(prescription_id);
    res.status(200).json({ data });
  } catch (error: any) {
     res.status(500).json({error:error.message})
  }
};

export const getPrescriptions = async (req: Request, res: Response) => {
  try {
    let data = await Prescription.find();
    res.status(200).json({ data });
  } catch (error: any) {
     res.status(500).json({error:error.message})
  }
};

export const getUserPrescription = async (req: Request, res: Response) => {
  let { userId } = req.body;
  try {
    let data = await Prescription.find({ userId });
    res.status(200).json({ data });
  } catch (error: any) {
     res.status(500).json({error:error.message})
  }
};

export const deleteUserPrescriptionById = async (
  req: Request,
  res: Response
) => {
  let { prescription_id } = req.params;
  try {
    let data = await Prescription.findByIdAndDelete(prescription_id);
    res.status(200).json({ data });
  } catch (error: any) {
     res.status(500).json({error:error.message})
  }
};
