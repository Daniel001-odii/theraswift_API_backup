import { validationResult } from "express-validator";
import { Request, Response} from "express";
import PatientPrescriptionModel from "../modal/patientPrescription.model";
import PatientModel from "../modal/patient_reg.model";
import MedicationModel from "../../admin/models/medication.model";
import DoctorModel from "..//modal/doctor_reg.modal";
import { sendEmail } from "../../utils/sendEmailGeneral";


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
        };

        // Save patient prescription  to MongoDB
        const patientPrescription = new PatientPrescriptionModel({
            dosage,
            frequency,
            route,
            duration,
            status: "pending",
            doctorId: doctor._id,
            clinicCode: doctor.clinicCode,
            // medicationId: medicationId,
            patientId
        });

        patientPrescription.medications.push(...medicationId);

        const patientPrescriptionSaved = await patientPrescription.save();


        let medication_total = 0;

        for (const element of patientPrescription.medications) {
            const medication_: any = await MedicationModel.findById(element);
            if (medication_) {
                medication_total += medication_.price; // Add the price of each medication to the total
                console.log("Medication details: ", medication_);
            }
        }
    
        // medication_total = medication_?.price;


        /* 
            SEND USER AN EMAIL FOR NEW PRESCRIPTIONS
        */
        const email_html = "<p>new prescription from theraswift: click the link to view</p>"
        let emailData = {
            emailTo: patientExists.email,
            subject: "Theraswift New Prescription",
            html: email_html,
          };
        // send prescription as email to user...
        // await sendEmail(emailData);



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
                medications: patientPrescriptionSaved.medications      
            },

            total_amount: `total_amnt: ${medication_total}`,

        });


    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
        
    }
}


export const patientPrescriptionDetailController = async (req: any, res: Response) => {
    try{}catch(error){}
}

// add medication to patient prescription..
export const addMedicationToPrescription = async (req: any, res: Response) => {
    try{
        const prescription_id = req.params.prescription_id;

        const { medication_id } = req.body;

        if(!prescription_id){
            return res.status(400).json({ message: "missing prescription_id on url params"});
        }

        const prescription = await PatientPrescriptionModel.findById(prescription_id);
        if(!prescription){
            return res.status(400).json({ message: "prescription does not exist!"});
        };

        prescription.medications.push(medication_id);
        await prescription.save();

        const total_meds = prescription.medications;

        // Fetch all medication prices concurrently
        const medication_prices = (
            await Promise.all(
                total_meds.map(async (id) => {
                    const meds = await MedicationModel.findById(id);
                    return meds?.price;
                })
            )
        ).filter((price): price is number => price !== undefined); // Remove undefined values
        
        // Calculate the total price
        const total_price = medication_prices.reduce((a, b) => a + b, 0);

        res.status(201).json({ message: "new medication added to prescription successfuly!", total_price: total_price })


    }catch(error: any){
        res.status(500).json({ message: "internal server error" });
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

