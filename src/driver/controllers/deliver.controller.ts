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
import MedicationModel from "../../admin/models/medication.model";

import MedicationDeliveryModel from "../model/medication.delivery.model";
import DoctotModel from "../../doctor/modal/doctor_reg.modal";
import DoctorWalletModel from "../../doctor/modal/doctorWallet.model";


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
            message: "item delivered  successfully, waiting for comfirmation from customer"
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
};


// this controller is the final stage of the medication deluvery to the patient
// and marks the medication as delivered for that particular patient
export const initiateMedicationDeliveryToPatient = async (req:any, res:Response) => {
    try{
        // get riders details from request..
        const driver = req.driver;
        const driverId = driver.id;

        // get medication details from request body...
        const medication_id = req.params.medication_id;
        const { amount, address } = req.body;

        const medication:any = await MedicationModel.findById(medication_id);
        if(!medication){
            return res.status(404).json({ message: "sorry, medication not found"});
        }
        // const patient_id = medication.userId;
        const patient = await UserModel.findById(medication.userId);
        if(!patient){
            return res.status(404).json({ message: "sorry, patient for the medication was not found"});
        }

        // get doctor from medication...
        const doctor_id = medication.doctor;
        const doctor = await DoctotModel.findById(doctor_id);
        if(!doctor){
            return res.status(404).json({ message: "couldnt find the prescriber doctor"});
        }


        // set delivery status as intiatated...
        const delivery_status = "initiate";

        // create a new delivery pobject and stor on the database..
        const newDelivery = new MedicationDeliveryModel({
            patient: patient._id,
            medicationId: medication_id,
            amount,
            address,
            driverId,
            deliveredStatus: delivery_status,
            prescriber: doctor,
        });

        await newDelivery.save();

        res.status(201).json({ message: "you initiated medication delivery!", medication, patient });
        

    }catch(error){
        res.status(500).json({ message: "error initiating delivery for medication"});
    }
}




export const markMedicationAsDelivered = async (req: any, res: Response) => {
    try{

        const driver = req.driver;
        const driverId = driver.id;

        // confirm if the driver owns the delivery record..
        const medication_delivery_id = req.params.deliver_id;
        const medication_delivery = await MedicationDeliveryModel.findOne({_id: medication_delivery_id, driverId });
        if(!medication_delivery){
            return res.status(404).json({ message: "sorry no such driver or delivery record found"});
        };

        medication_delivery.deliveryStatus = 'delivered';
        await medication_delivery.save();

        res.status(200).json({ message: "delivery successfully marked as delivered, awaiting patient confirmation"});


    }catch(error){
        res.status(500).json({ message: "error marking medication as delivered"});
    }
};

/* 
this controller will finalize the medication delivery process
and credit the prescriber (doctor) 5% from the total medication amount..
 */ 
export const confirmMedicationAsDelivered = async (req: any, res: Response) => {
    try{

        const medication_delivery_id = req.params.deliver_id;
        const medication_delivery = await MedicationDeliveryModel.findOne({_id: medication_delivery_id, deliveryStatus: "delivered" });
        if(!medication_delivery){
            return res.status(404).json({ message: "sorry this medication has not be delivered yet"});
        };

        medication_delivery.deliveryStatus = "confirmDelivered";
        await medication_delivery.save();

        // const medication_price:Number = medication_delivery.amount;
        
        // doctors cut percentage is only 5% of medication price...
        const doctor_percentage:any = Number(medication_delivery.amount) * 0.05;

        const doctor_id = medication_delivery.prescriber;
        const doctor = await DoctotModel.findById(doctor_id);
        const doctor_wallet = await DoctorWalletModel.findOne({ doctorId: doctor_id });
        if (!doctor_wallet) {
            const newWallet = new DoctorWalletModel({
              doctorId: doctor_id,
              amount: doctor_percentage
            });
            await newWallet.save();
          } else {
            doctor_wallet.amount = doctor_wallet.amount + doctor_percentage;
            await doctor_wallet.save();
          }
        res.status(200).json({ message: "medication deliverey confirmed successfully"});

    }catch(error){
        res.status(500).json({ message: "error confirming delivery..."})
    }
}