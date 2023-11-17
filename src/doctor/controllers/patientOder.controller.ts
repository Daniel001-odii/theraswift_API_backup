import { validationResult } from "express-validator";
import { Request, Response} from "express";
import PatientPrescriptionModel from "../modal/patientPrescription.model";
import PatientModel from "../modal/patient_reg.model";
import MedicationModel from "../../admin/models/medication.model";
import DoctorModel from "..//modal/doctor_reg.modal";
import PatientOrderFromDoctor from "../../admin/models/orderFromDoctor.model";
import PatientHmo from "../modal/patientHmo.model";


// doctor sending patint medication order for out of pocket
export const doctorSendPatientOderOutOFPocketController = async (
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

        const precriptions = await PatientPrescriptionModel.find({patientId, clinicCode: doctor.clinicCode})

        if (precriptions.length < 1) {
            return res
            .status(401)
            .json({ message: "no priscription for this patient" });
        }

        let totalCost = 0;
        let medArray = [];

        for (let i = 0; i < precriptions.length; i++) {
            const precription = precriptions[i];

            const medication = await MedicationModel.findOne({_id: precription.medicationId});

            if (!medication) {
                continue;
            }

            totalCost = totalCost + parseInt(medication.price)

            const medicationObt = {
                meidcationId: medication._id,
                name: medication.name,
                form: medication.form,
                strength: medication.strength,
                quantity: medication.quantity,
                price: medication.price.toString(),
                orderQuantity: 1,
                dosage: precription.dosage,
                frequency: precription.frequency,
                route: precription.route,
                duration: precription.duration,
            }

            medArray.push(medicationObt);
            
        }

        const order = new PatientOrderFromDoctor({
            patientId,
            doctortId: doctor._id,
            clinicCode:  doctor.clinicCode,
            paymentId: '',
            medications: medArray,
            deliveryDate: "",
            totalAmount: totalCost.toString(),
            amountPaid: "0",
            paymentDate: '',
            methodOfPayment: "pocket",
            hmoName: "",
            status: "pending"
        });

        const saveOder = await order.save();
        return res.status(200).json({
            message: "oder successfully sent to pharmacy",
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// doctor sending patint medication order for HMO
export const doctorSendPatientOderHmoController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
            patientId,
            firstName,
            surname,
            phoneNumber,
            EnroleNumber,
            email,
            address,
            medicalCode,
            medicalRecord,
            hmoID,
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

        //check for hmo
        const hmo = await DoctorModel.findOne({_id: hmoID, organization: "HMO"})
        if (!hmo) {
            return res
            .status(401)
            .json({ message: "hmo not found" });
        }

        const precriptions = await PatientPrescriptionModel.find({patientId, clinicCode: doctor.clinicCode})

        if (precriptions.length < 1) {
            return res
            .status(401)
            .json({ message: "no priscription for this patient" });
        }

        let totalCost = 0;
        let medArray = [];

        for (let i = 0; i < precriptions.length; i++) {
            const precription = precriptions[i];

            const medication = await MedicationModel.findOne({_id: precription.medicationId});

            if (!medication) {
                continue;
            }

            totalCost = totalCost + parseInt(medication.price)

            const medicationObt = {
                meidcationId: medication._id,
                name: medication.name,
                form: medication.form,
                strength: medication.strength,
                quantity: medication.quantity,
                price: medication.price.toString(),
                orderQuantity: 1,
                dosage: precription.dosage,
                frequency: precription.frequency,
                route: precription.route,
                duration: precription.duration,
            }

            medArray.push(medicationObt);
            
        }

        const order = new PatientOrderFromDoctor({
            patientId,
            doctortId: doctor._id,
            clinicCode:  doctor.clinicCode,
            paymentId: '',
            medications: medArray,
            deliveryDate: "",
            totalAmount: totalCost.toString(),
            amountPaid: "0",
            paymentDate: '',
            methodOfPayment: "HMO",
            hmoName: `${hmo.firstName} ${hmo.lastName}`,
            status: "pending"
        });

        const saveOder = await order.save();

        const patientHMO = new PatientHmo({
            firstName,
            surname,
            phoneNumber,
            EnroleNumber,
            email,
            address,
            medicalCode,
            medicalRecord,
            status: "pending",
            doctorId: doctor._id,
            patientId: patientId,
            hmoID: hmoID,
            clinicCode: doctor.clinicCode,
            orderId: saveOder._id,
        })

        const savePatientHmo = await patientHMO.save();
        return res.status(200).json({
            message: "oder successfully sent to pharmacy",
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }


}



// doctor doctor get patient pending order
export const doctorgetPatientOderPending = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
           
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const pendingOder = await PatientOrderFromDoctor.find({clinicCode: doctor.clinicCode, status: "pending"}).populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address').sort({createdAt: -1});

        return res.status(200).json({
            pendingOder
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// doctor get patient paid order
export const doctorgetPatientOderPaid = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
           
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const paidgOder = await PatientOrderFromDoctor.find({clinicCode: doctor.clinicCode, status: "paid"}).populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address').sort({createdAt: -1});

        return res.status(200).json({
            paidgOder
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// doctor get patient delieverd order
export const doctorgetPatientOderdelieverd = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;

        const {
           
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        

        const delieverdegOder = await PatientOrderFromDoctor.find({clinicCode: doctor.clinicCode, status: "delivered"}).populate('patientId', 'firstName surname email phoneNumber gender dateOFBirth address').sort({createdAt: -1});

        return res.status(200).json({
            delieverdegOder
        })

        

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}

