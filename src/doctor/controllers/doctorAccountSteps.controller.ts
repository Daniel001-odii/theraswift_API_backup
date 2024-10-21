import { Request, Response, NextFunction } from "express";
import DoctotModel from "../modal/doctor_reg.modal";

//Verify Profile Details /////////////
export const doctorVerifyProfileDetails = async (
    req: any,
    res: Response,
    next: NextFunction
) => {

  try {
    
    const {
        verifyAccountProfile
    } = req.body;

    if (typeof verifyAccountProfile !== "boolean"){
        return res.status(400).json({ message: "Invalid request body (verifyAccountProfile should be a boolean)" })
    }
    
    
    const doctor = await DoctotModel.findOne({ _id: req.doctor._id })

    if(doctor){
        doctor.completedActionSteps.step1.verifiedProfileDetails = verifyAccountProfile;
        await doctor.save()
    }
    
    return res.json({
        message: "Doctor Profile Detailed Verified"
    })

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message })
  }
}