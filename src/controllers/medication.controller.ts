import MedicationModel from "../models/Medications.model";
import { Request, Response, NextFunction } from "express";
import { validateMedication } from "../middleware/medication.middlware";
import { v4 as uuidv4 } from "uuid";
import { uploadToS3 } from "../utils/awsS3";
import { IMedication } from "../interface/generalInterface";
import { CustomFileAppendedRequest } from "../types/generalTypes";

export const addMedicationFrontendController = async (
  req: CustomFileAppendedRequest,
  res: Response
): Promise<void> => {
  res.render("uploadMedication",{ error: null });
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
      dosage,
      warnings,
      manufacturer,
      price,
      available,
      expiryDate,
      sideEffects,
      ingredients,
      storageInstructions,
      contraindications,
      routeOfAdministration,
      prescription_required,
      category,
    } = req.body;

    let image_url = "";

    if (req.file) {
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      image_url = result.Location;
      console.log(result);
    }

    // Save medication to MongoDB
    const newMedication = new MedicationModel({
      name,
      description,
      dosage,
      warnings,
      manufacturer,
      price,
      available,
      expiryDate,
      sideEffects,
      ingredients,
      storageInstructions,
      contraindications,
      routeOfAdministration,
      prescription_required,
      image_url,
      category,
    }) as IMedication;

    let medicationSaved = await newMedication.save();
    console.log(medicationSaved);
    res.send({
      message: "Medication saved successfully",
      medication: medicationSaved,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// edit medication controller

export const editMedicationController = async (req: Request, res: Response) => {
  try {
    let { id } = req.params;
    const updateFields = req.body;

    if (updateFields.id) {
      id = updateFields.id;
      delete updateFields.id;
    }

    let existingMedication = await MedicationModel.findOne({
      _id: id,
    });

    // Check if medication exists
    if (!existingMedication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    const updatedMedication = await MedicationModel.findByIdAndUpdate(
      id,
      updateFields,
      { new: true }
    );

    console.log(updatedMedication);

    res.send({
      message: "Medication updated successfully",
      medication: updatedMedication,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
