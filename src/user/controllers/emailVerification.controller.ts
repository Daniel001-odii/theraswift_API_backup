import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendEmail } from "../../utils/send_email_utility";

//user send email /////////////
export const userSendEmailController = async (
    req: Request,
    res: Response,
) => {

    try {
        const {
          email,
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        // try find user with the same email
        const user = await UserModel.findOne({ email });
    
         // check if user exists
         if (!user) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        user!.emailOtp = {
            otp,
            createdTime,
            verified : false
        }

        await user?.save();

        let emailData = {
            emailTo: email,
            subject: "Theraswift email verification",
            otp,
            firstName: user.firstName,
        };

        sendEmail(emailData);

        return res.status(200).json({ message: "OTP sent successfully to your email." });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//user send email /////////////
export const userEmailVerificationController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {
          email,
          otp
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        // try find user with the same email
        const user = await UserModel.findOne({ email });
    
         // check if user exists
         if (!user) {
          return res
            .status(401)
            .json({ message: "invalid email" });
        }

        if (user.emailOtp.otp != otp) {
            return res
            .status(401)
            .json({ message: "invalid otp" });
        }

        if (user.emailOtp.verified) {
            return res
            .status(401)
            .json({ message: "email already verified" });
        }

        const timeDiff = new Date().getTime() - user.emailOtp.createdTime.getTime();
        if (timeDiff > OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }

        user.emailOtp.verified = true;

        await user.save();

        return res.json({ message: "email verified successfully" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}
