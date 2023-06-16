import { Request, Response } from "express";
import { IShippingAddress,JwtPayload, CustomRequest } from "../interface/generalInterface";
import shippingAddressModel from "../models/ShippingAddress.model";
import UserModel from "../models/User.model";
import jwt from "jsonwebtoken";


export const addShippingAddressController = async (
  req: Request,
  res: Response
) => {
  try {
    const {
      userId,
      street_address,
      street_number,
      delivery_instruction,
      leave_with_doorman,
      lga,
    } = req.body;

    // check if needed parameters are sent in the body
    if (!street_address || !userId || !street_number)
      return res
        .status(400)
        .json({ message: "please send required body queries" });

    // Check if the user exists in the database
    const existingUser = await UserModel.findOne({ userId });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }

    let newShippingAddress: IShippingAddress = {} as IShippingAddress;

    newShippingAddress = new shippingAddressModel({
      userId,
      street_address,
      street_number,
      delivery_instruction,
      leave_with_doorman,
      lga,
    });

    let newShippingAddressResp = await newShippingAddress.save();

    const formattedAddress = {
      streetAddress: newShippingAddressResp.street_address,
      streetNo: newShippingAddressResp.street_number,
      LGA: newShippingAddressResp.lga,
      deliveryInstruction: newShippingAddressResp.delivery_instruction,
      LeaveWithDoorMan: newShippingAddressResp.leave_with_doorman,
    };

    return res.json({
      message: "Shipping address created successfully",
      address_added: formattedAddress,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ error: err.message, message: "internal server error" });
    console.log(err.message);
  }
};

export const getUserShippingAddressController = async (
  req: Request,
  res: Response
) => {
  // let { userId } = req.body;


  try {

    let secret = process.env.JWT_SECRET_KEY;
    // Get JWT from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];
  
    //   res.status(200).json({
    //     welcome: "welcome to theraswift api",
    //   });
    const { userId } = jwt.verify(
      token!,
      secret!
    ) as unknown as JwtPayload;

    
    let data = await shippingAddressModel.find({ userId });

    if (!data || data.length === 0) {
      return res.status(200).json({
        user_address: [],
        message: "No shipping address found",
      });
    }

    const formattedData = data.map((address) => ({
      streetAddress: address.street_address,
      streetNo: address.street_number,
      LGA: address.lga,
      deliveryInstruction: address.delivery_instruction,
      LeaveWithDoorMan: address.leave_with_doorman,
    }));

    res.status(200).json({
      user_address: formattedData,
      message: "Shipping addresses retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUserShippingAddressByIdController = async (
  req: Request,
  res: Response
) => {
  let { address_id } = req.body;
  try {
    let data = await shippingAddressModel.findById(address_id);

    if (!data) return res.status(404).json({ message: "Address not found" });

    const formattedAddress = {
      streetAddress: data.street_address,
      streetNo: data.street_number,
      LGA: data.lga,
      deliveryInstruction: data.delivery_instruction,
      LeaveWithDoorMan: data.leave_with_doorman,
    };

    res.status(200).json({ user_address: formattedAddress });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
