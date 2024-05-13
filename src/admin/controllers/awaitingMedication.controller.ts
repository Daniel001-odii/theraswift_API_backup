import { validationResult } from "express-validator";
import { Request, Response } from "express";
import PatientModel from "../../doctor/modal/patient_reg.model";
import DoctorModel from "../../doctor/modal/doctor_reg.modal";
import PatientOrderModel from "../../doctor/modal/patientOrder.model";
import PatietPRescription from "../../doctor/modal/patientPrescription.model";
import MedicationModel from "../models/medication.model";
import AwaitingMedicationModel from "../models/awaitingMedication.model";
import { sendEmail } from "../../utils/sendEmailGeneral";
import { htmlMailLinkTemplate } from "../../templates/admin/sendLinkTemlate";
import { SINGIN_LINK, SINGUP_LINK } from "../../utils/otpGenerator";
import { sendSms } from "../../utils/sendSms.utility";
import { modifiedPhoneNumber } from "../../utils/mobilNumberFormatter";


// admin send order to patient through email
export const adminSendingPatientOrderToEmail = async (
    req: any,
    res: Response
) => {
    try {
        let {
            patientId,
            // hmoClinicCode
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

        const orders = await PatientOrderModel.find({patientId: patient._id, status: "progress",});

        if (orders.length < 1) {
            return res
            .status(401)
            .json({ message: "no order for this patient" });
        }

        let count = 0

        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            
            const singleOrder = await PatientOrderModel.findOne({_id: order._id})
            if (!singleOrder) continue

            const medication = await MedicationModel.findOne({_id: singleOrder.medicationId})
            if (!medication) continue

            singleOrder.status = "delivered"
            await singleOrder.save()

            const newAwaitingMed = new AwaitingMedicationModel({
                patientId,
                medicationId: medication._id,
                email: patient.email
            })
            await newAwaitingMed.save()

            count++;
        }

        if (count < 1) {
            return res
            .status(401)
            .json({ message: "no order for this patient" });
        }

        const html = htmlMailLinkTemplate(patient.firstName, SINGUP_LINK)

        await sendEmail({
            emailTo: patient.email, 
            subject: 'link to signup with theraswift', 
            html
        })

        return res.status(200).json({
            message: 'email sent to successfully'
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// admin send order to patient through sms
export const adminSendingPatientOrderToSms  = async (
    req: any,
    res: Response
) => {
    try {
        let {
            patientId,
            // hmoClinicCode
        } = req.body

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const patient = await PatientModel.findOne({_id: patientId}).populate('doctorId');

        if (!patient) {
            return res
            .status(401)
            .json({ message: "incorrect patient ID" });
        }

        const doctor = await DoctorModel.findOne({_id: patient.doctorId})

        const orders = await PatientOrderModel.find({patientId: patient._id, status: "progress",});

        if (orders.length < 1) {
            return res
            .status(401)
            .json({ message: "no order for this patient" });
        }

        let count = 0

        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];
            
            const singleOrder = await PatientOrderModel.findOne({_id: order._id})
            if (!singleOrder) continue

            const medication = await MedicationModel.findOne({_id: singleOrder.medicationId})
            if (!medication) continue

            singleOrder.status = "delivered"
            await singleOrder.save()

            const newAwaitingMed = new AwaitingMedicationModel({
                patientId,
                medicationId: medication._id,
                email: patient.email
            })
            await newAwaitingMed.save()

            count++;
        }

        if (count < 1) {
            return res
            .status(401)
            .json({ message: "no order for this patient" });
        }

        let sms = `Hi ${patient.firstName}, we just recieved your prescription from ${doctor?.firstName} copy link below on browser to schedule your free delivery ${SINGUP_LINK}  ${SINGIN_LINK}`;

        // format mobile number to international format
        let phonenumber = modifiedPhoneNumber(patient.phoneNumber.toString());
      
        let data = { to: phonenumber, sms };

        sendSms(data);

        return res.status(200).json({
            message: 'email sent to successfully'
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}