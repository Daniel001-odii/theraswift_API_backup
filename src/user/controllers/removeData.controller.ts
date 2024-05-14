import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";

//user delete data/////////////
export const userDeleteDataController = async (
    req: any,
    res: Response,
) => {

  try {
    
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id

   
    //delete user from database
    const deleteUser =  await UserModel.findOneAndDelete({_id: userId}, {new: true});

    if (!deleteUser) {
      return res
        .status(401)
        .json({ message: "unable to delete data" });
    }
    
    return res.status(200).json({
      message: "data deleted succefully",
    })
  

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}