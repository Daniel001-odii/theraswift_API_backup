import { validationResult } from "express-validator";
import { Request, Response } from "express";
import PatientPrescriptionModel from "../../doctor/modal/patientPrescription.model";
import PatientModel from "../../doctor/modal/patient_reg.model";
import MedicationModel from "../../admin/models/medication.model";
import DoctorModel from "../../doctor/modal/doctor_reg.modal";
import PatientOrderFromDoctor from "../../admin/models/orderFromDoctor.model";
import PatientHmo from "../../doctor/modal/patientHmo.model";


// admin get pending order from doctor 
export const adminGetPendingDoctorOder = async (
    req: any,
    res: Response
) => {
    try {

        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const pendingOder = await PatientOrderFromDoctor.find({status: "pending"})
        .populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

        const totalOrders = await PatientOrderFromDoctor.countDocuments({status: "pending"}); // Get the total number of documents


        return res.status(200).json({
            pendingOder,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// admin get paid order from doctor 
export const adminGetPaidDoctorOder = async (
    req: any,
    res: Response
) => {
    try {

        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const paidOder = await PatientOrderFromDoctor.find({status: "paid"})
        .populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

        const totalOrders = await PatientOrderFromDoctor.countDocuments({status: "paid"}); // Get the total number of documents


        return res.status(200).json({
            paidOder,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// admin get delivered order from doctor 
export const adminGetDeliverdDoctorOder = async (
    req: any,
    res: Response
) => {
    try {

        const page = parseInt(req.body.page) || 1; // Page number, default to 1
        const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const deliveredOder = await PatientOrderFromDoctor.find({status: "delivered"})
        .populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address')
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit);

        const totalOrders = await PatientOrderFromDoctor.countDocuments({status: "delivered"}); // Get the total number of documents


        return res.status(200).json({
            deliveredOder,
            currentPage: page,
            totalPages: Math.ceil(totalOrders / limit),
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}