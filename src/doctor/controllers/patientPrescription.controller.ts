import { validationResult } from "express-validator";
import { Request, Response} from "express";
import PatientPrescriptionModel from "../modal/patientPrescription.model";
import PatientModel from "../modal/patient_reg.model";
import MedicationModel from "../../admin/models/medication.model";
import DoctorModel from "..//modal/doctor_reg.modal";
import { sendEmail } from "../../utils/sendEmailGeneral";
import { sendSms } from "../../utils/sendSms.utility";
import { IMedicationDetails } from "../interface/prescription.interface";

// doctor prescribe medication for patient
export const patientPrescriptionController = async (req: any, res: Response) => {
    try {
      const doctor = req.doctor; // Assuming `req.doctor` is populated via middleware
      const { medications, patientId } = req.body;
  
      // Validate request body
      /* const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
   */
      // Check if patient exists
      const patientExists = await PatientModel.findById(patientId);
      if (!patientExists) {
        return res.status(404).json({ message: "Patient does not exist" });
      }
  
      // Calculate the total cost of medications and validate their existence
      let totalAmount = 0;
      const validatedMedications: IMedicationDetails[] = [];
  
      for (const med of medications) {
        const { dosage, frequency, route, duration, medicationId } = med;
        const medication = await MedicationModel.findById(medicationId);
  
        if (!medication) {
          return res.status(404).json({
            message: `Medication with ID ${medicationId} does not exist`,
          });
        }
  
        totalAmount += medication.price;
  
        validatedMedications.push({
          dosage,
          frequency,
          route,
          duration,
        });
      }
  
      // Create and save the patient prescription
      const newPrescription = new PatientPrescriptionModel({
        status: "pending",
        doctorId: doctor._id,
        patientId,
        medications: validatedMedications,
        clinicCode: doctor.clinicCode,
      });
  
      const savedPrescription = await newPrescription.save();
  
      // Send SMS to the patient
      const smsPayload = {
        to: `+${patientExists.phoneNumber}`,
        sms: `Hi ${patientExists.firstName}, you have a new prescription. Total cost: ${totalAmount}. Check your prescriptions at: theraswift.co/prescriptions/${savedPrescription._id}/checkout`,
      };
      await sendSms(smsPayload);
  
      // Respond with the prescription details
      return res.status(201).json({
        message: "Prescription successfully added",
        patient: {
          id: patientExists._id,
          name: `${patientExists.firstName} ${patientExists.surname}`,
          phone: patientExists.phoneNumber,
        },
        prescription: {
          id: savedPrescription._id,
          status: savedPrescription.status,
          medications: savedPrescription.medications,
          totalAmount,
        },
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
};

// ___ ___ \\
export const patientPrescriptionDetailController = async (req: any, res: Response) => {
    try{}catch(error){}
}



// add medication to patient prescription..
export const addMedicationToPrescriptionOld = async (req: any, res: Response) => {
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

export const addMedicationToPrescription = async (req: any, res: Response) => {
    try {
      const prescription_id = req.params.prescription_id;
      const { medication } = req.body; // Expecting a single medication object
  
      if (!prescription_id) {
        return res
          .status(400)
          .json({ message: "Missing prescription_id in URL params" });
      }
  
      // Check if prescription exists
      const prescription = await PatientPrescriptionModel.findById(prescription_id);
      if (!prescription) {
        return res.status(404).json({ message: "Prescription does not exist!" });
      }
  
      // Validate medication (ensure required fields are present)
      const { medicationId, dosage, frequency, route, duration } = medication;
      if (!medicationId || !dosage || !frequency || !route || !duration) {
        return res
          .status(400)
          .json({ message: "Incomplete medication details in request body" });
      }
  
      // Verify the medication exists
      const medicationRecord = await MedicationModel.findById(medicationId);
      if (!medicationRecord) {
        return res
          .status(404)
          .json({ message: `Medication with ID ${medicationId} does not exist` });
      }
  
      // Add new medication details to the prescription
      prescription.medications.push({ dosage, frequency, route, duration });
      await prescription.save();
  
      // Calculate the total cost of all medications in the prescription
      const total_price = prescription.medications.reduce((total, med) => {
        // Find price for each medication using its ID
        if (med) {
          const price = medicationRecord?.price || 0;
          return total + price;
        }
        return total;
      }, 0);
  
      res.status(201).json({
        message: "New medication added to prescription successfully!",
        total_price,
      });
    } catch (error: any) {
      res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
  






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

