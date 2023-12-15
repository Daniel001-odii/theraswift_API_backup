import { validationResult } from "express-validator";
import { Request, Response } from "express";
import EssentialProductModel from "../../admin/models/essentialProduct.model";
import EssentialCategoryModel from "../../admin/models/essentialCategori.model";


// get page essential category /////////////
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

        const categories = await EssentialCategoryModel.find().sort({createdAt: -1})
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



// get page essential products /////////////
export const getEssentialProductBycategoryController = async (
    req: any,
    res: Response,
  ) => {
    
    try {

        let {
        categoryId,
        page,
        limit
        } = req.body;

        // Check for validation errors
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
        }

        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10

        const skip = (page - 1) * limit; // Calculate how many documents to skip

        const totalProduct = await EssentialProductModel.countDocuments({categoryId}); // Get the total number of documents

        const products = await EssentialProductModel.find({categoryId}).sort({createdAt: -1})
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