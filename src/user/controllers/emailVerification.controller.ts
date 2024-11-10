import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendEmail, sendUserAccountVerificationEmail } from "../../utils/send_email_utility";
import PatientModel from "../../doctor/modal/patient_reg.model";
import AwaitingMedicationModel from "../../admin/models/awaitingMedication.model";
import UserMedicationModel from "../models/medication.model";
import MedicationModel from "../../admin/models/medication.model";

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

        sendUserAccountVerificationEmail(emailData);
        // sendEmail(emailData);

        return res.status(200).json({ message: "OTP sent successfully to your email." });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}


//user verified email /////////////
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

        const checkAwaitingMeds = await AwaitingMedicationModel.find({email: email})

        if (checkAwaitingMeds.length > 0) {
          for (let i = 0; i < checkAwaitingMeds.length; i++) {

            const checkAwaitingMed = checkAwaitingMeds[i];

            const medication = await MedicationModel.findOne({_id: checkAwaitingMed.medicationId});
            if (!medication) continue

            const patient = await PatientModel.findOne({_id: checkAwaitingMed.patientId});
            if (!patient) continue


            //if medication those not exist
            const userMedication = new UserMedicationModel({
              userId: user._id,
              medicationId: medication._id,
              prescriptionStatus: false,
              doctor: patient.doctorId,
              clinicCode: patient.clinicCode
            })

            const saveUserMedication = await userMedication.save();

             // check if the medication is in database
            const deleteAwaitMed = await AwaitingMedicationModel.findOneAndDelete({_id: checkAwaitingMed._id}, {new: true});
            if (!deleteAwaitMed ) continue
            
          }
          
        }

        return res.json({ message: "email verified successfully" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}

//user verified email /////////////
export const userVerifyEmail = async (
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
          .status(200)
          .json({ message: "email already verified" });
      }

      const timeDiff = new Date().getTime() - user.emailOtp.createdTime.getTime();
      if (timeDiff > OTP_EXPIRY_TIME) {
          return res.status(400).json({ message: "otp expired" });
      }

      user.emailOtp.verified = true;

      await user.save();
      
      res.status(201).json({ message: "email verified successfully, please login"});
    }catch(error){
      res.status(500).json({ message: "internal server error"});
      console.log("error verifyiing email: ", error);
    }
  }
