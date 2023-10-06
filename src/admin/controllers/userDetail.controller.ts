import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../../user/models/userReg.model";


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
    } = req.body;

    const user = await UserModel.findOne({_id: userId});

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
  }

    return res.status(200).json({
        message: "success",
        user: userObj
    })

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}