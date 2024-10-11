import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import UserMedicationModel from "../models/medication.model";
import MedicationModel from "../../admin/models/medication.model";
import OrderModel from "../../admin/models/order.model";
import CartModel from "../models/cart.model";
import fetch from "node-fetch";
import EssentialProductModel from "../../admin/models/essentialProduct.model";



//user checkout /////////////
export const userCheckOutController = async (
    req: any,
    res: Response,
) => {

  try {
    const {
        deliveryDate,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        address,
        others,
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

    const carts = await CartModel.find({userId});

    if (carts.length < 1) {
        return res
        .status(401)
        .json({ message: "no medication in cart" });
    }

    const refererCredit = userExist.refererCredit;

    let totalCost = 0;
    let medArray = [];
    let essentialProductarray = [];
    for (let i = 0; i < carts.length; i++) {
        const cart = carts[i];

        if (cart.type == "med") {
        
          const medication = await MedicationModel.findOne({_id: cart.medicationId});
          // const userMedication = await UserMedicationModel.findOne({_id: cart.userMedicationId, userId})

          if (medication) {
              
              // if (medication.prescriptionRequired == "required" && userMedication.prescriptionStatus == false) {  
              //     continue;
              // }

              totalCost = totalCost + (cart.quantityrquired * medication.price)
              
              const medicationObt = {
                medication: medication,
                orderQuantity: cart.quantityrquired,
                refill: cart.refill,
              }

              medArray.push(medicationObt);
          }

        }else{

          const essentialProdut = await EssentialProductModel.findOne({_id: cart.productId})

          if (!essentialProdut) {
            continue;
          }

          totalCost = totalCost + (cart.quantityrquired * parseFloat(essentialProdut.price))
              
          const productObt = {
            product: essentialProdut,
            orderQuantity: cart.quantityrquired,
            refill: cart.refill,
          }

          essentialProductarray.push(productObt);

        }
     
    }

    // if (medArray.length < 1 && essentialProductarray.length < 1) {
    //     return res
    //     .status(401)
    //     .json({ message: "all your medication required prescripstion" });
    // }

    if (refererCredit >= totalCost) {

      const currentDate = new Date();
     
      const milliseconds = currentDate.getMilliseconds();
      let orderId = milliseconds.toString().substring(milliseconds.toString().length - 5);
        
        const order = new OrderModel({
          userId,
          firstName,
          lastName,
          dateOfBirth,
          gender,
          address,
          paymentId: "referer credit",
          medications: medArray,
          ensential: essentialProductarray,
          deliveryDate: deliveryDate,
          refererBunousUsed: totalCost.toString(),
          totalAmount: totalCost,
          amountPaid: 0,
          paymentDate: currentDate,
          deliveredStatus: 'not delivered',
          orderId,
          others
        })

        const me = await order.save();

        userExist.refererCredit = refererCredit - totalCost;
        userExist.reference = "referer credit"
        await userExist.save();

        for (let i = 0; i < carts.length; i++) {
          const cart = carts[i];

         const deletedCart = await CartModel.findOneAndDelete({_id: cart._id, userId: userId}, {new: true});

         if (!deletedCart) continue
          
        }

        return res.status(200).json({
            message: "payment successfully using referer credit",
            url: "",
            reference: "",
            orderId: ""
        })
    }

    let refCre = 0;

    if (refererCredit > 0) {
        refCre = refererCredit;
    } else {
        refCre = 0;
    }
    const amount = totalCost - refCre;

    const metadata = {
      userId,
      medications: medArray,
      deliveryDate: deliveryDate,
      refererBunousUsed: refCre,
      totalAmount: totalCost,
    }

    const paystackSecretKey = process.env.PAYSTACK_KEY;
    const currentDate = new Date();
    const milliseconds = currentDate.getMilliseconds();

    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Amount in kobo (e.g., 10000 kobo = ₦100)
        email: userExist.email,
        reference: milliseconds,
        metadata,
        callback_url: "https://app.theraswift.io/checkout/verify"
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return res
        .status(401)
        .json({ message: "unable to initailize payment" });
    }

    let orderId = milliseconds.toString().substring(milliseconds.toString().length - 5);
      
    const order = new OrderModel({
      userId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      address,
      paymentId: data.data.reference,
      medications: medArray,
      ensential: essentialProductarray,
      deliveryDate: deliveryDate,
      refererBunousUsed: refCre,
      totalAmount: totalCost,
      amountPaid: amount,
      paymentDate: currentDate,
      deliveredStatus: 'pending',
      orderId,
      others
    })

    const savedOrdered = await order.save();

    userExist.refererCredit = 0;
    userExist.reference = data.data.reference
    await userExist.save();

    for (let i = 0; i < carts.length; i++) {
      const cart = carts[i];

     const deletedCart = await CartModel.findOneAndDelete({_id: cart._id, userId: userId}, {new: true});

     if (!deletedCart) continue
      
    }


    return res.status(200).json({
      message: "payment successfully initialize", 
      url: data.data.authorization_url,
      reference: data.data.reference,
      //orderId: savedOrdered._id
    })

    
  } catch (err: any) {
    // signup error
    console.log("error", err)
    res.status(500).json({ message: err.message });
  }

}


