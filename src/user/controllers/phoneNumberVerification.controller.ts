import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import { generateOTP, OTP_EXPIRY_TIME } from "../../utils/otpGenerator";
import { sendSms } from "../../utils/sendSms.utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";
import PatientModel from "../../doctor/modal/patient_reg.model";
import AwaitingMedicationModel from "../../admin/models/awaitingMedication.model";
import UserMedicationModel from "../models/medication.model";
import MedicationModel from "../../admin/models/medication.model";


//user send email /////////////
export const userSendPhoneNumberController = async (
    req: Request,
    res: Response,
) => {

    try {
        const {
            mobileNumber,
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // format mobile number to international format
        let phonenumber = modifiedPhoneNumber(mobileNumber);
    
        // try find user with the same email
        const user = await UserModel.findOne({ mobileNumber: phonenumber });
    
         // check if user exists
         if (!user) {
          return res
            .status(401)
            .json({ message: "invalid mobile number" });
        }

        const otp = generateOTP()

        const createdTime = new Date();

        user!.phoneNumberOtp = {
            otp,
            createdTime,
            verified : false
        }

        await user?.save();

        let sms = `Hello ${
            user!.firstName
        } your Theraswift mobile number verification OTP is ${otp}`;
      
        let data = { to: phonenumber, sms };

        sendSms(data);
        

        return res.status(200).json({ message: `OTP sent successfully ${mobileNumber}: ${otp}`, });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
    
}

//user verified phone number /////////////
export const userPhoneNumberVerificationController = async (
    req: Request,
    res: Response,
) => {
    try {
        const {
            mobileNumber,
            otp
        } = req.body;
        // Check for validation errors
        const errors = validationResult(req);
    
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        // format mobile number to international format
        let phonenumber = modifiedPhoneNumber(mobileNumber);
    
        // try find user with the same email
        const user = await UserModel.findOne({ mobileNumber: phonenumber });
    
         // check if user exists
         if (!user) {
          return res
            .status(401)
            .json({ message: "invalid mobile number" });
        }

        if (user.phoneNumberOtp.otp != otp) {
            return res
            .status(401)
            .json({ message: "invalid otp" });
        }

        if (user.phoneNumberOtp.verified) {
            return res
            .status(401)
            .json({ message: "mobile number already verified" });
        }

        const timeDiff = new Date().getTime() - user.phoneNumberOtp.createdTime.getTime();
        if (timeDiff > OTP_EXPIRY_TIME) {
            return res.status(400).json({ message: "otp expired" });
        }

        user.phoneNumberOtp.verified = true;

        await user.save();

        const checkAwaitingMeds = await AwaitingMedicationModel.find({phoneNumber: phonenumber})

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

        return res.json({ message: "mobile number verified successfully" });
    
      } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}

