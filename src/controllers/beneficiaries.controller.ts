import { Request, Response } from "express";
import {
  IBeneficiaryAdded,
  JwtPayload,
  CustomRequest,
} from "../interface/generalInterface";
import beneficiariesModel from "../models/Beneficiaries.model";
import UserModel from "../models/User.model";
import jwt from "jsonwebtoken";

export const getBeneficiaryInfoController = async (
  req: Request,
  res: Response
) => {
  try {
    const { beneficiaryUserId } = req.body;

    console.log("beneficiaryUserId ",beneficiaryUserId)
    // check if needed parameters are sent in the body
    if (!beneficiaryUserId)
      return res
        .status(400)
        .json({ message: "please send required body queries" });

    // check if beneficiary exist in the database
    const existingBeneficiaryUser = await UserModel.findOne({
      userId: beneficiaryUserId,
    });

    if (!existingBeneficiaryUser) {
      return res
        .status(400)
        .json({ message: "Beneficiary does not exists as a user" });
    }

    res.status(200).send({
      firstName: existingBeneficiaryUser.firstName,
      lastName: existingBeneficiaryUser.lastName,
      beneficiaryUserId: existingBeneficiaryUser.userId,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message, message: "internal server error" });
    console.log(err.message);
  }
};


export const addNewBeneficiaryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { userId, beneficiaryUserId } = req.body;

    // check if needed parameters are sent in the body
    if (!userId || !beneficiaryUserId)
      return res
        .status(400)
        .json({ message: "please send required body queries" });

    // Check if the user exists in the database
    const existingUser = await UserModel.findOne({ userId });
    // check if beneficiary exist in the database
    const existingBeneficiaryUser = await UserModel.findOne({
      userId: beneficiaryUserId,
    });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (!existingBeneficiaryUser) {
      return res
        .status(400)
        .json({ message: "Beneficiary does not exists as a user" });
    }

    let newBeneficiaryAdded: IBeneficiaryAdded = {} as IBeneficiaryAdded;

    newBeneficiaryAdded = new beneficiariesModel({
      userId,
      beneficiaryUserId: existingBeneficiaryUser.userId,
      firstName: existingBeneficiaryUser.firstName,
      lastName: existingBeneficiaryUser.lastName,
    });

    let newBeneficiaryResp = await newBeneficiaryAdded.save();

    const formattedBeneficiary = {
      userId,
      firstName: newBeneficiaryResp.firstName,
      lastName: newBeneficiaryResp.lastName,
      beneficiaryUserId,
    };

    return res.status(201).json({
      message: "Beneficiary created successfully",
      new_beneficiary: formattedBeneficiary,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message, message: "internal server error" });
    console.log(err.message);
  }
};

export const getUserBeneficiariesController = async (
  req: Request,
  res: Response
) => {
  try {
    let secret = process.env.JWT_SECRET_KEY;
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    const { userId } = jwt.verify(token!, secret!) as unknown as JwtPayload;

    let data = await beneficiariesModel.find({ userId });

    if (!data || data.length === 0) {
      return res.status(200).json({
        user_beneficiaries: [],
        message: "No Beneficiary found",
      });
    }

    const formattedData = data.map((beneficiary) => ({
      userId,
      beneficiaryUserId: beneficiary.userId,
      firstName: beneficiary.firstName,
      lastName: beneficiary.lastName,
    }));

    res.status(200).json({
      user_beneficiaries: formattedData,
      message: "Beneficiaries retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserBeneficiaryByIdController = async (
  req: Request,
  res: Response
) => {
  let { beneficiary_id } = req.body;
  try {
    let data = await beneficiariesModel.findById(beneficiary_id);

    if (!data)
      return res.status(404).json({ message: "Beneficiary not found" });

    const formattedBeneficiary = {
      beneficiaryUserId: data.userId,
      firstName: data.firstName,
      lastName: data.lastName,
    };

    res.status(200).json({ user_beneficiaries: formattedBeneficiary });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
