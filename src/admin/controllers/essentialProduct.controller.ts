import { validationResult } from "express-validator";
import { Request, Response } from "express";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";
import EssentialProductModel from "../models/essentialProduct.model";
import EssentialCategoryModel from "../models/essentialCategori.model";

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
      uses,
      quantity,
      categoryId,
      inventoryQauntity,
      ingredient,
      expiryDate,
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

    const categoryDb = await EssentialCategoryModel.findOne({_id: categoryId})
    
    const essentialProduct = new EssentialProductModel({
      categoryId,
      name,
      price: price,
      uses,
      quantity: quantity,
      medicationImage: medicationImg,
      ingredient,
      inventoryQauntity,
      expiryDate,
      category: categoryDb?.name
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



//admin search product by name /////////////
export const searchEssentialProductByNameController = async (
    req: any,
    res: Response,
  ) => {
  
  try {

    const {
      productName
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const products = await EssentialProductModel.find({ name: { $regex: new RegExp(productName, 'i') } });

    return res.status(200).json({
      products,
      
    })
  
        
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}
  
  

//admin edit product by Id /////////////
export const editEssentialProductController = async (
  req: any,
  res: Response,
) => {

  try {

    const file = req.file;
    // const fileName = file?.filename;
    // const filePath = file?.path;
    let medicationImg;

    const {
      productId,
      name,
      price,
      uses,
      quantity,
      categoryId,
      inventoryQauntity,
      ingredient,
      expiryDate,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await EssentialProductModel.findOne({_id: productId})

    if (!product) {
      return res.status(401).json({ message: "product do not exist" });
    }

    if (!file) {
      medicationImg = product.medicationImage
    }else{
      const filename = uuidv4();
      const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
      medicationImg = result?.Location!;
    }

    const categoryDb = await EssentialCategoryModel.findOne({_id: categoryId})

    const updatedProduct = await EssentialProductModel.findOneAndUpdate({_id: productId}, {
      categoryId,
      name,
      price: price,
      uses,
      quantity: quantity,
      medicationImage: medicationImg,
      ingredient,
      inventoryQauntity,
      expiryDate,
      category: categoryDb?.name  
    }, {new: true})


    return res.status(200).json({
      message: "product updated successfuuy",
      
    })

        
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}



//admin delete product by Id /////////////
export const deleteEssentialProductController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
      productId,
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const product = await EssentialProductModel.findOne({_id: productId})

    if (!product) {
      return res.status(401).json({ message: "product do not exist" });
    }

    const deleteProduct = await EssentialProductModel.findOneAndDelete({_id: productId}, {new: true})

    return res.status(200).json({
      message: "product deleted successfuuy",
      
    })
        
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}



  


