import { Request, Response } from "express";
import { IShippingAddress } from "../interface/generalInterface";
import shippingAddressModel from "../models/ShippingAddress.model";
import UserModel from "../models/User.model";

export const addShippingAddressController = async (
  req: Request,
  res: Response
) => {
  try {
    const { user_id, street_address, street_number } = req.body;

    // check if needed parameters are sent in the body
    if (!street_address || !user_id || !street_number)
      return res
        .status(400)
        .json({ message: "please send required body queries" });

    // Check if the user exists in the database
    const existingUser = await UserModel.findOne({ userId: user_id });

    if (!existingUser) {
      return res.status(400).json({ message: "User does not exists" });
    }

    let newShippingAddress: IShippingAddress = {} as IShippingAddress;

    newShippingAddress = new shippingAddressModel({
      userId: user_id,
      street_address,
      street_number,
    });

    await newShippingAddress.save();

    return res.json({ message: "Shipping address created successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "internal server error" });
  }
};

export const getUserShippingAddressController = async (req: Request, res: Response) => {
  let { userId } = req.body;
  try {
    let data = await shippingAddressModel.find({ userId });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error)
  }
};

export const getUserShippingAddressByIdController = async (
  req: Request,
  res: Response
) => {
  let { address_id } = req.body;
  try {
    let data = await shippingAddressModel.findById(address_id);
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
    // throw Error(error)
  }
};
