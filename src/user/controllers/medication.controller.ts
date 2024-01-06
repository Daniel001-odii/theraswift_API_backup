import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import UserMedicationModel from "../models/medication.model";
import MedicationModel from "../../admin/models/medication.model";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";
import PatientMedicationByImage from "../models/medicationByImage.model";

//user add medication /////////////
export const userAddMedicationController = async (
    req: any,
    res: Response,
) => {

  try {
    const {
      medicationId,
    } = req.body;

    const file = req.file;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id

    console.log(userId)

    // check if the medication is in database
    const medication = await MedicationModel.findOne({_id: medicationId});

    if (!medication) {
      return res
        .status(401)
        .json({ message: "invalid medication" });
    }

    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const existUserMedication = await UserMedicationModel.findOne({userId, medicationId});

    if (existUserMedication) {
      return res
          .status(401)
          .json({ message: "medication already added" });
    }
    
    let prescriptionStatus = false;
    if (medication.prescriptionRequired) {
      prescriptionStatus = false;
    }else{
      prescriptionStatus = true;
    }

    //if medication those not exist
    const userMedication = new UserMedicationModel({
      userId: userId,
      medicationId: medicationId,
      prescriptionStatus: prescriptionStatus
    })

    const saveUserMedication = await userMedication.save();


    return res.status(200).json({
      message: "medication added succefully",
      medication: medication
    })
  

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user remove  medication /////////////
export const userRemoveMedicationController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
      userMedicationId
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id

    console.log(userId)

    // check if the medication is in database
    const deletedmedication  = await UserMedicationModel.findOneAndDelete({_id: userMedicationId}, {new: true});


    if (!deletedmedication ) {
      return res
        .status(401)
        .json({ message: "invalid medication" });
    }

    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const medication = await MedicationModel.findOne({_id: deletedmedication.medicationId});
    

    return res.status(200).json({
      message: "medication removed successfiily",
      removedMedication: deletedmedication
    })
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user searching for  medication /////////////
export const userSearchMedicationController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
      medicationName
    } = req.query;
    
    // const medication = await MedicationModel.find({
    //   name: { $regex: medicationName, $options: 'i' }, // Case-insensitive search
    // });

    // return res.status(200).json({
    //   medication 
    // })
    const columnName = 'name';
    // const { columnName } = req.params;
    // const { query } = req.query;
  
    const searchQuery = {
      $or: [
        { name: { $regex: medicationName, $options: 'i' } }, // Perform a case-insensitive search
        // Add more fields as needed for your search
      ],
    };
    console.log(medicationName)

    console.log("era", searchQuery)

    const aggregationPipeline = [
      { $match: searchQuery }, // Match documents based on the search query
      {
        $group: {
          _id: `$${columnName}`, // Group by the specified column
          count: { $sum: 1 }, // Optionally, you can count the documents in each group
        },
      },
      // You can add more stages to the aggregation pipeline if needed
    ];

    const result = await MedicationModel.aggregate(aggregationPipeline);

    let output = [];

    for (let i = 0; i < result.length; i++) {
      const element = result[i];

      const bd = await MedicationModel.findOne({name: element._id});

      const obj = {
        name: element._id,
        ingridient: bd?.ingredient,
      };

      output.push(obj)
      
    }

    return res.status(200).json({
      medications: output
    })
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}




