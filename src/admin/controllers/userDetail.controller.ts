import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../../user/models/userReg.model";
import UsermedicationModel from "../../user/models/medication.model";


//get all users /////////////
export const getAllUsersController = async (
    req: any,
    res: Response,
) => {
  try {
   const users = await UserModel.find();

   let userArry = [];
   for (let i = 0; i < users.length; i++) {
    const user = users[i];

    const usermedication = await UsermedicationModel.find({userId: user._id}).populate('medicationId')

    const userObj = {
      id: user._id,
      userId: user.userId,
      email: user.email,
      firstName: user.firstName, 
      dateOfBirth: user.dateOfBirth,
      lastName: user.lastName,
      mobileNumber: user.mobileNumber,
      gender: user.gender,
      refererCode: user.refererCode,
      refererCredit: user.refererCredit,
      reference: user.reference,
      operatingLocation: user.operatingLocation,
      usermedication
    }

    userArry.push(userObj);
    
   }

    return res.status(200).json({
        message: "success",
       users: userArry
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//get spage of user detail /////////////
export const getPageUserDeatilController = async (
    req: any,
    res: Response,
  ) => {
    try {
      const {
        howMany
      } = req.body;
  
      const page = parseInt(req.body.page) || 1; // Page number, default to 1
      const limit = parseInt(req.body.limit) || 10; // Documents per page, default to 10
  
      const skip = (page - 1) * limit; // Calculate how many documents to skip
  
      const totalusers = await UserModel.countDocuments(); // Get the total number of documents
  
      const users = await UserModel.find()
        .skip(skip)
        .limit(limit);

      let userArry = [];
      for (let i = 0; i < users.length; i++) {
        const user = users[i];
        const usermedication = await UsermedicationModel.find({userId: user._id}).populate('medicationId')

        const userObj = {
          id: user._id,
          userId: user.userId,
          email: user.email,
          firstName: user.firstName, 
          dateOfBirth: user.dateOfBirth,
          lastName: user.lastName,
          mobileNumber: user.mobileNumber,
          gender: user.gender,
          refererCode: user.refererCode,
          refererCredit: user.refererCredit,
          reference: user.reference,
          operatingLocation: user.operatingLocation,
          usermedication
        }

        userArry.push(userObj);
        
      }
  
      return res.status(200).json({
          message: "success",
          users: userArry,
          currentPage: page,
          totalPages: Math.ceil(totalusers / limit),
      })
  
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
}


//get single user detail /////////////
export const getsingleUserController = async (
  req: any,
  res: Response,
) => {
  try {
    const {
      userId, 
    } = req.query;

    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await UserModel.findOne({_id: userId});

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const usermedication = await UsermedicationModel.find({userId}).populate('medicationId')

    const userObj = {
      id: user?._id,
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName, 
      dateOfBirth: user?.dateOfBirth,
      lastName: user?.lastName,
      mobileNumber: user?.mobileNumber,
      gender: user?.gender,
      refererCode: user?.refererCode,
      refererCredit: user?.refererCredit,
      reference: user?.reference,
      operatingLocation: user?.operatingLocation
  }

    return res.status(200).json({
        message: "success",
        user: {profile: userObj, usermedication}
    })

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}