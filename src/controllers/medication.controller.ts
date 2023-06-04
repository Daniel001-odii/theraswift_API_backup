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
  res.render("uploadMedication", { error: null });
};

export const adEssentialsMedicationFrontendController = async (
  req: CustomFileAppendedRequest,
  res: Response
): Promise<void> => {
  res.render("essentialsUploadMedication", { error: null });
};

export const getAllMedicationFrontendController = async (
  req: CustomFileAppendedRequest,
  res: Response
): Promise<void> => {
  try {
    const medications = await MedicationModel.find();
    res.render("viewMedications", { error: null, medications });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// DELETE endpoint for deleting a medication
export const deleteMedication = async (
  req: CustomFileAppendedRequest,
  res: Response
) => {
  try {
    const medication = await MedicationModel.findByIdAndDelete(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    res.json({ message: "Medication deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE endpoint for deleting a medication through an external API
export const deleteMedicationFrontend = async (
  req: CustomFileAppendedRequest,
  res: Response
) => {
  // try {
  //   const medication = await MedicationModel.findByIdAndDelete(req.params.id);
  //   if (!medication) {
  //     return res.status(404).json({ error: "Medication not found" });
  //   }

  //   // Add your code to interact with the external API and delete the medication

  //   res.json({ message: "Medication deleted successfully from external API" });
  // } catch (error) {
  //   res.status(500).json({ error: "Internal server error" });
  // }
  try {
    const medication = await MedicationModel.findByIdAndDelete(req.params.id);
    if (!medication) {
      return res.status(404).json({ error: "Medication not found" });
    }
    res.redirect("/get_medications?success=Deleted+Successfully");
  } catch (error: any) {
    res.redirect("/get_medications?error=" + encodeURIComponent(error.message));
  }
};

// export const addMedicationController = async (
//   req: CustomFileAppendedRequest,
//   res: Response
// ): Promise<void> => {
//   try {
//     // Validate the request body using express-validator
//     await Promise.all(
//       validateMedication.map((validation) => validation.run(req))
//     );

//     const {
//       name,
//       description,
//       strength,
//       warnings,
//       manufacturer,
//       price,
//       available,
//       expiryDate,
//       sideEffects,
//       ingredients,
//       storageInstructions,
//       contraindications,
//       routeOfAdministration,
//       prescription_required,
//       category,
//     } = req.body;

//     let image_url = "";

//     if (req.file) {
//       const filename = uuidv4();
//       const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
//       image_url = result.Location;
//       console.log(result);
//     }

//     // Save medication to MongoDB
//     const newMedication = new MedicationModel({
//       name,
//       description,
//       strength,
//       warnings,
//       manufacturer,
//       price,
//       available,
//       expiryDate,
//       sideEffects,
//       ingredients,
//       storageInstructions,
//       contraindications,
//       routeOfAdministration,
//       prescription_required,
//       image_url,
//       category,
//     }) as IMedication;

//     let medicationSaved = await newMedication.save();
//     console.log(medicationSaved);
//     res.send({
//       message: "Medication saved successfully",
//       medication: medicationSaved,
//     });
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

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
      expiryDate,
      sideEffects,
      ingredients,
      storageInstructions,
      contraindications,
      routeOfAdministration,
      prescription_required,
      category,
      medicationTypes,
      medicationForms,
    } = req.body;

    let image_url = "";

    if (req.file) {
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      image_url = result.Location;
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

    // Save medication to MongoDB
    const newMedication = new MedicationModel({
      name,
      description,
      strength,
      warnings,
      manufacturer,
      price,
      available,
      expiryDate,
      sideEffects: sideEffectsArray,
      ingredients: ingredientsArray,
      storageInstructions,
      contraindications,
      routeOfAdministration,
      prescription_required,
      image_url,
      category,
      medicationTypes: medicationTypesArray,
      medicationForms: medicationFormsArray,
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
    const updatedFields = req.body;

    if (updatedFields.id) {
      id = updatedFields.id;
      delete updatedFields.id;
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
      updatedFields,
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
  } catch (err) {
    console.log(err);
    throw err;
  }
};
