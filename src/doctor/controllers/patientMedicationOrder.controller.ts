import { validationResult } from "express-validator";
import { Request, Response } from "express";
import MedicationModel from "../../admin/models/medication.model";
import PatientPrescriptionModel from "../modal/patientPrescription.model";
import PatientModel from "../modal/patient_reg.model";
import DoctorModel from "..//modal/doctor_reg.modal";
import PatientOrderModel from "../modal/patientOrder.model";


// doctor send patient prescription for hmo
export const patientOderHmoController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
            patientId,
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        //get all patient prescription
        const patientPrescriptions = await PatientPrescriptionModel.find({patientId});
        if (patientPrescriptions.length < 1) {
            return res
            .status(401)
            .json({ message: "no prescripton for this patient" });
        }

        for (let i = 0; i < patientPrescriptions.length; i++) {
            const patientPrescription = patientPrescriptions[i];

            const medication = await MedicationModel.findOne({_id: patientPrescription.medicationId})

            if (!medication) continue;

            const patientOrder =  new PatientOrderModel({
                patientPrescriptionId: patientPrescription._id,
                patientId: patientId,
                medicationId: medication._id,
                clinicCode: patientPrescription.clinicCode,
                patientPayment: medication.price,
                hmoPayment: 0,
                status: "pending",
                toHmo: "yes",
                hmoState: "admin",
            })

            await patientOrder.save();
            
        }

        
        return res.status(200).json({
            message: "order successfully sent",
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// doctor send patient prescription out of pocket
export const patientOderOutPocketController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
            patientId,
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        //get all patient prescription
        const patientPrescriptions = await PatientPrescriptionModel.find({patientId});
        if (patientPrescriptions.length < 1) {
            return res
            .status(401)
            .json({ message: "no prescripton for this patient" });
        }

        for (let i = 0; i < patientPrescriptions.length; i++) {
            const patientPrescription = patientPrescriptions[i];

            const medication = await MedicationModel.findOne({_id: patientPrescription.medicationId})

            if (!medication) continue;

            const patientOrder =  new PatientOrderModel({
                patientPrescriptionId: patientPrescription._id,
                patientId: patientId,
                medicationId: medication._id,
                clinicCode: patientPrescription.clinicCode,
                patientPayment: medication.price,
                hmoPayment: 0,
                status: "pending",
                toHmo: "no",
                hmoState: "",
            })

            await patientOrder.save();
            
        }

        
        return res.status(200).json({
            message: "order successfully sent",
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// doctor get patient order prescription pendingg
export const getpatientPriscriptionPendindController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
            patientId,
        } = req.query;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        const pendnigOrders = await PatientOrderModel.find({patientId, status: "pending"});

        let orderMedication = []

        for (let i = 0; i < pendnigOrders.length; i++) {
            const pendnigOrder = pendnigOrders[i];

            const patientPriscription = await PatientPrescriptionModel.findOne({_id: pendnigOrder.patientPrescriptionId})

            if (!patientPriscription) continue;

            const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})

            if (!medication) continue;

            const obj = {
                order: pendnigOrder,
                patientPriscription,
                medication,
            }

            orderMedication.push(obj)
            
        }

        
        return res.status(200).json({
            orderMedication
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// doctor get patient order prescription progress
export const getpatientPriscriptionProgressController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
            patientId,
        } = req.query;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        const pendnigOrders = await PatientOrderModel.find({patientId, status: "progress"});

        let orderMedication = []

        for (let i = 0; i < pendnigOrders.length; i++) {
            const pendnigOrder = pendnigOrders[i];

            const patientPriscription = await PatientPrescriptionModel.findOne({_id: pendnigOrder.patientPrescriptionId})

            if (!patientPriscription) continue;

            const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})

            if (!medication) continue;

            const obj = {
                order: pendnigOrder,
                patientPriscription,
                medication,
            }

            orderMedication.push(obj)
            
        }

        
        return res.status(200).json({
            orderMedication
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// doctor get patient order prescription delivered
export const getpatientPriscriptionDeliverdeController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
            patientId,
        } = req.query;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        const pendnigOrders = await PatientOrderModel.find({patientId, status: "delivered"});

        let orderMedication = []

        for (let i = 0; i < pendnigOrders.length; i++) {
            const pendnigOrder = pendnigOrders[i];

            const patientPriscription = await PatientPrescriptionModel.findOne({_id: pendnigOrder.patientPrescriptionId})

            if (!patientPriscription) continue;

            const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})

            if (!medication) continue;

            const obj = {
                order: pendnigOrder,
                patientPriscription,
                medication,
            }

            orderMedication.push(obj)
            
        }

        
        return res.status(200).json({
            orderMedication
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


