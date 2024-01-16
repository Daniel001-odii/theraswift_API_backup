import { validationResult } from "express-validator";
import { Request, Response } from "express";
import PatientModel from "../../doctor/modal/patient_reg.model";
import DoctorModel from "../../doctor/modal/doctor_reg.modal";


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
