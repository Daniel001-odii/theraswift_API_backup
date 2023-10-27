import { validationResult } from "express-validator";
import { Request, Response} from "express";
import PatientPrescriptionModel from "../modal/patientPrescription.model";
import PatientModel from "../modal/patient_reg.model";
import MedicationModel from "../../admin/models/medication.model";
import DoctorModel from "..//modal/doctor_reg.modal";


// doctor prescribe medication for patient
export const patientPrescriptionController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
            patientId,
            dosage,
            frequency,
            route,
            duration,
            medicationId
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

        //check if the medication is available
        const medication = await MedicationModel.findOne({_id: medicationId});
        if (!medication) {
            return res
            .status(401)
            .json({ message: "medication dose not exist" });
        }

        // Save patient prescription  to MongoDB

        const patientPrescription = new PatientPrescriptionModel({
            dosage,
            frequency,
            route,
            duration,
            status: "pending",
            doctorId: doctor._id,
            clinicCode: doctor.clinicCode,
            medicationId: medicationId,
            patientId
        });

        const patientPrescriptionSaved = await patientPrescription.save();

        return res.status(200).json({
            message: `precription succefully added for ${patientExists.firstName}`,
            patient:{
                id: patientExists._id,
                email: patientExists.email,
                firstName: patientExists.firstName,
                surname: patientExists.surname,
                phoneNumber: patientExists.phoneNumber,
                gender: patientExists.gender,
                address: patientExists.address,
                dateOFBirth: patientExists.dateOFBirth,
                doctorId: patientExists.doctorId,
            
            },
            prescription:{
                dosage: patientPrescriptionSaved.dosage,
                frequency: patientPrescriptionSaved.frequency,
                route: patientPrescriptionSaved.route,
                duration: patientPrescriptionSaved.duration,
                status: patientPrescriptionSaved.status, 
                medicationId: patientPrescriptionSaved.medicationId      
            }

        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


//patient medication detail

export const patientPrescriptionDetailController = async (
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

        const patientPrescriptionDetail = await PatientPrescriptionModel.find({patientId: patientId}).populate('medicationId', 'name price strength quantity medicationImage prescriptionRequired form ingredient medInfo').sort({createdAt: -1});


        return res.status(200).json({
            message: `precription succefully added for ${patientExists.firstName}`,
            patient:{
                id: patientExists._id,
                email: patientExists.email,
                firstName: patientExists.firstName,
                surname: patientExists.surname,
                phoneNumber: patientExists.phoneNumber,
                gender: patientExists.gender,
                address: patientExists.address,
                dateOFBirth: patientExists.dateOFBirth,
                doctorId: patientExists.doctorId,
            
            },
            prescription:{
                patientPrescriptionDetail
            }

        })
      
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });

        
    }
}


// doctor get patient prescription that was delivered
export const patientPrescriptionDeliveredDetailController = async (
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

        const patientPrescriptionDetail = await PatientPrescriptionModel.find({patientId: patientId, status: "delivered"}).populate('medicationId', 'name price strength quantity medicationImage prescriptionRequired form ingredient medInfo').sort({createdAt: -1});

        return res.status(200).json({
            message: `precription succefully added for ${patientExists.firstName}`,
            patient:{
                id: patientExists._id,
                email: patientExists.email,
                firstName: patientExists.firstName,
                surname: patientExists.surname,
                phoneNumber: patientExists.phoneNumber,
                gender: patientExists.gender,
                address: patientExists.address,
                dateOFBirth: patientExists.dateOFBirth,
                doctorId: patientExists.doctorId,
            
            },
            prescription:{
                patientPrescriptionDetail
            }

        })
      
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });

        
    }
}

// get patient prescription detail that was not delivered
export const patientPrescriptionDetailNOTDeliveredController = async (
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

        const patientPrescriptionDetail = await PatientPrescriptionModel.find({patientId: patientId, status: "pending"}).populate('medicationId', 'name price strength quantity medicationImage prescriptionRequired form ingredient medInfo').sort({createdAt: -1});

        return res.status(200).json({
            message: `precription succefully added for ${patientExists.firstName}`,
            patient:{
                id: patientExists._id,
                email: patientExists.email,
                firstName: patientExists.firstName,
                surname: patientExists.surname,
                phoneNumber: patientExists.phoneNumber,
                gender: patientExists.gender,
                address: patientExists.address,
                dateOFBirth: patientExists.dateOFBirth,
                doctorId: patientExists.doctorId,
            
            },
            prescription:{
                patientPrescriptionDetail
            }

        })
      
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });

        
    }
}