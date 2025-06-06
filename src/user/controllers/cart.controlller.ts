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
    let medicationId: any  = ''
    let patientMedicationId = ''

    console.log(1)

    //get user medication
    const userMedication = await UserMedicationModel.findOne({_id: userMedicationId});

    console.log(2)
    if (userMedication) {
      madicationAvailable = true
      medicationId = userMedication.medicationId
      patientMedicationId = userMedicationId
      console.log(3)

    }

    //get  medication
    const medication = await MedicationModel.findOne({_id: userMedicationId});
    console.log(4)
    if (medication) {
      madicationAvailable = true
      medicationId = userMedicationId
      patientMedicationId = 'not in medication'
      console.log(5)

    }

    if (!madicationAvailable) {
      return res
        .status(401)
        .json({ message: "invalid user medication or medication not found" });
    }

    console.log(6)

    const cartExist = await CartModel.findOne({userId: userId, medicationId: medicationId});

    console.log(7)
    if (cartExist) {
        return res
        .status(401)
        .json({ message: "medication already in cart list" });
    }

    console.log(9)
    const cart = new CartModel({
        userId,
        medicationId: medicationId,
        userMedicationId: patientMedicationId,
        quantityrquired: 1,
        type: "med"
    })
    console.log(10)

    const saveCart = await cart.save();
    console.log(11)

    return res.status(200).json({
        message: "medication added to cart succefully",
        data: saveCart
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

  console.log(1)

  const cartList = await CartModel.find({userId});

  let cartLists = [];

  let overallCost = 0;

  let product: any;

  console.log(2)

  for (let i = 0; i < cartList.length; i++) {
    const cart = cartList[i];
    console.log(3)

    if (cart.type == "med") {
      // const userMedication = await UserMedicationModel.findOne({_id: cart.userMedicationId, userId});
      console.log(14)
      const medication = await MedicationModel.findOne({_id: cart.medicationId});
      console.log(4)
      if (!medication) {
        continue;
      }
      const cost = cart.quantityrquired * medication.price;
      overallCost = overallCost + cost;

      console.log(5)
      product = medication
    }else if (cart.type == "ess"){
      console.log(6)
      const essentialProduct = await EssentialProductModel.findOne({_id: cart.productId})

      console.log(7)
      if (!essentialProduct) {
        continue;
      }

      console.log(8)
      const cost = cart.quantityrquired * parseFloat(essentialProduct.price);
      overallCost = overallCost + cost;
      product = essentialProduct
      console.log(9)
    }else{
      continue
    }


    const cartObj = {
      cart,
      product
    }

    console.log(10)
    
    cartLists.push(cartObj);
  }

  console.log(11)

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

//user clear cart listn/////////////
export const userClearCartlistController = async (
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


  //const deletedCart = await CartModel.findOneAndDelete({_id: cartId, userId: userId}, {new: true});
  const clearCart = await CartModel.deleteMany({userId: { $in:  userId}})

  return res.status(200).json({
      message: "cart list cleared successfully",
  })


} catch (err: any) {
  // signup error
  res.status(500).json({ message: err.message });
}

}
