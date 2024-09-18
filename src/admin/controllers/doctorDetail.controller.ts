import { validationResult } from "express-validator";
import { Request, Response } from "express";
import PatientModel from "../../doctor/modal/patient_reg.model";
import DoctorModel from "../../doctor/modal/doctor_reg.modal";
import { sendEmail } from "../../utils/send_email_utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";
import { sendSms } from "../../utils/sendSms.utility";

// admin get doctor detail 
export const adminGetDoctor = async (
    req: any,
    res: Response
) => {
    try {
        let {
            page,
            limit
        } = req.query

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const doctors = await DoctorModel.find()
        .skip(skip)
        .limit(limit);

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            doctors,
            currentPage: page,
            totalPages: Math.ceil(totalDoctor / limit),
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// admin get single doctor detail 
export const adminGetSingleDoctorOder = async (
    req: any,
    res: Response
) => {
    try {
        let {
            doctorId
        } = req.query

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const doctor = await DoctorModel.findOne({_id: doctorId})

        if (!doctor) {
            return res
            .status(401)
            .json({ message: "incorrect doctor ID" });
        }

        return res.status(200).json({
            doctor
        })
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// admin get get patient under  doctor detail 
export const adminGetPatientUnderDoctor = async (
    req: any,
    res: Response
) => {
    try {
        let {
            clinicCode,
            page,
            limit
        } = req.query

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;

        const patients = await PatientModel.find({clinicCode})
        .skip(skip)
        .limit(limit);

        const totalpatient = await PatientModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patients,
            currentPage: page,
            totalPages: Math.ceil(totalpatient / limit),
        })
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// admin get single patient under doctor detail 
export const adminGetSinglePatientUnderDoctorOder = async (
    req: any,
    res: Response
) => {
    try {
        let {
            clinicCode,
            patientId
        } = req.query

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const patient = await PatientModel.findOne({_id: patientId, clinicCode})

        if (!patient) {
            return res
            .status(401)
            .json({ message: "incorrect patient ID" });
        }

        return res.status(200).json({
            patient
        })
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// admin get doctor that request clinic Code 
export const adminGetDoctorRequestClinicCode = async (
    req: any,
    res: Response
) => {
    try {
        let {
            page,
            limit
        } = req.query

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        
        const doctors = await DoctorModel.find({requestClinicCode: "request"})
        .skip(skip)
        .limit(limit);

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            doctors,
            currentPage: page,
            totalPages: Math.ceil(totalDoctor / limit),
        })
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// admin give doctor clinic Code by email
export const adminGiveDoctorClinicCode = async (
    req: any,
    res: Response
) => {
    try {
        let {
            email
        } = req.body

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const doctor = await DoctorModel.findOne({email})

        if (!doctor) {
            return res
            .status(401)
            .json({ message: "incorrect email" });
        }

        if (!doctor.superDoctor) {
            return res
            .status(401)
            .json({ message: "this email is not for super admin" });
        }

        // if (doctor.clinicCode !== '') {
        //     return res
        //     .status(401)
        //     .json({ message: "clinic code already exist" });
        // }

        // const date = new Date()

        // const numberString = Math.abs(date.getTime()).toString();

        // const clinicCode = numberString.slice(-6);

        doctor.clinicVerification.isVerified = true
        doctor.requestClinicCode = 'given'
        await doctor.save()

        let emailData = {
            emailTo: email,
            subject: "Theraswift clinic code",
            otp: doctor.clinicCode,
            firstName: doctor.firstName,
        };

        sendEmail(emailData);

        return res.status(200).json({
            message: "clinic code sent to your email"
        })
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// admin give doctor clinic Code by phone number
export const adminGiveDoctorClinicCodebyPhoneNumber = async (
    req: any,
    res: Response
) => {
    try {
        let {
            mobileNumber
        } = req.body

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // format mobile number to international format
        let phonenumber = modifiedPhoneNumber(mobileNumber);
        
        const doctor = await DoctorModel.findOne({phoneNumber: phonenumber})

        if (!doctor) {
            return res
            .status(401)
            .json({ message: "incorrect phnone number" });
        }

        if (!doctor.superDoctor) {
            return res
            .status(401)
            .json({ message: "this email is not for super admin" });
        }

        // if (doctor.clinicCode !== '') {
        //     return res
        //     .status(401)
        //     .json({ message: "clinic code already exist" });
        // }

        // const date = new Date()

        // const numberString = Math.abs(date.getTime()).toString();

        // const clinicCode = numberString.slice(-6);

        doctor.clinicVerification.isVerified = true
        doctor.requestClinicCode = 'given'
        await doctor.save()

        let sms = `Hello ${
            doctor!.firstName
          } your Theraswift clinic code is ${doctor.clinicCode}`;
        
          let data = { to: phonenumber, sms };
    
          sendSms(data);

        return res.status(200).json({
            message: `clinic code ${doctor.clinicCode} sent to your phone number`
        })
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}
