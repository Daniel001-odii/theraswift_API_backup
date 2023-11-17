import { validationResult } from "express-validator";
import { Request, Response} from "express";
import PatientHmo from "../modal/patientHmo.model";

// doctor doctor get patient HMO order
export const doctorgetPatientHmoPending = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
           
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const pendingHmo = await PatientHmo.find({clinicCode: doctor.clinicCode, status: "pending"}).sort({createdAt: -1});

        return res.status(200).json({
            pendingHmo
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// doctor get patient Hmo approved
export const doctorgetPatientHmoApproved = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
           
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const approvedHmo = await PatientHmo.find({clinicCode: doctor.clinicCode, status: "approved"}).sort({createdAt: -1});

        return res.status(200).json({
            approvedHmo
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// doctor get patient Hmo denied
export const doctorgetPatientHmodenied = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
           
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const deniedHmo = await PatientHmo.find({clinicCode: doctor.clinicCode, status: "denied"}).sort({createdAt: -1});

        return res.status(200).json({
            deniedHmo
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}