import { validationResult } from "express-validator";
import { Request, Response } from "express";
import PatientModel from "../../doctor/modal/patient_reg.model";
import DoctorModel from "../../doctor/modal/doctor_reg.modal";
import PatientOrderModel from "../../doctor/modal/patientOrder.model";
import PatietPRescription from "../../doctor/modal/patientPrescription.model";
import MedicationModel from "../models/medication.model";


// admin send doctor order to hmo
export const adminSendingPatientOrderToHmo = async (
    req: any,
    res: Response
) => {
    try {
        let {
            patientId,
            hmoClinicCode
        } = req.body

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const patient = await PatientModel.findOne({_id: patientId});

        if (!patient) {
            return res
            .status(401)
            .json({ message: "incorrect patient ID" });
        }

        const hmo = await DoctorModel.find({clinicCode: hmoClinicCode});

        if (hmo.length < 1) {
            return res
            .status(401)
            .json({ message: "HMO not avialable" });
        }

        const orders = await PatientOrderModel.find({patientId: patient._id, status: "pending", toHmo: "yes", hmoState: "admin"});

        if (orders.length < 1) {
            return res
            .status(401)
            .json({ message: "no order for hmo for this particular patient" });
        }

        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            
            const singleOrder = await PatientOrderModel.findOne({_id: order._id})

            if (!singleOrder) continue

            singleOrder.hmoState = "hmo"
            await singleOrder.save()
        }

        return res.status(200).json({
            message: 'order successfully sent to HMO'
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// admin get patient order sent to hmo
export const adminGetPatientOrderSentToHmo = async (
    req: any,
    res: Response
) => {
    try {
        let {
            patientId,
        } = req.query

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const patient = await PatientModel.findOne({_id: patientId});

        if (!patient) {
            return res
            .status(401)
            .json({ message: "incorrect patient ID" });
        }

        const orders = await PatientOrderModel.find({patientId: patient._id, status: "pending", toHmo: "yes", hmoState: "hmo"});

        if (orders.length < 1) {
            return res
            .status(401)
            .json({ message: "no patient order at Hmo" });
        }

        return res.status(200).json({
            orders
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}