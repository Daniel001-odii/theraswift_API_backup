import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import UserMedicationModel from "../models/medication.model";
import MedicationModel from "../../admin/models/medication.model";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";

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
    existUserMedication.quantityOrder = existUserMedication.quantityOrder + 1;
    const increaseMed = await existUserMedication.save();
    return res.status(200).json({
      message: "medication added succefully",
      medication:{
        firstName: userExist.firstName,
        medicationId: medication._id,
        userMedicationID: increaseMed._id,
        name: medication.name,
        description: medication.description,
        price: medication.price,
        form: medication.form,
        dosage: medication.strength,
        quantity: medication.quantity,
        medicationImage: medication.medicationImage,
        prescriptionRequired: medication.prescriptionRequired,
        medicationQuantityRequested: increaseMed.quantityOrder,
        totalCost: increaseMed.quantityOrder * parseInt(medication.price)
      }
    })
  }
    
    //if medication those not exist
    const userMedication = new UserMedicationModel({
      userId: userId,
      medicationId: medicationId,
      quantityOrder: 1,
    
    })

    const saveUserMedication = await userMedication.save();

    await userExist.save();

    return res.status(200).json({
      message: "medication added succefully",
      medication:{
        firstName: userExist.firstName,
        medicationId: medication._id,
        userMedicationID: saveUserMedication._id,
        name: medication.name,
        description: medication.description,
        price: medication.price,
        form: medication.form,
        dosage: medication.strength,
        quantity: medication.quantity,
        medicationImage: medication.medicationImage,
        prescriptionRequired: medication.prescriptionRequired,
        medicationQuantityRequested: saveUserMedication.quantityOrder,
        totalCost: saveUserMedication.quantityOrder * parseInt(medication.price)
      }
    })
  

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}





//user increase  medication /////////////
export const userIncreaseMedicationController = async (
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
    const userMedication = await UserMedicationModel.findOne({_id:  userMedicationId});

    if (!userMedication) {
      return res
        .status(401)
        .json({ message: "add medication first before increase the quantity"});
    }

    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    userMedication.quantityOrder = userMedication.quantityOrder + 1;
    const increaseMed = await userMedication.save();

    const medication = await MedicationModel.findOne({_id: userMedication.medicationId});
    
    let price: string | any = medication?.price;

    return res.status(200).json({
      message: "medication quantity increase",
      medication:{
        firstName: userExist.firstName,
        id: medication?._id,
        name: medication?.name,
        description: medication?.description,
        price: medication?.price,
        form: medication?.form,
        strength: medication?.strength,
        quantity: medication?.quantity,
        medicationImage: medication?.medicationImage,
        prescriptionRequired: medication?.prescriptionRequired,
        medicationQuantityRequested: increaseMed.quantityOrder,
        totalCost: increaseMed.quantityOrder * parseInt(price)
      }
    })
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}




//user decrease  medication /////////////
export const userDecreaseMedicationController = async (
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
    const userMedication = await UserMedicationModel.findOne({_id:  userMedicationId});

    if (!userMedication) {
      return res
        .status(401)
        .json({ message: "add medication first before decrease the quantity"});
    }

    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    userMedication.quantityOrder = userMedication.quantityOrder - 1;
    const decreaseMed = await userMedication.save();

    if (decreaseMed.quantityOrder == 0) {
        await UserMedicationModel.findOneAndDelete({_id: userMedicationId}, {new: true});
    }

    const medication = await MedicationModel.findOne({_id: userMedication.medicationId});
    
    let price: string | any = medication?.price;

    return res.status(200).json({
      message: "medication quantity decrease",
      medication:{
        firstName: userExist.firstName,
        id: medication?._id,
        name: medication?.name,
        description: medication?.description,
        price: medication?.price,
        form: medication?.form,
        strength: medication?.strength,
        quantity: medication?.quantity,
        medicationImage: medication?.medicationImage,
        prescriptionRequired: medication?.prescriptionRequired,
        medicationQuantityRequested: decreaseMed.quantityOrder,
        totalCost: decreaseMed.quantityOrder * parseInt(price)
      }
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
      removedMedication:{
        firstName: userExist.firstName,
        id: medication?._id,
        name: medication?.name,
        description: medication?.description,
        form: medication?.form,
        price: medication?.price,
        strength: medication?.strength,
        quantity: medication?.quantity,
        medicationImage: medication?.medicationImage,
        prescriptionRequired: medication?.prescriptionRequired,
    
      }
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
    } = req.body;
    
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
    } = req.body;
    
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const medications =  await MedicationModel.find({name});
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
    } = req.body;
    
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
    } = req.body;
    
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const medications =  await MedicationModel.find({name, form, strength: dosage});
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
      const price: any = medication?.price;
      
      const medObj = {
        medicationId: medication?._id,
        userMedicationId: userMedication._id,
        name: medication?.name,
        ingridient: medication?.ingredient,
        form: medication?.form,
        dosage: medication?.strength,
        quantity: medication?.quantity,
        price: medication?.price,
        prescriptionRequired: medication?.prescriptionRequired,
        medicationImage: medication?.medicationImage,
        quantityOrder: userMedication.quantityOrder,
        totalCost: userMedication.quantityOrder * parseInt(price)
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