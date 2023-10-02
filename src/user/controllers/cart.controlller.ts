import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import UserMedicationModel from "../models/medication.model";
import MedicationModel from "../../admin/models/medication.model"
import CartModel from "../models/cart.model";

//user add medication  to cart/////////////
export const userAddMedicationToCartController = async (
    req: any,
    res: Response,
) => {

  try {
    const {
        userMedicationId,
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

    //get user medication
    const userMedication = await UserMedicationModel.findOne({_id: userMedicationId});

    if (!userMedication) {
        return res
        .status(401)
        .json({ message: "invalid user medication" });
    }

    const cartExist = await CartModel.findOne({userId: userId, userMedicationId: userMedicationId});

    if (cartExist) {
        return res
        .status(401)
        .json({ message: "medication already in cart list" });
    }

    const cart = new CartModel({
        userId,
        medicationId: userMedication.medicationId,
        userMedicationId: userMedicationId,
        quantityrquired: 1
    })

    await cart.save();

    return res.status(200).json({
        message: "medication added to cart succefully",
    })
  

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user increase medication  to cart/////////////
export const userIncreaseMedicationToCartController = async (
    req: any,
    res: Response,
) => {

  try {
    const {
        cartId,
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

    
    const cartExist = await CartModel.findOne({_id: cartId,userId: userId});

    if (!cartExist) {
        return res
        .status(401)
        .json({ message: "medication not in cart list" });
    }

    cartExist.quantityrquired = cartExist.quantityrquired + 1;

    await cartExist.save();

    return res.status(200).json({
        message: "medication increased in cart list succefully",
    })
  

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user decrease medication  to cart/////////////
export const userDecreaseMedicationToCartController = async (
    req: any,
    res: Response,
) => {

  try {
    const {
        cartId,
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

    
    const cartExist = await CartModel.findOne({_id: cartId,userId: userId});

    if (!cartExist) {
        return res
        .status(401)
        .json({ message: "medication not in cart list" });
    }

    cartExist.quantityrquired = cartExist.quantityrquired - 1;

    await cartExist.save();

    const checkCartZero = await CartModel.findOne({_id: cartId,userId: userId});

    if (checkCartZero?.quantityrquired == 0) {
      await CartModel.findOneAndDelete({_id: cartId, userId: userId}, {new: true})
    }

    return res.status(200).json({
        message: "medication decreased in cart list succefully",
    })
  

  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}



//user Remove medication  to cart/////////////
export const userRemoveMedicationToCartController = async (
  req: any,
  res: Response,
) => {

try {
  const {
      cartId,
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


  const deletedCart = await CartModel.findOneAndDelete({_id: cartId, userId: userId}, {new: true});

  if (!deletedCart) {
    return res
        .status(401)
        .json({ message: "medication not in cart list" });
  }

  return res.status(200).json({
      message: "medication remove from cart list succefully",
  })


} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}

}

//user get all cartlist /////////////
export const userCartListController = async (
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


  const cartList = await CartModel.find({userId});

  let cartLists = [];

  let overallCost = 0;

  for (let i = 0; i < cartList.length; i++) {
    const cart = cartList[i];

    const userMedication = await UserMedicationModel.findOne({_id: cart.userMedicationId, userId});
    const medication = await MedicationModel.findOne({_id: cart.medicationId});

    const price: any = medication?.price

    const cartObj = {
      userId: userId,
      medicationId: cart.medicationId,
      userMedicationId: cart.userMedicationId,
      name: medication?.name,
      ingridient: medication?.ingredient,
      price: medication?.price,
      form: medication?.form,
      dosage: medication?.strength,
      quantity: medication?.quantity,
      medicationImage: medication?.medicationImage,
      quantityrquired: cart.quantityrquired,
      totalCost: cart.quantityrquired * parseInt(price),
    }
    
    cartLists.push(cartObj);
    const cost = cart.quantityrquired * parseInt(price);
    overallCost = overallCost + cost;
  }

  return res.status(200).json({
      cartLists,
      overallCost 
  })


} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}

}
