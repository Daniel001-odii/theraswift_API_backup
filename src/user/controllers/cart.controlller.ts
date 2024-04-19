import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import UserMedicationModel from "../models/medication.model";
import MedicationModel from "../../admin/models/medication.model"
import CartModel from "../models/cart.model";
import EssentialProductModel from "../../admin/models/essentialProduct.model";

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

    let madicationAvailable = false
    let medicationId = ''
    let patientMedicationId = ''

    //get user medication
    const userMedication = await UserMedicationModel.findOne({_id: userMedicationId});

    if (userMedication) {
      madicationAvailable = true
      medicationId = JSON.stringify(userMedication.medicationId)
      patientMedicationId = userMedicationId

    }

    //get  medication
    const medication = await MedicationModel.findOne({_id: userMedicationId});
    if (medication) {
      madicationAvailable = true
      medicationId = userMedicationId
      patientMedicationId = 'not in medication'

    }

    if (!madicationAvailable) {
      return res
        .status(401)
        .json({ message: "invalid user medication or medication not found" });
    }

    const cartExist = await CartModel.findOne({userId: userId, medicationId: medicationId});

    if (cartExist) {
        return res
        .status(401)
        .json({ message: "medication already in cart list" });
    }

    const cart = new CartModel({
        userId,
        medicationId: medicationId,
        userMedicationId: patientMedicationId,
        quantityrquired: 1,
        type: "med"
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

  let product: any;

  for (let i = 0; i < cartList.length; i++) {
    const cart = cartList[i];

    if (cart.type == "med") {
      const userMedication = await UserMedicationModel.findOne({_id: cart.userMedicationId, userId});
      const medication = await MedicationModel.findOne({_id: cart.medicationId});

      if (!userMedication || !medication) {
        continue;
      }
      const cost = cart.quantityrquired * parseFloat(medication.price);
      overallCost = overallCost + cost;
      product = medication
    }else{
      const essentialProduct = await EssentialProductModel.findOne({_id: cart.productId})
      if (!essentialProduct) {
        continue;
      }
      const cost = cart.quantityrquired * parseFloat(essentialProduct.price);
      overallCost = overallCost + cost;
      product = essentialProduct
    }


    const cartObj = {
      cart,
      product
    }
    
    cartLists.push(cartObj);
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


//user change refill status of medication in cart/////////////
export const userRefillStatusCartController = async (
  req: any,
  res: Response,
) => {

try {
  const {
      cartId,
  } = req.query;

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

  const cart = await CartModel.findOne({_id: cartId, userId: userId});

  if (!cart) {
    return res
        .status(401)
        .json({ message: "medication not in cart list" });
  }

  if (cart.refill == "no") {
    cart.refill = "yes"
  }else{
    cart.refill = "no"
  }

  await cart.save();

  return res.status(200).json({
      message: "medication refill status change succefully",
  })

} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}

}
