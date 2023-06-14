import { Request, Response } from "express";
import HMOModel from "../models/HMO.model";
import { uploadToS3 } from "../utils/awsS3";
import { v4 as uuidv4 } from "uuid";

export const addHmoController = async (req: Request, res: Response) => {
  try {
    const {
      back_insurance_image = false,
      front_insurance_image = false,
      userId,
      hmo_name,
    } = req.body;

    if (!userId) return res.json({ message: "user ID is not found" });

    let insurance_image_url = "";

    if (req.file) {
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      insurance_image_url = result.Location;
      console.log(result);
    }

    const newHMO = new HMOModel({
      userId,
      HmoName: hmo_name,
      back_insurance_image: back_insurance_image && insurance_image_url,
      false_insurance_image: front_insurance_image && insurance_image_url,
    });

    let savedHMO = await newHMO.save();

    res.status(201).json({
      message: "HMO added successfully",
      hmo_member: savedHMO,
    });
  } catch (err: any) {
    // throw err.message;
    res.status(500).json({error:err.message})
  }
};

export const getHMOByIdController = async (req: Request, res: Response) => {
  let { hmo_id } = req.body;
  try {
    let data = await HMOModel.findById(hmo_id);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error.message);
    res.status(500).json({error:error.message})
  }
};

export const getAllHMOController = async (req: Request, res: Response) => {
  try {
    let data = await HMOModel.find();
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error.message);
    res.status(500).json({error:error.message})
  }
};

export const getUserHMOsController = async (req: Request, res: Response) => {
  let { userId } = req.body;
  try {
    let data = await HMOModel.find({ userId });
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error.message);
    res.status(500).json({error:error.message})
  }
};

export const deleteUserHMOByIdController = async (
  req: Request,
  res: Response
) => {
  let { hmo_id } = req.body;
  try {
    let data = await HMOModel.findByIdAndDelete(hmo_id);
    res.status(200).json({ data });
  } catch (error: any) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error.message);
     res.status(500).json({error:error.message})
  }
};
