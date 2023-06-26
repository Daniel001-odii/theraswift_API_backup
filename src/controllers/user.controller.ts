import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import UserModel from "../models/User.model";
import { JwtPayload, CustomRequest } from "../interface/generalInterface";
import {ObjectId} from 'mongoose'
export const getUsersController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, userId } = req.body;

    if (userId && email) {
      res.status(500).json({
        message: "please pass in either a user_id or an email address",
      });
      return;
    }

    let user;
    // Find the token in the database
    if (email) {
      user = await UserModel.findOne({ email });
    }

    if (userId) {
      user = await UserModel.findOne({
        userId,
      });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserWithAccessTokenController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    let secret = process.env.JWT_SECRET_KEY;
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    //   res.status(200).json({
    //     welcome: "welcome to theraswift api",
    //   });
    const { userId, email } = jwt.verify(
      token!,
      secret!
    ) as unknown as JwtPayload;

    let user;
    // Find the token in the database
    if (email) {
      user = await UserModel.findOne({ email });
    } else {
      user = await UserModel.findOne({
        userId,
      });
    }
    res.json({
      user: {
        _id: user?._id,
        userId: user?.userId,
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        gender: user?.gender,
        mobileNumber: user?.mobileNumber,
        role: user?.role,
        walletBalance: user?.theraWallet,
        dateOfBirth: user?.dateOfBirth
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const addUserMedicationController = async (
  req: Request,
  res: Response
) => {
  try {
    let {userMedications} = req.body
    let secret = process.env.JWT_SECRET_KEY;
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    const { userId, email, _id } = jwt.verify(
      token!,
      secret!
    ) as unknown as JwtPayload;

    let user;
    // Find the token in the database
    if (email) {
      user = await UserModel.findOne({ email });
    } else {
      user = await UserModel.findOne({
        userId,
      });
    }

    if(!user){
      return res.status(500).send("User not found!")
    }

     await UserModel.findOneAndUpdate(
      {_id},
      {$set:{userMedications}},
    );

    let updatedUserValue = await UserModel.findById(_id)

    console.log(updatedUserValue)
    console.log(_id)

    res.json({
        message: "Medication added to user successfully",
      user: {
        _id: updatedUserValue?._id,
        userId: updatedUserValue?.userId,
        firstName: updatedUserValue?.firstName,
        lastName: updatedUserValue?.lastName,
        email: updatedUserValue?.email,
        gender: updatedUserValue?.gender,
        mobileNumber: updatedUserValue?.mobileNumber,
        role: updatedUserValue?.role,
        walletBalance: updatedUserValue?.theraWallet,
        dateOfBirth: updatedUserValue?.dateOfBirth,
        userMedications: updatedUserValue?.userMedications
      },
    });
    
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



