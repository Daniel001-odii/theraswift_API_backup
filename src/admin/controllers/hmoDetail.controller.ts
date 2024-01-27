import { validationResult } from "express-validator";
import { Request, Response } from "express";
import PatientModel from "../../doctor/modal/patient_reg.model";
import DoctorModel from "../../doctor/modal/doctor_reg.modal";

// admin get hmo detail 
export const adminGetHmo = async (
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
        
        const hmos = await DoctorModel.find({organization: "HMO"})
        .skip(skip)
        .limit(limit);

        const totalHmo = await DoctorModel.countDocuments({organization: "HMO"}); // Get the total number of documents

        return res.status(200).json({
            hmos,
            currentPage: page,
            totalPages: Math.ceil(totalHmo / limit),
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// admin get single hmo detail 
export const adminGetSingleHmo = async (
    req: any,
    res: Response
) => {
    try {
        let {
            hmoId
        } = req.query

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const hmo = await DoctorModel.findOne({_id: hmoId, organization: "HMO"})

        if (!hmo) {
            return res
            .status(401)
            .json({ message: "incorrect HMO ID" });
        }

        return res.status(200).json({
            hmo
        })
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}