import MedicationModel from "../models/Medications.model";
import { Request, Response, NextFunction } from "express";
import { validateMedication } from "../middleware/medication.middlware";
import { v4 as uuidv4 } from "uuid";
import { uploadToS3 } from "../utils/awsS3";
import { IMedication } from "../interface/generalInterface";
import { CustomFileAppendedRequest } from "../types/generalTypes";


// DELETE endpoint for deleting a medication
export const deleteMedication = async (
  req: CustomFileAppendedRequest,
  res: Response
) => {
  try {
    let { medication_id } = req.body;

    const medication = await MedicationModel.findByIdAndDelete(medication_id);
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    res.json({ message: "Medication deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const addMedicationController = async (
  req: CustomFileAppendedRequest,
  res: Response
): Promise<void> => {
  try {
    // Validate the request body using express-validator
    await Promise.all(
      validateMedication.map((validation) => validation.run(req))
    );

    const {
      name,
      description,
      strength,
      warnings,
      manufacturer,
      price,
      available,
      sideEffects,
      ingredients,
      storageInstructions,
      contraindications,
      routeOfAdministration,
      prescription_required_type,
      essential_category,
      medicationTypes,
      medicationForms,
      uses,
      quantity:medicationQuantities,
    } = req.body;

    let image_url = "";

    if (req.file) {
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      image_url = result?.Location!;
      console.log(result);
    }

    const sideEffectsArray: string[] = Array.isArray(sideEffects)
      ? sideEffects
      : sideEffects
      ? sideEffects.includes(",")
        ? sideEffects.split(",").map((effect: any) => effect.trim())
        : [sideEffects]
      : [];

    const ingredientsArray: string[] = Array.isArray(ingredients)
      ? ingredients
      : ingredients
      ? ingredients.includes(",")
        ? ingredients.split(",").map((ingredient: any) => ingredient.trim())
        : [ingredients]
      : [];

    const medicationTypesArray: string[] = Array.isArray(medicationTypes)
      ? medicationTypes
      : medicationTypes
      ? medicationTypes.includes(",")
        ? medicationTypes
            .split(",")
            .map((medicationType: any) => medicationType.trim())
        : [medicationTypes]
      : [];

    const medicationFormsArray: string[] = Array.isArray(medicationForms)
      ? medicationForms
      : medicationForms
      ? medicationForms.includes(",")
        ? medicationForms
            .split(",")
            .map((medicationForm: any) => medicationForm.trim())
        : [medicationForms]
      : [];


      const medicationQuantitiesArray: string[] = Array.isArray(medicationQuantities)
      ? medicationQuantities
      : medicationQuantities
      ? medicationQuantities.includes(",")
        ? medicationQuantities
            .split(",")
            .map((medicationQuantity: any) => medicationQuantity.trim())
        : [medicationQuantities]
      : [];

    // Save medication to MongoDB
    const newMedication = new MedicationModel({
      name,
      description,
      strength,
      warnings,
      manufacturer,
      price,
      quantity:medicationQuantitiesArray,
      available,
      sideEffects: sideEffectsArray,
      ingredients: ingredientsArray,
      storageInstructions,
      contraindications,
      routeOfAdministration,
      prescription_required_type,
      image_url,
      essential_category,
      medicationTypes: medicationTypesArray,
      medicationForms: medicationFormsArray,
      uses,
    }) as IMedication;

    let medicationSaved = await newMedication.save();
    console.log(medicationSaved);
    res.send({
      message: "Medication saved successfully",
      medication: medicationSaved,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

// edit medication controller

export const editMedicationController = async (req: Request, res: Response) => {
  try {
   // let { id } = req.params;
    const {updatedFields, medication_id} = req.body;

    if (updatedFields.id) {
      delete updatedFields.id;
    }

    let existingMedication = await MedicationModel.findOne({
      _id: medication_id,
    });

    // Check if medication exists
    if (!existingMedication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    const updatedMedication = await MedicationModel.findByIdAndUpdate(
      medication_id,
      updatedFields,
      { new: true }
    );

    res.send({
      message: "Medication updated successfully",
      medication: updatedMedication,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

export const getAllMedicationsController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const medications = await MedicationModel.find();
    res.send({
      message: "Successfully retrieved all medications",
      medications: medications,
    });
  } catch (err: any) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};
