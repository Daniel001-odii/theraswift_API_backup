import { validationResult } from "express-validator";
import { Request, Response } from "express";
import PatientModel from "../../doctor/modal/patient_reg.model";
import DoctorModel from "../../doctor/modal/doctor_reg.modal";
import PatientOrderModel from "../../doctor/modal/patientOrder.model";
import PatietPRescription from "../../doctor/modal/patientPrescription.model";
import MedicationModel from "../models/medication.model";


// admin get doctor patient order that is pending
export const adminGetDoctorPendingPatientOrder = async (
    req: any,
    res: Response
) => {
    try {
        let {
            clinicCode
        } = req.query

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const patients = await PatientModel.find({clinicCode})

        let patientPendingOrders = []

        for (let i = 0; i < patients.length; i++) {
            const patient = patients[i];

            const pendingOrders = await PatientOrderModel.find({status: "pending", patientId: patient._id})

            if (pendingOrders.length < 1) continue

            let PendingOrder = []

            for (let i = 0; i < pendingOrders.length; i++) {
                const pendingOrder = pendingOrders[i];
                const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
                if (!prescription) continue
                const medication = await MedicationModel.findOne({_id: prescription.medicationId})
                if (!medication) continue

                const obj = {
                    order: pendingOrder,
                    prescription,
                    medication
                }

                PendingOrder.push(obj)

            }

            const objTwo = {
                patient,
                order: PendingOrder
            }

            patientPendingOrders.push(objTwo)
            
        }

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patientPendingOrders
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// admin get  doctor single patient order that is pending
export const adminGetDoctorSinglePendingPatientOrder = async (
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
      
        const patient = await PatientModel.findOne({_id: patientId, clinicCode});

        if (!patient) {
            return res
            .status(401)
            .json({ message: "incorrect patient ID" });
        }

        const pendingOrders = await PatientOrderModel.find({status: "pending", patientId: patient._id})

        if (pendingOrders.length < 1) {
            return res
            .status(401)
            .json({ message: "no pending order for this patient" });
        }

        let PendingOrder = []

        for (let i = 0; i < pendingOrders.length; i++) {
            const pendingOrder = pendingOrders[i];
            const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
            if (!prescription) continue
            const medication = await MedicationModel.findOne({_id: prescription.medicationId})
            if (!medication) continue

            const obj = {
                order: pendingOrder,
                prescription,
                medication
            }

            PendingOrder.push(obj)

        }

        const objTwo = {
            patient,
            order: PendingOrder
        }

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patientPendingOrders: objTwo
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}




// admin get doctor patient order that is progress
export const adminGetDoctorPatientProgressOrder = async (
    req: any,
    res: Response
) => {
    try {
        let {
            clinicCode
        } = req.query

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const patients = await PatientModel.find({clinicCode})

        let patientProgressOrders = []

        for (let i = 0; i < patients.length; i++) {
            const patient = patients[i];

            const pendingOrders = await PatientOrderModel.find({status: "progress", patientId: patient._id})

            if (pendingOrders.length < 1) continue

            let PendingOrder = []

            for (let i = 0; i < pendingOrders.length; i++) {
                const pendingOrder = pendingOrders[i];
                const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
                if (!prescription) continue
                const medication = await MedicationModel.findOne({_id: prescription.medicationId})
                if (!medication) continue

                const obj = {
                    order: pendingOrder,
                    prescription,
                    medication
                }

                PendingOrder.push(obj)

            }

            const objTwo = {
                patient,
                order: PendingOrder
            }

            patientProgressOrders.push(objTwo)
            
        }

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patientProgressOrders
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// admin get  doctor single patient order that is in progress
export const adminGetDoctorSingleProgressPatientOrder = async (
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
      
        const patient = await PatientModel.findOne({_id: patientId, clinicCode});

        if (!patient) {
            return res
            .status(401)
            .json({ message: "incorrect patient ID" });
        }

        const pendingOrders = await PatientOrderModel.find({status: "progress", patientId: patient._id})

        if (pendingOrders.length < 1) {
            return res
            .status(401)
            .json({ message: "no progress order for this patient" });
        }

        let PendingOrder = []

        for (let i = 0; i < pendingOrders.length; i++) {
            const pendingOrder = pendingOrders[i];
            const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
            if (!prescription) continue
            const medication = await MedicationModel.findOne({_id: prescription.medicationId})
            if (!medication) continue

            const obj = {
                order: pendingOrder,
                prescription,
                medication
            }

            PendingOrder.push(obj)

        }

        const objTwo = {
            patient,
            order: PendingOrder
        }

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patientPendingOrders: objTwo
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// admin get doctor patient order that is delivered
export const adminGetDoctorDeliveredPatientOrder = async (
    req: any,
    res: Response
) => {
    try {
        let {
            clinicCode
        } = req.query

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const patients = await PatientModel.find({clinicCode})

        let patientDeliveredOrders = []

        for (let i = 0; i < patients.length; i++) {
            const patient = patients[i];

            const pendingOrders = await PatientOrderModel.find({status: "delivered", patientId: patient._id})

            if (pendingOrders.length < 1) continue

            let PendingOrder = []

            for (let i = 0; i < pendingOrders.length; i++) {
                const pendingOrder = pendingOrders[i];
                const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
                if (!prescription) continue
                const medication = await MedicationModel.findOne({_id: prescription.medicationId})
                if (!medication) continue

                const obj = {
                    order: pendingOrder,
                    prescription,
                    medication
                }

                PendingOrder.push(obj)

            }

            const objTwo = {
                patient,
                order: PendingOrder
            }

            patientDeliveredOrders.push(objTwo)
            
        }

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patientDeliveredOrders
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// admin get  doctor single patient order that is delivered
export const adminGetDoctorSingleDeliveredPatientOrder = async (
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
      
        const patient = await PatientModel.findOne({_id: patientId, clinicCode});

        if (!patient) {
            return res
            .status(401)
            .json({ message: "incorrect patient ID" });
        }

        const pendingOrders = await PatientOrderModel.find({status: "delivered", patientId: patient._id})

        if (pendingOrders.length < 1) {
            return res
            .status(401)
            .json({ message: "no delivered order for this patient" });
        }

        let PendingOrder = []

        for (let i = 0; i < pendingOrders.length; i++) {
            const pendingOrder = pendingOrders[i];
            const prescription = await PatietPRescription.findOne({_id: pendingOrder.patientPrescriptionId})
            if (!prescription) continue
            const medication = await MedicationModel.findOne({_id: prescription.medicationId})
            if (!medication) continue

            const obj = {
                order: pendingOrder,
                prescription,
                medication
            }

            PendingOrder.push(obj)

        }

        const objTwo = {
            patient,
            order: PendingOrder
        }

        const totalDoctor = await DoctorModel.countDocuments(); // Get the total number of documents

        return res.status(200).json({
            patientPendingOrders: objTwo
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}