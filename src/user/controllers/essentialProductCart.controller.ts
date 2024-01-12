import { validationResult } from "express-validator";
import { Request, Response } from "express";
import EssentialProductModel from "../../admin/models/essentialProduct.model";
import EssentialCategoryModel from "../../admin/models/essentialCategori.model";
import UserModel from "../models/userReg.model";
import EssentialCart from "../models/ensentialCart.model";
import CartModel from "../models/cart.model";


// add esential product to cart /////////////
export const addEssentialProductToCartController = async (
    req: any,
    res: Response,
  ) => {
    
    try {

        const {
            productId
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

        const checkCart = await CartModel.findOne({userId, productId});

        if (checkCart) {
            checkCart.quantityrquired = checkCart.quantityrquired + 1;
            await checkCart.save()

            return res.status(200).json({
                message: "product added to cart succefully",
            })

        }else{

            const newCart = new CartModel({
                userId,
                productId,
                quantityrquired: 1,
                type: "ess"  
            });

            await newCart.save();
            return res.status(200).json({
                message: "product added to cart succefully",
            })
        }


        
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}



// increase esential product to cart /////////////
export const increaseEssentialProductToCartController = async (
    req: any,
    res: Response,
  ) => {
    
    try {

        const {
            enssentialCartId
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

        const checkCart = await EssentialCart.findOne({_id: enssentialCartId, userId});

        if (!checkCart) {
            
            return res
            .status(401)
            .json({ message: "invalid cart ID" });
        }
        
        checkCart.quantityrquired = checkCart.quantityrquired + 1;

        await checkCart.save()

        return res.status(200).json({
            message: "product increase in cart succefully",
        })
        
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}



// decrease esential product to cart /////////////
export const decreaseEssentialProductToCartController = async (
    req: any,
    res: Response,
  ) => {
    
    try {

        const {
            enssentialCartId
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

        const checkCart = await EssentialCart.findOne({_id: enssentialCartId, userId});

        if (!checkCart) {
            
            return res
            .status(401)
            .json({ message: "invalid cart ID" });
        }
        
        checkCart.quantityrquired = checkCart.quantityrquired - 1;

        const decreaseCart = await checkCart.save();

         if (decreaseCart.quantityrquired == 0) {
            await EssentialCart.findOneAndDelete({_id: enssentialCartId, userId}, {new: true})
         }

        return res.status(200).json({
            message: "product decrease in cart succefully",
        })
        
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}


// get esential product in cart /////////////
export const getEssentialProductInCartController = async (
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

        // const carts = await EssentialCart.find({userId})
        // .populate('productId', 'firstName surname email phoneNumber gender dateOFBirth address');

        const carts = await EssentialCart.aggregate([
            {
              $lookup: {
                from: 'EssentialProduct', // Name of the other collection
                //localField: 'referenceId',
                localField: 'referenceId',
                foreignField: '_id',
                as: 'product',
              },
            },
        ]);

        return res.status(200).json({
            carts
        })

        
    } catch (err: any) {
        // signup error
        res.status(500).json({ message: err.message });
    }
}