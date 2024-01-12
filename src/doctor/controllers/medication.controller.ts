import { validationResult } from "express-validator";
import { Request, Response } from "express";
import MedicationModel from "../../admin/models/medication.model";


//doctor searching for  medication by name /////////////
export const doctorSearchMedicationNameController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
        name
      } = req.query;
      
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const medications =  await MedicationModel.find({name: { $regex: name, $options: 'i' }});
      return res.status(200).json({
        medications
      })
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}



//doctor searching for  medication by name and form /////////////
export const doctorSearchMedicationNameFormController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
        name, 
        form
      } = req.query;
      
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const medications =  await MedicationModel.find({name, form});
      return res.status(200).json({
        medications
      })
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
}




//doctor searching for  medication by name, form and dosage /////////////
export const doctorSearchMedicationNameFormDosageController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
        name, 
        form,
        dosage
      } = req.query;
      
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const medications =  await MedicationModel.find({name, form, quantity: dosage});
      return res.status(200).json({
        medications
      })
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
  }



//doctor get medication   /////////////
export const doctorGethMedicationController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      let{
        page,
        limit
      } = req.query;
      
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
       page = page || 1; // Page number, default to 1
       limit = limit || 50; // Documents per page, default to 10
  
      const skip = (page - 1) * limit; // Calculate how many documents to skip
  
      const totalmedication = await MedicationModel.countDocuments(); // Get the total number of documents
  
  
      const medications =  await MedicationModel.find().skip(skip).limit(limit);
      return res.status(200).json({
        medications,
        totalmedication,
        currentPage: page,
        totalPages: Math.ceil(totalmedication / limit),
      })
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
  }
  
  
  //doctor medication by Id  /////////////
  export const doctorGethMedicationByIdController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
        meidcationId
      } = req.query;
      
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const medication =  await MedicationModel.findOne({_id: meidcationId});
  
      if (!medication) {
        return res
            .status(401)
            .json({ message: "invalid medication Id" });
      }
  
      return res.status(200).json({
        medication
      })
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
  }
  
  
  //get popular medication /////////////
  export const doctorGetPopualarMedicationController = async (
    req: any,
    res: Response,
  ) => {
  
    try {
      const {
        
      } = req.query;
      
      // Check for validation errors
      const errors = validationResult(req);
  
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const popularMedication =  await MedicationModel.find().limit(8);
      return res.status(200).json({
        popularMedication
      })
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  
  }
  
