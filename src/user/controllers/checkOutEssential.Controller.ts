import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../models/userReg.model";
import OrderModel from "../../admin/models/order.model";
import fetch from "node-fetch";
import EssentialCart from "../models/ensentialCart.model";
import EssentialProductModel from "../../admin/models/essentialProduct.model";
import EssentialCategoryModel from "../../admin/models/essentialCategori.model";


//user checkout  essential Product/////////////
export const userCheckOutEssentialPRoductController = async (
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
    } = req.body;

    const file = req.file;

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

    const carts = await EssentialCart.find({userId});

    if (carts.length < 1) {
        return res
        .status(401)
        .json({ message: "no product in cart" });
    }

    const refererCredit = userExist.refererCredit;

    let totalCost = 0;
    let productArray = [];
    for (let i = 0; i < carts.length; i++) {
        const cart = carts[i];

        const product = await EssentialProductModel.findOne({_id: cart.productId});
       // const userMedication = await UserMedicationModel.findOne({_id: cart.userMedicationId, userId})
        if (product) {
            
            // if (medication.prescriptionRequired == "required" && userMedication.prescriptionStatus == false) {  
            //     continue;
            // }

            totalCost = totalCost + (cart.quantityrquired * parseInt(product.price))
            
            const productObt = {
                productId: product._id,
                name: product.name,
                quantity: product.quantity,
                price: product.price.toString(),
                orderQuantity: cart.quantityrquired.toString(),
                refill: cart.refill,
            }

            productArray.push(productObt);
        }
        
    }

    // if (medArray.length < 1) {
    //     return res
    //     .status(401)
    //     .json({ message: "all your medication required prescripstion" });
    // }

    if (refererCredit >= totalCost) {

      const currentDate = new Date();

      // Extract day, month, year, and time components
      const day = currentDate.getDate(); // Day of the month (1-31)
      const month = currentDate.getMonth() + 1; // Month (0-11), add 1 to get the real month (1-12)
      const year = currentDate.getFullYear(); // Full year (e.g., 2023)
      const hours = currentDate.getHours(); // Hours (0-23)
      const minutes = currentDate.getMinutes(); // Minutes (0-59)
      const seconds = currentDate.getSeconds(); // Seconds (0-59)

      // Format the components as a string
      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
        
        const order = new OrderModel({
            userId,
            firstName,
            lastName,
            dateOfBirth,
            gender,
            address,
            paymentId: "referer credit",
            //medications: medArray,
            ensential: productArray,
            deliveryDate: deliveryDate,
            refererBunousUsed: totalCost.toString(),
            totalAmount: totalCost.toString(),
            amountPaid: '0',
            paymentDate: formattedDate,
            deliveredStatus: 'not delivered'
        })

        await order.save();

        userExist.refererCredit = refererCredit - totalCost;
        userExist.reference = "referer credit"
        await userExist.save();

        return res.status(200).json({
            message: "payment successfully using referer credit",
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
      medications: productArray,
      deliveryDate: deliveryDate,
      refererBunousUsed: refCre,
      totalAmount: totalCost,
    }

    const paystackSecretKey = 'sk_test_b27336978f0f77d84915d7e883b0f756f6d150e7';
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
        metadata
      }),
    });

    const data = await response.json();

    if (!data.status) {
      return res
        .status(401)
        .json({ message: "unable to initailize payment" });
    }

    // Extract day, month, year, and time components
    const day = currentDate.getDate(); // Day of the month (1-31)
    const month = currentDate.getMonth() + 1; // Month (0-11), add 1 to get the real month (1-12)
    const year = currentDate.getFullYear(); // Full year (e.g., 2023)
    const hours = currentDate.getHours(); // Hours (0-23)
    const minutes = currentDate.getMinutes(); // Minutes (0-59)
    const seconds = currentDate.getSeconds(); // Seconds (0-59)

    // Format the components as a string
    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
      
      const order = new OrderModel({
          userId,
          firstName,
          lastName,
          dateOfBirth,
          gender,
          address,
          paymentId: data.data.reference,
          //medications: medArray,
          ensential: productArray,
          deliveryDate: deliveryDate,
          refererBunousUsed: refCre,
          totalAmount: totalCost.toString(),
          amountPaid: amount,
          paymentDate: formattedDate,
          deliveredStatus: 'pending'
      })

      const savedOrdered = await order.save();

      userExist.refererCredit = 0;
      userExist.reference = data.data.reference
      await userExist.save();

    return res.status(200).json({
      message: "payment successfully initialize", 
      url: data.data.authorization_url,
      reference: data.data.reference,
      orderId: savedOrdered._id
    })
    
    
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }

}