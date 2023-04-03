import MedicationModel from "../models/Medications.model";
import { Request, Response, NextFunction } from "express";
import { validateMedication } from "../middleware/medication.middlware";
import { v4 as uuidv4 } from "uuid";
import { uploadToS3 } from "../utils/awsS3";
import {
  CustomFileAppendedRequest,
  IMedication,
} from "../interface/generalInterface";
import fs from "fs";
import path from "path";

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
    } = req.body;

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
    }) as IMedication;

    if (req.file) {
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      newMedication.image_url = result.Location;

      // Delete the file from the uploads folder
      fs.unlinkSync(path.join(__dirname, "..", "uploads", req.file.filename));
    }

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
    const {
      medicationId,
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
    } = req.body;

    let existingMedication = await MedicationModel.findOne({
      _id: medicationId,
    });

    // Check if medication exists
    if (!existingMedication) {
      return res.status(404).json({ message: "Medication not found." });
    }

    // Save medication to MongoDB
    existingMedication.set({
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
    });

    let medicationSaved = await existingMedication.save();

    console.log(medicationSaved);

    res.send({
      message: "Medication updated successfully",
      medication: medicationSaved,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
