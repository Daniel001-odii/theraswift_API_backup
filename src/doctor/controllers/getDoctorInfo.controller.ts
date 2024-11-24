import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import DoctorModel from "../modal/doctor_reg.modal";



export const getDoctorInfoController = async (
  req: Request,
  res: Response,
) => {
  try {
    const {
      doctorId
    } = req.query; // Changed from req.body to req.query
    
    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
  
    // try find user with the same ID...
    const doctor = await DoctorModel.findById(doctorId);
  
    // check if user exists
    if (!doctor) {
      return res
        .status(404)
        .json({ message: "Doctor not found" })
    }


    // get the super doctor...(doctor with thesame clinic code but with superDoctor as true)
    const super_doctor = await DoctorModel.findOne({ clinicCode: doctor?.clinicCode, superDoctor: true });

  
    return res.status(200).json({
      
      _id: doctor?._id,
      firstName: doctor?.firstName,
      lastName: doctor?.lastName,
      email: doctor?.email,
      organization: doctor?.organization,
      title: doctor?.title,
      addresss: doctor?.addresss,
      speciality: doctor?.speciality,
      regNumber: doctor?.regNumber,

      super_doctor,
    })
  
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message })
  }
}


