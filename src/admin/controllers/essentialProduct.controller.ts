import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";
import EssentialProductModel from "../models/essentialProduct.model";

//admin add essential product /////////////
export const adminAddEssentialProductController = async (
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
      price,
      strength,
      quantity,
      categoryId,
      form,
      ingredient,
      medInfo
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!file) {
        return res.status(401).json({ message: "provide product image." });
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      medicationImg = result?.Location!;
      console.log(result);
      //medicationImg = uploadToS3(file);
    }
    
    const essentialProduct = new EssentialProductModel({
      categoryId,
      name,
      price: price,
      strength: strength,
      quantity: quantity,
      medicationImage: medicationImg,
      ingredient,
      medInfo: medInfo,
      form: form
    })

    const savedEssentialProduct = await essentialProduct.save();
    
    return res.status(200).json({
      message: "product added successfuuy",
      product: savedEssentialProduct
    })
  
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}



//admin get page essential product /////////////
export const getPageEssentialProductController = async (
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
  
      const totalProduct = await EssentialProductModel.countDocuments(); // Get the total number of documents
  
      const products = await EssentialProductModel.find().sort({createdAt: -1})
      .skip(skip)
      .limit(limit);
  
      return res.status(200).json({
        products,
        currentPage: page,
        totalPages: Math.ceil(totalProduct / limit),
      })
  
        
    } catch (err: any) {
      // signup error
      res.status(500).json({ message: err.message });
    }
  }
  
  