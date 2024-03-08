import { validationResult } from "express-validator";
import { Request, Response } from "express";
import DriverModel from "./../model/reg.model";
import DeliverModel from "./../model/deliver.model";
import UserModel from "../../user/models/userReg.model";
import OrderModel from "../../admin/models/order.model";
import { pickUpOrderHtmlTemplate } from "../../templates/email/pickUpDeliveryEmailTemplate";
import { startDeliveryTripHtmlTemplate } from "../../templates/email/startDeliveryTripEmailTemplate";
import { sendEmail } from "../../utils/sendEmailGeneral";
import { uploadToS3 } from "../../utils/aws3.utility";
import { v4 as uuidv4 } from "uuid";

// initiate delivery of new product
export const initateDeliveryGoodsController = async (
    req: any,
    res: Response
) => {
    try {
        const driver = req.driver;
        const driverId = driver.id;

        let {
            enoughFuel,
            phoneCharge,
            theraswitId
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const checkDriver = await DriverModel.findOne({_id: driverId})

        if (!checkDriver) {
            return res
            .status(401)
            .json({ message: "invalid driver" });
        }

        const newDeliver = new DeliverModel({
            driverId,
            enoughFuel,
            phoneCharge,
            theraswitId,
            deliveredStatus: 'initiate'
        })

        await newDeliver.save()

        return res.status(200).json({
            message: "proceed to picking of goods"
        })

    } catch (err: any) {
        res.status(500).json({ message: err.message });
        
    }
}

// driver pick goods
export const pickDeliveryGoodsController = async (
    req: any,
    res: Response
) => {
    try {
        const driver = req.driver;
        const driverId = driver.id;

        let {
            userId,
            orderId,
            deliveryId
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const checkDriver = await DriverModel.findOne({_id: driverId})
        if (!checkDriver) {
            return res
            .status(401)
            .json({ message: "invalid driver" });
        }

        const deliveryGoods = await DeliverModel.findOne({_id: deliveryId, deliveredStatus: 'initiate'})
        if (!deliveryGoods) {
            return res
            .status(401)
            .json({ message: "initiate delivering" });
        }

        const checkUser = await UserModel.findOne({_id: userId})
        if (!checkUser) {
            return res
            .status(401)
            .json({ message: "invalid userId" });
        }

        const checkOrder = await OrderModel.findOne({_id: orderId})
        if (!checkOrder) {
            return res
            .status(401)
            .json({ message: "invalid orderId" });
        }

        const htmlEmail = pickUpOrderHtmlTemplate(checkOrder.address, checkOrder.deliveryDate)

        await sendEmail({
            emailTo: checkUser.email,
            subject: "order pickup",
            html: htmlEmail
        })

        deliveryGoods.userId = userId
        deliveryGoods.orderId = orderId
        deliveryGoods.deliveredStatus = 'pickup'
        await deliveryGoods.save()

        return res.status(200).json({
            message: "you can start the trip"
        })

    } catch (err: any) {
        res.status(500).json({ message: err.message });
        
    }
}


// driver start delivery trip
export const startDeliveryGoodsController = async (
    req: any,
    res: Response
) => {
    try {
        const driver = req.driver;
        const driverId = driver.id;

        let {
            userId,
            orderId,
            deliveryId
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const checkDriver = await DriverModel.findOne({_id: driverId})
        if (!checkDriver) {
            return res
            .status(401)
            .json({ message: "invalid driver" });
        }

        const deliveryGoods = await DeliverModel.findOne({_id: deliveryId, deliveredStatus: 'pickup'})
        if (!deliveryGoods) {
            return res
            .status(401)
            .json({ message: "initiate delivering" });
        }

        const checkUser = await UserModel.findOne({_id: userId})
        if (!checkUser) {
            return res
            .status(401)
            .json({ message: "invalid userId" });
        }

        const checkOrder = await OrderModel.findOne({_id: orderId})
        if (!checkOrder) {
            return res
            .status(401)
            .json({ message: "invalid orderId" });
        }

        const htmlEmail = startDeliveryTripHtmlTemplate()

        await sendEmail({
            emailTo: checkUser.email,
            subject: "order pickup",
            html: htmlEmail
        })

        deliveryGoods.deliveredStatus = 'startTrip'
        await deliveryGoods.save()

        return res.status(200).json({
            message: "you can start the trip"
        })

    } catch (err: any) {
        res.status(500).json({ message: err.message });
        
    }
}


// driver deliver by contact of customer
export const contactDeliveryGoodsController = async (
    req: any,
    res: Response
) => {
    try {
        const driver = req.driver;
        const driverId = driver.id;

        let {
            deliveryId
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const checkDriver = await DriverModel.findOne({_id: driverId})
        if (!checkDriver) {
            return res
            .status(401)
            .json({ message: "invalid driver" });
        }

        const deliveryGoods = await DeliverModel.findOne({_id: deliveryId, deliveredStatus: 'startTrip'})
        if (!deliveryGoods) {
            return res
            .status(401)
            .json({ message: "initiate delivering" });
        }

        deliveryGoods.deliveredStatus = 'delivered'
        await deliveryGoods.save()

        return res.status(200).json({
            message: "item delivered  successfully, wating for comfirmation from customer"
        })

    } catch (err: any) {
        res.status(500).json({ message: err.message });
        
    }
}

// driver deliver by contactless of customer
export const contactlessDeliveryGoodsController = async (
    req: any,
    res: Response
) => {
    try {
        const driver = req.driver;
        const driverId = driver.id;

        let {
            deliveryId
        } = req.body;

        const file = req.file;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const checkDriver = await DriverModel.findOne({_id: driverId})
        if (!checkDriver) {
            return res
            .status(401)
            .json({ message: "invalid driver" });
        }

        const deliveryGoods = await DeliverModel.findOne({_id: deliveryId, deliveredStatus: 'startTrip'})
        if (!deliveryGoods) {
            return res
            .status(401)
            .json({ message: "initiate delivering" });
        }

        let deliveredImg;

        if (!file) {
            return res.status(401).json({ message: "provide image for proof." });
          }else{
            const filename = uuidv4();
            const result = await uploadToS3(req.file.buffer, `${filename}.jpg`);
            deliveredImg = result?.Location!;  
          }
      

        deliveryGoods.deliveredStatus = 'delivered'
        deliveryGoods.deliveredImage = deliveredImg
        await deliveryGoods.save()

        return res.status(200).json({
            message: "item delivered  successfully, wating for comfirmation from customer"
        })

    } catch (err: any) {
        res.status(500).json({ message: err.message });
        
    }
}


// customer comfirm delivery
export const customercomfirmDeliveryGoodsController = async (
    req: any,
    res: Response
) => {
    try {
        let {
            deliveryId
        } = req.body;

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const deliveryGoods = await DeliverModel.findOne({_id: deliveryId, deliveredStatus: 'delivered'})
        if (!deliveryGoods) {
            return res
            .status(401)
            .json({ message: "initiate delivering" });
        }
      
        deliveryGoods.deliveredStatus = 'comfirmDelivered'
        await deliveryGoods.save()

        return res.status(200).json({
            message: "delivery successfully comfirm"
        })

    } catch (err: any) {
        res.status(500).json({ message: err.message });
        
    }
}