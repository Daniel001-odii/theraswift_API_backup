import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import DoctotModel from "../modal/doctor_reg.modal";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";


//doctor request for clinic code by email /////////////
export const doctorRequestCodeByEmailController = async (
    req: Request,
    res: Response,
    next: NextFunction
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
    
        // try find doctor with the same email
        const doctor = await DoctotModel.findOne({ email });
    
        // check if doctor exists
        if (!doctor) {
            return res
            .status(401)
            .json({ message: "invalid email" });
        }
  
        if (!doctor.emailOtp.verified) {
            return res.status(401).json({ message: "email not verified." });
        }
    
        if (!doctor.superDoctor) {
            return res.status(401).json({ message: "you can't request clinic code." });
        }

        if (doctor.requestClinicCode === 'request' || doctor.requestClinicCode === 'given' ) {
          return res.status(401).json({ message: "clinic code requested already" });
        }

        const date = new Date()

        const numberString = Math.abs(date.getTime()).toString();

        const clinicCode = numberString.slice(-6);

        doctor.clinicCode = clinicCode
        doctor.requestClinicCode = 'request',
        await doctor.save()
  
      // return access token
      res.json({
        message: "request sent successfully",
      });
  
      
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
}


//doctor request for clinic code by phone number /////////////
export const doctorRequestCodeByPhoneNumberController = async (
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
    const doctor = await DoctotModel.findOne({ phoneNumber: phonenumber});
  
     // check if user exists
     if (!doctor) {
      return res
        .status(401)
        .json({ message: "invalid phonenumber" });
    }
  
    if (!doctor.phoneNumberOtp.verified) {
      return res.status(401).json({ message: "mobile number not verified." });
    }
  
    if (!doctor.superDoctor) {
        return res.status(401).json({ message: "you can't request clinic code." });
    }

    if (doctor.requestClinicCode === 'request' || doctor.requestClinicCode === 'given' ) {
      return res.status(401).json({ message: "clinic code requested already" });
    }

    const date = new Date()

    const numberString = Math.abs(date.getTime()).toString();

    const clinicCode = numberString.slice(-6);

    doctor.clinicCode = clinicCode
    doctor.requestClinicCode = 'request',
    await doctor.save()
  
    // return access token
    res.json({
      message: "request sent successfully"
    }); 
  
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
  
  }