//user payment verification /////////////
export const userCheckOutPaymentVerificationController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
      reference,
      // orderId,
    } = req.body;

    const paystackSecretKey = process.env.PAYSTACK_KEY;

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
      },
    });

    const data = await response.json();

    if (!data.status) {
      return res
          .status(401)
          .json({ message: "Transaction reference not found" });   
    }


    if (data.data.gateway_response != 'Successful') {
      return res
      .status(401)
      .json({ message: "transaction was not completed" });   
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

    const userIdVeri = data.data.metadata.userId;

    if (userId != userIdVeri) {
      return res
      .status(401)
      .json({ message: "invalid user" });  
    }

    const order = await OrderModel.findOneAndUpdate({ paymentId: reference, userId: userId, deliveredStatus: "pending"}, {deliveredStatus: "not delivered"}, {new: true});

    if (!order) {
      return res
      .status(401)
      .json({ message: "order not fund" }); 
    }
    
    return res.status(200).json({
      message: "transaction verified successfully",
      order
    })
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user pending order /////////////
export const userGetPendingOrderController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
    } = req.body;

   
    const user = req.user;
    const userId = user.id

    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const pendingOrder = await OrderModel.find({userId, deliveredStatus: "pending"})

    return res.status(200).json({
      pendingOrder
    })
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}

//user not delivered order /////////////
export const userGetNotDeliveredOrderController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
    } = req.body;

   
    const user = req.user;
    const userId = user.id

    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const notDeliveredOrder = await OrderModel.find({userId, deliveredStatus: "not delivered"})

    return res.status(200).json({
      notDeliveredOrder
    })
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user delivered order /////////////
export const userGetDeliveredOrderController = async (
  req: any,
  res: Response,
) => {

  try {
    const {
    } = req.body;

   
    const user = req.user;
    const userId = user.id

    //get user info from databas
    const userExist = await UserModel.findOne({_id: userId});

    if (!userExist) {
      return res
        .status(401)
        .json({ message: "invalid credential" });
    }

    const deliveredOrder = await OrderModel.find({userId, deliveredStatus: "delivered"})

    return res.status(200).json({
      deliveredOrder
    })
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}


//user checkout from list of medication /////////////
export const userCheckOutFromAvailableMedController = async (
  req: any,
  res: Response,
) => {

try {
  const {
      deliveryDate,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      address,
      others,
      medicationId,
      type,
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

  const refererCredit = userExist.refererCredit;

  let totalCost = 0;
  let medArray = [];
  let essentialProductarray = [];

  if (type == "med") {
  
    const medication = await MedicationModel.findOne({_id: medicationId});
    
    if (!medication) {
      return res
          .status(401)
          .json({ message: "can not find this medication" });
    }

    totalCost = totalCost + medication.price
    
    const medicationObt = {
      medication: medication,
      orderQuantity: 1,
      refill: 'non',
    }

    medArray.push(medicationObt);

  }else{

    const essentialProdut = await EssentialProductModel.findOne({_id: medicationId})

    if (!essentialProdut) {
      return res
          .status(401)
          .json({ message: "can not find this product" });
    }

    totalCost = totalCost + parseFloat(essentialProdut.price)
        
    const productObt = {
      product: essentialProdut,
      orderQuantity: 1,
      refill: 'non',
    }

    essentialProductarray.push(productObt);

  }
   
 

  if (refererCredit >= totalCost) {

    const currentDate = new Date();
   
    const milliseconds = currentDate.getMilliseconds();
    let orderId = milliseconds.toString().substring(milliseconds.toString().length - 5);
      
      const order = new OrderModel({
        userId,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        address,
        paymentId: "referer credit",
        medications: medArray,
        ensential: essentialProductarray,
        deliveryDate: deliveryDate,
        refererBunousUsed: totalCost.toString(),
        totalAmount: totalCost,
        amountPaid: 0,
        paymentDate: currentDate,
        deliveredStatus: 'not delivered',
        orderId,
        others
      })

      const me = await order.save();

      userExist.refererCredit = refererCredit - totalCost;
      userExist.reference = "referer credit"
      await userExist.save();

      return res.status(200).json({
          message: "payment successfully using referer credit",
          url: "",
          reference: "",
          orderId: ""
      })
  }

  let refCre = 0;

  if (refererCredit > 0) {
      refCre = refererCredit;
  } else {
      refCre = 0;
  }
  const amount = totalCost - refCre;

  const metadata = {
    userId,
    medications: medArray,
    deliveryDate: deliveryDate,
    refererBunousUsed: refCre,
    totalAmount: totalCost,
  }

  const paystackSecretKey = process.env.PAYSTACK_KEY;
  const currentDate = new Date();
  const milliseconds = currentDate.getMilliseconds();

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${paystackSecretKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount: amount * 100, // Amount in kobo (e.g., 10000 kobo = ₦100)
      email: userExist.email,
      reference: milliseconds,
      metadata,
      callback_url: "https://app.theraswift.io/checkout/verify"
    }),
  });

  const data = await response.json();

  if (!data.status) {
    return res
      .status(401)
      .json({ message: "unable to initailize payment" });
  }

  let orderId = milliseconds.toString().substring(milliseconds.toString().length - 5);
    
  const order = new OrderModel({
    userId,
    firstName,
    lastName,
    dateOfBirth,
    gender,
    address,
    paymentId: data.data.reference,
    medications: medArray,
    ensential: essentialProductarray,
    deliveryDate: deliveryDate,
    refererBunousUsed: refCre,
    totalAmount: totalCost,
    amountPaid: amount,
    paymentDate: currentDate,
    deliveredStatus: 'pending',
    orderId,
    others
  })

  const savedOrdered = await order.save();

  userExist.refererCredit = 0;
  userExist.reference = data.data.reference
  await userExist.save();

  return res.status(200).json({
    message: "payment successfully initialize", 
    url: data.data.authorization_url,
    reference: data.data.reference,
    //orderId: savedOrdered._id
  })

  
} catch (err: any) {
  // signup error
  console.log("error", err)
  res.status(500).json({ message: err.message });
}

}