import { validationResult } from "express-validator";
import { Request, Response } from "express";
import MedicationModel from "../../admin/models/medication.model";
import PatientPrescriptionModel from "../modal/patientPrescription.model";
import PatientModel from "../modal/patient_reg.model";
import DoctorModel from "..//modal/doctor_reg.modal";
import PatientOrderModel from "../modal/patientOrder.model";


// hmo get patient medication order send to him
export const hmoGetPatientOrderSentToHimController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;

        const {
            patientId,
        } = req.query;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const doctorExist = await DoctorModel.findOne({_id: doctorId});

        if (!doctorExist) {
            return res
            .status(401)
            .json({ message: "incorrect doctor ID" });
        }

        if (doctorExist.organization != 'HMO') {
            return res
            .status(401)
            .json({ message: "hmo role" });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        const ordersAtHmos = await PatientOrderModel.find({patientId, status: "pending", toHmo: "yes", hmoState: "hmo"});

        let orderMedication = []

        for (let i = 0; i < ordersAtHmos.length; i++) {
            const ordersAtHmo = ordersAtHmos[i];

            const patientPriscription = await PatientPrescriptionModel.findOne({_id: ordersAtHmo.patientPrescriptionId})

            if (!patientPriscription) continue;

            const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})

            if (!medication) continue;

            const obj = {
                order: ordersAtHmo,
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


// hmo take action on each order sent to him either to pay full or halve or not
export const hmoTakeActionOnOrderSentToHimController = async (
    req: any,
    res: Response
) => {
    try {

        const doctor = req.doctor;
        const doctorId = doctor._id;

        const {
            patientId,
            orderId,
            amount
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const doctorExist = await DoctorModel.findOne({_id: doctorId});

        if (!doctorExist) {
            return res
            .status(401)
            .json({ message: "incorrect doctor ID" });
        }

        if (doctorExist.organization != 'HMO') {
            return res
            .status(401)
            .json({ message: "hmo role" });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        const order = await PatientOrderModel.findOne({_id: orderId, patientId, status: "pending", toHmo: "yes", hmoState: "hmo"});
        if (!order) {
            return res
            .status(401)
            .json({ message: "incorrect Order ID" });
        }

        const patientPriscription = await PatientPrescriptionModel.findOne({_id: order.patientPrescriptionId})
        if (!patientPriscription){
            return res
            .status(401)
            .json({ message: "no preiscription for this order" });
        }

        const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})
        if (!medication){
            return res
            .status(401)
            .json({ message: "medication do not exits" });
        }

        if (amount > medication.price) {
            return res
            .status(401)
            .json({ message: "the amount you enter is above the price" });
        }

        if (amount < 1) {
            return res
            .status(401)
            .json({ message: "enter reasonable amount" });
        }

        order.hmoPayment = amount;
        order.hmoState = "final";
        await order.save()

        return res.status(200).json({
            message: "order successfully mark" 
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// hmo get patient medication order he has taken action on
export const hmoGetPatientOrdeHeTakeActionController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;

        const {
            patientId,
        } = req.query;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const doctorExist = await DoctorModel.findOne({_id: doctorId});

        if (!doctorExist) {
            return res
            .status(401)
            .json({ message: "incorrect doctor ID" });
        }

        if (doctorExist.organization != 'HMO') {
            return res
            .status(401)
            .json({ message: "hmo role" });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        const ordersAtFinals = await PatientOrderModel.find({patientId, status: "pending", toHmo: "yes", hmoState: "final"});

        let orderMedication = []

        for (let i = 0; i < ordersAtFinals.length; i++) {
            const ordersAtFinal = ordersAtFinals[i];

            const patientPriscription = await PatientPrescriptionModel.findOne({_id: ordersAtFinal.patientPrescriptionId})

            if (!patientPriscription) continue;

            const medication = await MedicationModel.findOne({_id: patientPriscription.medicationId})

            if (!medication) continue;

            const obj = {
                order: ordersAtFinal,
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