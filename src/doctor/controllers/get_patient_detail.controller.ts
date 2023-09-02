import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

import PatientModel from "../modal/patient_reg.model";


//doctor get all registered patient /////////////

export const doctorGetAllRegisteredPatient = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
       const doctor = req.doctor;
       const doctorPatients = await PatientModel.find({doctorId: doctor._id});

       return res.status(200).json({
        message: "success",
        patients: doctorPatients
        })
   
     } catch (err: any) {
       // signup error
       res.status(500).json({ message: err.message });
       
     }
}



//doctor get single registered patient /////////////

export const doctorGetSingleRegisteredPatient = async (
    req: any,
    res: Response,
    next: NextFunction
) => {
    try {
        const {id} = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
       const doctor = req.doctor;
       const doctorPatient = await PatientModel.findOne({ _id: id, doctorId: doctor._id});

       return res.status(200).json({
        message: "success",
        patient: doctorPatient
        })
   
     } catch (err: any) {
       // signup error
       res.status(500).json({ message: err.message });
       
     }
}