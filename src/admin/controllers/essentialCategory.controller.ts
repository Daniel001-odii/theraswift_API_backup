import { validationResult } from "express-validator";
import { Request, Response } from "express";
import EssentialCategoryModel from "../models/essentialCategori.model";
import EssentialProductModel from "../models/essentialProduct.model";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";


//admin create essential category /////////////
export const createEssentialCategoryController = async (
    req: any,
    res: Response,
) => {

  try {

    const {
      name,
    } = req.body;

    // Access the uploaded file details
    const file = req.file;
  
    let medicationImg;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!file) {
      return res.status(401).json({ message: "provide category image." });
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      medicationImg = result?.Location!;
      
    }

    const essentialCategory = new EssentialCategoryModel({
        name: name.trim(),
        img: medicationImg
    })

    const savedEssentialCategory = await essentialCategory.save()

    
    return res.status(200).json({
      message: "category created successfully ",
      category: savedEssentialCategory
    })
  
      
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//admin get all essential category /////////////
export const getAllEssentialCategoryController = async (
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

    const categories = await EssentialCategoryModel.find().sort({name: 1})

    return res.status(200).json({
      categories
    })

      
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//admin get page essential category /////////////
export const getPageEssentialCategoryController = async (
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

    const page = parseInt(req.body.page) || 1; // Page number, default to 1
    const limit = parseInt(req.body.limit) || 50; // Documents per page, default to 10

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    const totalCategories = await EssentialCategoryModel.countDocuments(); // Get the total number of documents

    const categories = await EssentialCategoryModel.find().sort({name: 1})
    .skip(skip)
    .limit(limit);

    return res.status(200).json({
      categories,
      currentPage: page,
      totalPages: Math.ceil(totalCategories / limit),
    })

      
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//admin delete essential category /////////////
export const deleteEssentialCategoryController = async (
  req: any,
  res: Response,
) => {

try {

  const {
    categoryId,
  } = req.body;
  
  // Check for validation errors
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const checkCategory = await EssentialCategoryModel.findOne({_id: categoryId})
  if (!checkCategory) {
    return res.status(401).json({ message: "invalid category ID." });
  }

  const checkProducts = await EssentialProductModel.find({categoryId: checkCategory._id})
  if (checkProducts.length > 0) {
    return res.status(401).json({ message: "delete all product under this category first." });
  }

  const deleteProduct = await EssentialCategoryModel.findOneAndDelete({_id: categoryId}, {new: true})

  return res.status(200).json({
    message: "category deleted successfully ",
  })

    
} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}
}

