import { validationResult } from "express-validator";
import { Request, Response} from "express";
import PatientPrescriptionModel from "../modal/patientPrescription.model";
import PatientModel from "../modal/patient_reg.model";
import MedicationModel from "../../admin/models/medication.model";
import DoctorModel from "../modal/doctor_reg.modal";
import PatientOrderFromDoctor from "../../admin/models/orderFromDoctor.model";
import PatientHmo from "../modal/patientHmo.model";


// hmo get patient sent to him
export const hmoGetPatientSentToHimController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;

        let {
            page,
            limit
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

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; //

        const patientHmo = await PatientHmo.find({hmoClinicCode: doctorExist.clinicCode, status: "pending"})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit); 

        return res.status(200).json({
            patientHmo
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// hmo get patient aprove or denied to him
export const hmoApproveOrDeniedPatientController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;

        let {
           hmoID,
           status
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

        const patientHmo = await PatientHmo.findOne({_id: hmoID, hmoClinicCode: doctorExist.clinicCode, status: "pending"})
        
        if (!patientHmo) {
            return res
            .status(401)
            .json({ message: "incorrect hmo ID" });
        }

        patientHmo.status = status;

        await patientHmo.save()

        return res.status(200).json({
            message: "action successfully taken"
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



// hmo get patient he approve
export const hmoGetPatientHeApproveController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;

        let {
            page,
            limit
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

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; //

        const patientHmo = await PatientHmo.find({hmoClinicCode: doctorExist.clinicCode, status: "approved"})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit); 

        return res.status(200).json({
            patientHmo
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// hmo get patient he denied
export const hmoGetPatientHeDeniedController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;

        let {
            page,
            limit
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

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; //

        const patientHmo = await PatientHmo.find({hmoClinicCode: doctorExist.clinicCode, status: "denied"})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit); 

        return res.status(200).json({
            patientHmo
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}



