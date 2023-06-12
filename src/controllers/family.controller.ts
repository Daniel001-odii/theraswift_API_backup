import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { JwtPayload, CustomRequest } from "../interface/generalInterface";
import FamilyModel from "../models/Family.model";

export const addFamilyController = async (req: Request, res: Response) => {
  try {
    const { full_name, date_of_birth, gender, email, mobile_number, userId } =
      req.body;

    if (!full_name || !date_of_birth || !gender || !userId)
      return res.json({ message: "Family input not completed" });

    const newFamily = new FamilyModel({
      userId,
      fullName: full_name,
      dateOfBirth: date_of_birth,
      gender,
      email,
      mobileNumber: mobile_number,
    });

    let savedUser = await newFamily.save();

    res.status(201).json({
      message: "New family member added successfully",
      family_member: savedUser,
    });
  } catch (err: any) {
    res.status(500).json({error:err.message})
  }
};

export const getUserFamilyController = async (req: Request, res: Response) => {
  try {
    // const { userId } = req.body;
    let secret = process.env.JWT_SECRET_KEY;
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    const { userId } = jwt.verify(token!, secret!) as unknown as JwtPayload;

    if (!userId) return res.json({ message: "please send user id" });

    let userFamilies = await FamilyModel.find({ userId });

    res.status(201).json({
      message: "Family members retrieved successfully",
      family_members: userFamilies,
    });
  } catch (err: any) {
    res.status(500).json({error:err.message})
  }
};

// export const getUserFamilyWithAuthTokenController = async (req: Request, res: Response) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) return res.json({ message: "please send user id" });

//     let userFamilies = await FamilyModel.find({ userId });

//     res.status(201).json({
//       message: "Family members retrieved successfully",
//       family_members: userFamilies,
//     });
//   } catch (err: any) {
//     res.status(500).json({error:err.message;
//   }
// };

export const deleteUserFamilyController = async (
  req: Request,
  res: Response
) => {
  try {
    const { family_id } = req.body;

    if (!family_id)
      return res.json({ message: "please send family member's id" });

    let userFamilies = await FamilyModel.findByIdAndDelete(family_id);

    res.status(201).json({
      message: "Family members retrieved successfully",
      family_members: userFamilies,
    });
  } catch (err: any) {
    res.status(500).json({error:err.message})
  }
};
