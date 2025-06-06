import { validationResult } from "express-validator";
import { Request, Response} from "express";
import PatientHmo from "../modal/patientHmo.model";
import PatientModel from "../modal/patient_reg.model";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";
import DoctorModel from "..//modal/doctor_reg.modal";


// doctor sent patient to hmo
export const doctorSentPatientToHmoController = async (
    req: any,
    res: Response
) => {
    try {
        const doctor = req.doctor;
        const doctorId = doctor._id;

        const {
            patientId,
            EnroleNumber,
            icdCode,
            hmoClinicCode
        } = req.body;

        const file = req.file;

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
        
        // check if patient exist
        const patientExists = await PatientModel.findOne({ _id: patientId });

        if (!patientExists) {
            return res
            .status(401)
            .json({ message: "patient does not exist" });
        }

        let medicalRecord;

        if (!file) {
            return res
            .status(401)
            .json({ message: "provide medical record" });
          }else{
            const filename = uuidv4();
            const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
            medicalRecord = result?.Location!;
            console.log(result);
            //medicationImg = uploadToS3(file);
          }

          const newPatientHmo = new PatientHmo({
            firstName: patientExists.firstName,
            surname: patientExists.surname,
            phoneNumber: patientExists.phoneNumber,
            EnroleNumber: EnroleNumber,
            email: patientExists.email,
            address: patientExists.address,
            medicalRecord: medicalRecord,
            status: 'pending',
            patientId: patientId,
            doctorClinicCode: doctorExist.clinicCode,
            icdCode: icdCode,
            hmoClinicCode: hmoClinicCode,
          })

          await newPatientHmo.save();

        return res.status(200).json({
            message: "patient data successfully sent to Hmo",
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// doctor get patient hmo that is pending
export const doctorGetPatientHmoPendingController = async (
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

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; //

        const pendingPatientHmo = await PatientHmo.find({doctorClinicCode: doctorExist.clinicCode, status: "pending"})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit); 

        return res.status(200).json({
            pendingPatientHmo
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// doctor get patient hmo that is approve
export const doctorGetPatientHmoApproveController = async (
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

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; //

        const approvePatientHmo = await PatientHmo.find({doctorClinicCode: doctorExist.clinicCode, status: "approved"})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit); 

        return res.status(200).json({
            approvePatientHmo
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


// doctor get patient hmo that is denied
export const doctorGetPatientHmoDeniedController = async (
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

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; //

        const deniedPatientHmo = await PatientHmo.find({doctorClinicCode: doctorExist.clinicCode, status: "denied"})
        .sort({createdAt: -1})
        .skip(skip)
        .limit(limit); 

        return res.status(200).json({
            deniedPatientHmo
        })

    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}




