import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";


import { sendEmail } from "../../utils/send_email_utility";

import { generateOTP } from "../../utils/otpGenerator";

import { sendAccountDeleteEmail } from "../../utils/send_email_utility";

import { OTP_EXPIRY_TIME } from "../../utils/otpGenerator";

//user delete data/////////////
export const userDeleteMyAccountController = async (
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
        .json({ message: "unable to delete accout" });
    }
    
    return res.status(200).json({
      message: "account deleted succefully",
    })
  

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

};



// send user account deletion OTP....
export const sendDeleteOTP = async (req: Request, res: Response) => {
  try{
      const { email } = req.body;

      console.log("checking for email: ", email)

      const user = await UserModel.findOne({ email: email });

      if(!user){
          return res.status(401).json({ message: "user with email not found"});
      }

      const otp = generateOTP();
      const createdTime = new Date();
      
      user.emailOtp = {
          otp,
          createdTime,
          verified: true,
      };
      await user.save();

      // send otp email here...
      let emailData = {
          emailTo: email,
          subject: "Theraswift account deletion request",
          otp,
          firstName: user.firstName,
      };
    
      sendAccountDeleteEmail(emailData);
      return res.status(200).json({ message: `OTP sent successfully to your email ${email}` });

  }catch(error: any){
      res.status(500).json({ message: error.message });
  }
};

// user provides same OTP sent to email...
// OTP is compared with one saved in DB
// delete account if matched
// delete user account using provided OTP from email...
export const deleteAccountWithOTP = async (req: Request,  res: Response) => {
  try{
    const { otp } = req.body;

    // get user with the requested OTP...
    const user = await UserModel.findOne({ "emailOtp.otp":otp });
    if(!user){
      return res.status(400).json({ message: "invalid OTP provided, please try again"});
    };

    // check if otp is still valid...[1 hour timeframe]
    const {createdTime, verified} = user.emailOtp

    const timeDiff = new Date().getTime() - createdTime.getTime();

    if (!verified || timeDiff > OTP_EXPIRY_TIME || otp !== user.emailOtp.otp) {
        return res
        .status(401)
        .json({ message: "unable to reset password" });
    };

    // soft delete user account...
    user.isDeleted = true;
    await user.save();
    res.status(200).json({ message:  "user account deleted successfully."});
  }catch(error: any){
    console.log("error deleting user account with OTP: ", error);
  }
}