//user searching for  medication by name /////////////
export const userSearchMedicationNameController = async (
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




//user searching for  medication by name and form /////////////
export const userSearchMedicationNameFormController = async (
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



//user searching for  medication by name, form and dosage /////////////
export const userSearchMedicationNameFormDosageController = async (
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



//get all medication for specific user /////////////
export const userGetMedicationController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
      
    } = req.body;
    
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id

    const userMedications = await UserMedicationModel.find({userId});

    let medications = [];

    for (let i = 0; i < userMedications.length; i++) {
      const userMedication = userMedications[i];

      const medication =  await MedicationModel.findOne({_id: userMedication.medicationId});
      
      const medObj = {
        medicationId: medication?._id,
        userMedicationId: userMedication._id,
        medication
        
      }

      medications.push(medObj);
      
    }

    return res.status(200).json({
      medications
    })
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user add prescription image/////////////
export const userAddPrescriptionImageController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
      userMedicationId,
    } = req.body;

    const file = req.file;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const existUserMedication = await UserMedicationModel.findOne({_id: userMedicationId ,userId});

    if (!existUserMedication) {
      return res
          .status(401)
          .json({ message: "invalid medication ID" });
    }
    
    let prescriptionImg;

    if (!file) {
      return res
          .status(401)
          .json({ message: "provide image" });
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      prescriptionImg = result?.Location!;
      console.log(result);
      //medicationImg = uploadToS3(file);
    }

    existUserMedication.prescriptionImage = prescriptionImg;
    existUserMedication.prescriptionStatus = true;
    const updatedMedication = await existUserMedication.save();
    return res.status(200).json({
      message: "prescription added succefully",
      medication: updatedMedication
    })


  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}




//check user prescriptions status/////////////
export const userPrescriptionStatusController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
     
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const userMedications = await UserMedicationModel.find({userId});

    if (userMedications.length < 1) {
      return res
        .status(401)
        .json({ message: "no medication for this user" });
    }

    let prescriptionId = [];

    for (let i = 0; i < userMedications.length; i++) {
      const userMedication = userMedications[i];

      const medication = await MedicationModel.findOne({_id: userMedication.medicationId});

      if (medication?.prescriptionRequired == "required" && userMedication.prescriptionStatus == false) {

          prescriptionId.push(userMedication._id);
      }
      
    }

    if (prescriptionId.length > 0) {
      return res
      .status(401)
      .json({ 
        checkoutStatus: false,
        message: "some meidcation need prescription" 
      });
    }
    
    return res.status(200).json({
      checkoutStatus: true,
      message: "no issue with prescription",
    })


  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}




//get user medication that required prescription/////////////
export const userMedicatonRequiredPrescriptionController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
     
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const userMedications = await UserMedicationModel.find({userId});

    if (userMedications.length < 1) {
      return res
        .status(401)
        .json({ message: "no medication for this user" });
    }

    let prescriptionId = [];

    for (let i = 0; i < userMedications.length; i++) {
      const userMedication = userMedications[i];

      const medication = await MedicationModel.findOne({_id: userMedication.medicationId});

      if (medication?.prescriptionRequired == "required" && userMedication.prescriptionStatus == false) {

        const presObj = {
          medicationId: medication._id,
          userMedicationId: userMedication._id,
          medication
        }
          prescriptionId.push(presObj);
      }
      
    }

    if (prescriptionId.length < 1) {
      return res
      .status(401)
      .json({ 
        message: "no meidcation need prescription" 
      });
    }
    
    return res.status(200).json({
      medications: prescriptionId
    })


  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user add medication through image/////////////
export const userAddMedicationThroughImageController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
    } = req.body;

    const file = req.file;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = req.user;
    const userId = user.id


    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

   
    
    let prescriptionImg;

    if (!file) {
      return res
          .status(401)
          .json({ message: "provide image" });
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      prescriptionImg = result?.Location!;
      
    }

    const patientMedImg = new PatientMedicationByImage({
      userId: userId,
      patientMedicationImage: prescriptionImg
    });

    const savePatientMedImg = await patientMedImg.save()

  
    return res.status(200).json({
      message: "prescription added succefully",
      medication: savePatientMedImg
    })


  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user get medication   /////////////
export const userGethMedicationController = async (
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

    const page = parseInt(req.body.page) || 1; // Page number, default to 1
    const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10

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


//user medication by Id  /////////////
export const userGethMedicationByIdController = async (
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


//bet popular medication /////////////
export const userGetPopualarMedicationController = async (
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


