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
            message: `precription successfully added for ${patientExists.firstName}`,
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

        const patientId = req.params.patient_id;

        /* const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
         */
        if(!patientId){
            return res.status(400).json({ message: "please provide a valid patient_id in url params"});
        }
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId }).select("-password");
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        const patientPrescriptionDetails = await PatientPrescriptionModel.find({patientId: patientId}).sort({createdAt: -1});

        let patientMedications = [];

        for (let i = 0; i < patientPrescriptionDetails.length; i++) {
            const patientPrescriptionDetail = patientPrescriptionDetails[i];
            const medication = await MedicationModel.findOne({_id: patientPrescriptionDetail.medicationId})
            
            const obj = {
                patientPrescriptionDetail,
                medication
            }

            patientMedications.push(obj)
        }


        return res.status(200).json({
            patient: patientExists,
            patientMedications

        })
      
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });

        
    }
}



// doctor delete patient medication 
export const doctorDeletePatientPrescriptioController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
            prescriptionId,
            patientId,
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId }).select("-password");
        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

       const deletePrescription = await PatientPrescriptionModel.findOneAndDelete({_id: prescriptionId, patientId}, {new: true})

       if (!deletePrescription) {
        return res
        .status(401)
        .json({ message: "invalid prescription ID" });
       }


        return res.status(200).json({
            message: `prescription deleted successfully`,
        })
      
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });

        
    }
}

