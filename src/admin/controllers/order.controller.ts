import { validationResult } from "express-validator";
import { Request, Response } from "express";
import UserModel from "../../user/models/userReg.model";
import OrderModel from "../models/order.model";


//get all order not deliver /////////////
export const getAllOrderNotDeliveredController = async (
    req: any,
    res: Response,
) => {
  try {

    const orders = await OrderModel.find({deliveredStatus: "not delivered"}).sort({createdAt: -1});

   let orderArry = [];
   for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    const user = await UserModel.findOne({_id: order.userId});

    const orderObj = {
      orderId: order._id,  
      id: user?._id,
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName, 
      dateOfBirth: user?.dateOfBirth,
      lastName: user?.lastName,
      mobileNumber: user?.mobileNumber,
      gender: user?.gender,
      paymentId: order.paymentId,
      medications: order.medications,
      deliveryDate: order.deliveryDate,
      refererBunousUsed: order.refererBunousUsed,
      totalAmount: order.totalAmount,
      amountPaid: order.amountPaid,
      paymentDate: order.paymentDate,
      deliveredStatus: order.deliveredStatus
    }

    orderArry.push(orderObj);
    
   }

    return res.status(200).json({
        message: "success",
       users: orderArry
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//get all order not deliver /////////////
export const getPageOrderNotDeliveredController = async (
    req: any,
    res: Response,
) => {
  try {

    const page = parseInt(req.body.page) || 1; // Page number, default to 1
    const limit = parseInt(req.body.limit) || 10; // Documents per page, default to 10

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    const totalOrders = await OrderModel.countDocuments({deliveredStatus: "not delivered"}); // Get the total number of documents

    const orders = await OrderModel.find({deliveredStatus: "not delivered"}).sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

   let orderArry = [];
   for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    const user = await UserModel.findOne({_id: order.userId});

    const orderObj = {
      orderId: order._id,  
      id: user?._id,
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName, 
      dateOfBirth: user?.dateOfBirth,
      lastName: user?.lastName,
      mobileNumber: user?.mobileNumber,
      gender: user?.gender,
      paymentId: order.paymentId,
      medications: order.medications,
      deliveryDate: order.deliveryDate,
      refererBunousUsed: order.refererBunousUsed,
      totalAmount: order.totalAmount,
      amountPaid: order.amountPaid,
      paymentDate: order.paymentDate,
      deliveredStatus: order.deliveredStatus
    }

    orderArry.push(orderObj);
    
   }

    return res.status(200).json({
        message: "success",
        users: orderArry,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}



//get single order not deliver /////////////
export const getSingleOrderNotDeliveredController = async (
    req: any,
    res: Response,
) => {
  try {
    const {
        orderId
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const order = await OrderModel.findOne({_id: orderId, deliveredStatus: "not delivered"});

    if (!order) {
        return res.status(401).json({ message: "incorrect Order ID." });
    }

    const user = await UserModel.findOne({_id: order?.userId});

    const orderObj = {
      orderId: order?._id,  
      id: user?._id,
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName, 
      dateOfBirth: user?.dateOfBirth,
      lastName: user?.lastName,
      mobileNumber: user?.mobileNumber,
      gender: user?.gender,
      paymentId: order?.paymentId,
      medications: order?.medications,
      deliveryDate: order?.deliveryDate,
      refererBunousUsed: order?.refererBunousUsed,
      totalAmount: order?.totalAmount,
      amountPaid: order?.amountPaid,
      paymentDate: order?.paymentDate,
      deliveredStatus: order?.deliveredStatus
    }

    

    return res.status(200).json({
        message: "success",
        users: orderObj
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}




//get all order  delivered /////////////
export const getAllOrderDeliveredController = async (
    req: any,
    res: Response,
) => {
  try {

    const orders = await OrderModel.find({deliveredStatus: "delivered"}).sort({createdAt: -1});

   let orderArry = [];
   for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    const user = await UserModel.findOne({_id: order.userId});

    const orderObj = {
      orderId: order._id,  
      id: user?._id,
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName, 
      dateOfBirth: user?.dateOfBirth,
      lastName: user?.lastName,
      mobileNumber: user?.mobileNumber,
      gender: user?.gender,
      paymentId: order.paymentId,
      medications: order.medications,
      deliveryDate: order.deliveryDate,
      refererBunousUsed: order.refererBunousUsed,
      totalAmount: order.totalAmount,
      amountPaid: order.amountPaid,
      paymentDate: order.paymentDate,
      deliveredStatus: order.deliveredStatus
    }

    orderArry.push(orderObj);
    
   }

    return res.status(200).json({
        message: "success",
       users: orderArry
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}


//get page order delivered /////////////
export const getPageOrderDeliveredController = async (
    req: any,
    res: Response,
) => {
  try {

    const page = parseInt(req.body.page) || 1; // Page number, default to 1
    const limit = parseInt(req.body.limit) || 10; // Documents per page, default to 10

    const skip = (page - 1) * limit; // Calculate how many documents to skip

    const totalOrders = await OrderModel.countDocuments({deliveredStatus: "delivered"}); // Get the total number of documents

    const orders = await OrderModel.find({deliveredStatus: "delivered"}).sort({createdAt: -1})
    .skip(skip)
    .limit(limit);

   let orderArry = [];
   for (let i = 0; i < orders.length; i++) {
    const order = orders[i];

    const user = await UserModel.findOne({_id: order.userId});

    const orderObj = {
      orderId: order._id,  
      id: user?._id,
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName, 
      dateOfBirth: user?.dateOfBirth,
      lastName: user?.lastName,
      mobileNumber: user?.mobileNumber,
      gender: user?.gender,
      paymentId: order.paymentId,
      medications: order.medications,
      deliveryDate: order.deliveryDate,
      refererBunousUsed: order.refererBunousUsed,
      totalAmount: order.totalAmount,
      amountPaid: order.amountPaid,
      paymentDate: order.paymentDate,
      deliveredStatus: order.deliveredStatus
    }

    orderArry.push(orderObj);
    
   }

    return res.status(200).json({
        message: "success",
        users: orderArry,
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}



//get single order delivered /////////////
export const getSingleOrderDeliveredController = async (
    req: any,
    res: Response,
) => {
  try {
    const {
        orderId
    } = req.body;
    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   
    const order = await OrderModel.findOne({_id: orderId, deliveredStatus: "delivered"});
    
    if (!order) {
        return res.status(401).json({ message: "incorrect Order ID." });
    }

    const user = await UserModel.findOne({_id: order?.userId});

    const orderObj = {
      orderId: order?._id,  
      id: user?._id,
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName, 
      dateOfBirth: user?.dateOfBirth,
      lastName: user?.lastName,
      mobileNumber: user?.mobileNumber,
      gender: user?.gender,
      paymentId: order?.paymentId,
      medications: order?.medications,
      deliveryDate: order?.deliveryDate,
      refererBunousUsed: order?.refererBunousUsed,
      totalAmount: order?.totalAmount,
      amountPaid: order?.amountPaid,
      paymentDate: order?.paymentDate,
      deliveredStatus: order?.deliveredStatus
    }

    

    return res.status(200).json({
        message: "success",
        users: orderObj
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}




//delivered order /////////////
export const DeliveredOrderController = async (
    req: any,
    res: Response,
) => {
  try {
    const {
        orderId
    } = req.body;

    // Check for validation errors
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

   
    const order = await OrderModel.findOne({_id: orderId, deliveredStatus: "not delivered"});

    if (!order) {
        return res.status(401).json({ message: "incorrect Order ID." });
    }

    order.deliveredStatus = "delivered";

    const orderDelivered = await order.save();

    const user = await UserModel.findOne({_id: order?.userId});

    const orderObj = {
      orderId: order?._id,  
      id: user?._id,
      userId: user?.userId,
      email: user?.email,
      firstName: user?.firstName, 
      dateOfBirth: user?.dateOfBirth,
      lastName: user?.lastName,
      mobileNumber: user?.mobileNumber,
      gender: user?.gender,
      paymentId: order?.paymentId,
      medications: order?.medications,
      deliveryDate: order?.deliveryDate,
      refererBunousUsed: order?.refererBunousUsed,
      totalAmount: order?.totalAmount,
      amountPaid: order?.amountPaid,
      paymentDate: order?.paymentDate,
      deliveredStatus: orderDelivered?.deliveredStatus
    }

    

    return res.status(200).json({
        message: "order Successfully delivered",
        users: orderObj
    })
 
  } catch (err: any) {
    // signup error
    res.status(500).json({ message: err.message });
  }
}

