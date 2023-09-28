import { validationResult } from "express-validator";
import { Request, Response } from "express";
import MedicationModel from "../models/medication.model";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";

//admin add medications /////////////
export const adminAddMedicationController = async (
    req: any,
    res: Response,
) => {

  try {
    // Access the uploaded file details
    const file = req.file;
    // const fileName = file?.filename;
    // const filePath = file?.path;
    let medicationImg;

    const {
      name,
      description,
      price,
      strength,
      quantity,
      prescriptionRequired,
      form,
      ingredient
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!file) {
      medicationImg = '';
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      medicationImg = result?.Location!;
      console.log(result);
      //medicationImg = uploadToS3(file);
    }

    console.log(medicationImg);
    
    const medication = new MedicationModel({
      name,
      description,
      price: price,
      strength: strength,
      quantity: quantity,
      medicationImage: medicationImg,
      prescriptionRequired,
      ingredient,
      form: form
    })

    const savedMedication = await medication.save();

    // const domainName = req.hostname;
    // medicationImg = `${domainName}/public/uploads/${fileName}`;

    return res.status(200).json({
      message: "medication added successfuuy",
      medication:{
        id: savedMedication._id,
        name: savedMedication.name,
        description: savedMedication.description,
        price: savedMedication.price,
        strength: savedMedication.strength,
        quantity: savedMedication.quantity,
        medicationImage: medicationImg,
        prescriptionRequired: savedMedication.prescriptionRequired,
        forms: savedMedication.form,
        ingredient: savedMedication.ingredient
      }
    })
  
      
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}



//admin edit medications /////////////
export const adminEditMedicationController = async (
    req: any,
    res: Response,
) => {

  try {
    // let medicationImg;

    const {
      medicationId,
      name,
      description,
      price,
      strength,
      quantity,
      prescriptionRequired,
      form,
      ingredient
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    
   const updatedMedication = await MedicationModel.findOneAndUpdate(
    {_id: medicationId}, 
    {
      name,
      description,
      price: price,
      strength: strength,
      quantity: quantity,
      prescriptionRequired,
      form: form,
      ingredient
    },
    {new: true}
   );

   if (!updatedMedication) {
    return res.status(401)
    .json({ message: "medication not available" });
   }

    
    // const domainName = req.hostname;
    // medicationImg = `${domainName}/public/uploads/${updatedMedication.medicationImage}`;

    return res.status(200).json({
      message: "medication updated successfuuy",
      medication:{
        id: updatedMedication._id,
        name: updatedMedication.name,
        description: updatedMedication.description,
        prices: updatedMedication.price,
        strengths: updatedMedication.strength,
        quantities: updatedMedication.quantity,
        medicationImage: updatedMedication.medicationImage,
        prescriptionRequired: updatedMedication.prescriptionRequired,
        forms: updatedMedication.form,
        ingredient: updatedMedication.ingredient
      }
    })
  
      
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//admin delete medications /////////////
export const adminDeleteMedicationController = async (
    req: any,
    res: Response,
) => {

  try {
    // let medicationImg;

    const {
        medicationId,
        
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

   const deletedMedication = await MedicationModel.findOneAndDelete(
    {_id: medicationId}, 
    {new: true}
   );

   if (!deletedMedication) {
    return res.status(401)
    .json({ message: "medication not available" });
   }

    
    // const domainName = req.hostname;
    // medicationImg = `${domainName}/public/uploads/${deletedMedication.medicationImage}`;

    return res.status(200).json({
      message: "medication deleted successfuuy",
      deletedMedication:{
        id: deletedMedication._id,
        name: deletedMedication.name,
        description: deletedMedication.description,
        price: deletedMedication.price,
        strength: deletedMedication.strength,
        quantity: deletedMedication.quantity,
        medicationImage: deletedMedication.medicationImage,
        prescriptionRequired: deletedMedication.prescriptionRequired,
        forms: deletedMedication.form,
        ingridient: deletedMedication.ingredient
      }
    })
  
      
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}

//get all medications /////////////
export const getAllMedicationController = async (
    req: any,
    res: Response,
) => {
  try {
   const Medications = await MedicationModel.find();

    return res.status(200).json({
        message: "success",
        Medications
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//get all medications /////////////
export const getsingleMedicationController = async (
    req: any,
    res: Response,
) => {
  try {
    const {
        medicationId, 
    } = req.body;

    const Medication = await MedicationModel.findOne({_id: medicationId});
    return res.status(200).json({
        message: "success",
        Medication
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//get specific number of medication medications /////////////
export const getSpecificNumbereMedicationController = async (
  req: any,
  res: Response,
) => {
  try {
    const {
      howMany
    } = req.body;

    const limit = howMany || 10; // You can set a default limit or accept it as a query parameter
    const Medications = await MedicationModel.find().limit(Number(limit));

    return res.status(200).json({
        message: "success",
        Medications 
    })

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//get spage of medication medications /////////////
export const getPageMedicationController = async (
  req: any,
  res: Response,
) => {
  try {
    const {
      howMany
    } = req.body;

    const page = parseInt(req.body.page) || 1; // Page number, default to 1
    const limit = parseInt(req.body.limit) || 10; // Documents per page, default to 10

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    const totalMedications = await MedicationModel.countDocuments(); // Get the total number of documents

    const medications = await MedicationModel.find()
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
        message: "success",
        medications,
        currentPage: page,
        totalPages: Math.ceil(totalMedications / limit),
    })

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}



//get total medication medications /////////////
export const getTotalMedicationController = async (
  req: any,
  res: Response,
) => {
  try {
    const {
      howMany
    } = req.body;

    const totalMedications = await MedicationModel.countDocuments(); // Get the total number of documents

    return res.status(200).json({
        message: "success",
        totalMedications
    })

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}