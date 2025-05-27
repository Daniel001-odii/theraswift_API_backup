"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmMedicationAsDelivered = exports.markMedicationAsDelivered = exports.initiateMedicationDeliveryToPatient = exports.customercomfirmDeliveryGoodsController = exports.contactlessDeliveryGoodsController = exports.contactDeliveryGoodsController = exports.startDeliveryGoodsController = exports.pickDeliveryGoodsController = exports.initateDeliveryGoodsController = void 0;
const express_validator_1 = require("express-validator");
const reg_model_1 = __importDefault(require("./../model/reg.model"));
const deliver_model_1 = __importDefault(require("./../model/deliver.model"));
const userReg_model_1 = __importDefault(require("../../user/models/userReg.model"));
const order_model_1 = __importDefault(require("../../admin/models/order.model"));
const pickUpDeliveryEmailTemplate_1 = require("../../templates/email/pickUpDeliveryEmailTemplate");
const startDeliveryTripEmailTemplate_1 = require("../../templates/email/startDeliveryTripEmailTemplate");
const sendEmailGeneral_1 = require("../../utils/sendEmailGeneral");
const aws3_utility_1 = require("../../utils/aws3.utility");
const uuid_1 = require("uuid");
const medication_model_1 = __importDefault(require("../../admin/models/medication.model"));
const medication_delivery_model_1 = __importDefault(require("../model/medication.delivery.model"));
const doctor_reg_modal_1 = __importDefault(require("../../doctor/modal/doctor_reg.modal"));
const doctorWallet_model_1 = __importDefault(require("../../doctor/modal/doctorWallet.model"));
// initiate delivery of new product
const initateDeliveryGoodsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = req.driver;
        const driverId = driver.id;
        let { enoughFuel, phoneCharge, theraswitId } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const checkDriver = yield reg_model_1.default.findOne({ _id: driverId });
        if (!checkDriver) {
            return res
                .status(401)
                .json({ message: "invalid driver" });
        }
        const newDeliver = new deliver_model_1.default({
            driverId,
            enoughFuel,
            phoneCharge,
            theraswitId,
            deliveredStatus: 'initiate'
        });
        yield newDeliver.save();
        return res.status(200).json({
            message: "proceed to picking of goods"
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.initateDeliveryGoodsController = initateDeliveryGoodsController;
// driver pick goods
const pickDeliveryGoodsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = req.driver;
        const driverId = driver.id;
        let { userId, orderId, deliveryId } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const checkDriver = yield reg_model_1.default.findOne({ _id: driverId });
        if (!checkDriver) {
            return res
                .status(401)
                .json({ message: "invalid driver" });
        }
        const deliveryGoods = yield deliver_model_1.default.findOne({ _id: deliveryId, deliveredStatus: 'initiate' });
        if (!deliveryGoods) {
            return res
                .status(401)
                .json({ message: "initiate delivering" });
        }
        const checkUser = yield userReg_model_1.default.findOne({ _id: userId });
        if (!checkUser) {
            return res
                .status(401)
                .json({ message: "invalid userId" });
        }
        const checkOrder = yield order_model_1.default.findOne({ _id: orderId });
        if (!checkOrder) {
            return res
                .status(401)
                .json({ message: "invalid orderId" });
        }
        const htmlEmail = (0, pickUpDeliveryEmailTemplate_1.pickUpOrderHtmlTemplate)(checkOrder.address, checkOrder.deliveryDate);
        yield (0, sendEmailGeneral_1.sendEmail)({
            emailTo: checkUser.email,
            subject: "order pickup",
            html: htmlEmail
        });
        deliveryGoods.userId = userId;
        deliveryGoods.orderId = orderId;
        deliveryGoods.deliveredStatus = 'pickup';
        yield deliveryGoods.save();
        return res.status(200).json({
            message: "you can start the trip"
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.pickDeliveryGoodsController = pickDeliveryGoodsController;
// driver start delivery trip
const startDeliveryGoodsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = req.driver;
        const driverId = driver.id;
        let { userId, orderId, deliveryId } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const checkDriver = yield reg_model_1.default.findOne({ _id: driverId });
        if (!checkDriver) {
            return res
                .status(401)
                .json({ message: "invalid driver" });
        }
        const deliveryGoods = yield deliver_model_1.default.findOne({ _id: deliveryId, deliveredStatus: 'pickup' });
        if (!deliveryGoods) {
            return res
                .status(401)
                .json({ message: "initiate delivering" });
        }
        const checkUser = yield userReg_model_1.default.findOne({ _id: userId });
        if (!checkUser) {
            return res
                .status(401)
                .json({ message: "invalid userId" });
        }
        const checkOrder = yield order_model_1.default.findOne({ _id: orderId });
        if (!checkOrder) {
            return res
                .status(401)
                .json({ message: "invalid orderId" });
        }
        const htmlEmail = (0, startDeliveryTripEmailTemplate_1.startDeliveryTripHtmlTemplate)();
        yield (0, sendEmailGeneral_1.sendEmail)({
            emailTo: checkUser.email,
            subject: "order pickup",
            html: htmlEmail
        });
        deliveryGoods.deliveredStatus = 'startTrip';
        yield deliveryGoods.save();
        return res.status(200).json({
            message: "you can start the trip"
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.startDeliveryGoodsController = startDeliveryGoodsController;
// driver deliver by contact of customer
const contactDeliveryGoodsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = req.driver;
        const driverId = driver.id;
        let { deliveryId } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const checkDriver = yield reg_model_1.default.findOne({ _id: driverId });
        if (!checkDriver) {
            return res
                .status(401)
                .json({ message: "invalid driver" });
        }
        const deliveryGoods = yield deliver_model_1.default.findOne({ _id: deliveryId, deliveredStatus: 'startTrip' });
        if (!deliveryGoods) {
            return res
                .status(401)
                .json({ message: "initiate delivering" });
        }
        deliveryGoods.deliveredStatus = 'delivered';
        yield deliveryGoods.save();
        return res.status(200).json({
            message: "item delivered  successfully, wating for comfirmation from customer"
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.contactDeliveryGoodsController = contactDeliveryGoodsController;
// driver deliver by contactless of customer
const contactlessDeliveryGoodsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = req.driver;
        const driverId = driver.id;
        let { deliveryId } = req.body;
        const file = req.file;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const checkDriver = yield reg_model_1.default.findOne({ _id: driverId });
        if (!checkDriver) {
            return res
                .status(401)
                .json({ message: "invalid driver" });
        }
        const deliveryGoods = yield deliver_model_1.default.findOne({ _id: deliveryId, deliveredStatus: 'startTrip' });
        if (!deliveryGoods) {
            return res
                .status(401)
                .json({ message: "initiate delivering" });
        }
        let deliveredImg;
        if (!file) {
            return res.status(401).json({ message: "provide image for proof." });
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            deliveredImg = result === null || result === void 0 ? void 0 : result.Location;
        }
        deliveryGoods.deliveredStatus = 'delivered';
        deliveryGoods.deliveredImage = deliveredImg;
        yield deliveryGoods.save();
        return res.status(200).json({
            message: "item delivered  successfully, waiting for comfirmation from customer"
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.contactlessDeliveryGoodsController = contactlessDeliveryGoodsController;
// customer comfirm delivery
const customercomfirmDeliveryGoodsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { deliveryId } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const deliveryGoods = yield deliver_model_1.default.findOne({ _id: deliveryId, deliveredStatus: 'delivered' });
        if (!deliveryGoods) {
            return res
                .status(401)
                .json({ message: "initiate delivering" });
        }
        deliveryGoods.deliveredStatus = 'comfirmDelivered';
        yield deliveryGoods.save();
        return res.status(200).json({
            message: "delivery successfully comfirm"
        });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.customercomfirmDeliveryGoodsController = customercomfirmDeliveryGoodsController;
// this controller is the final stage of the medication deluvery to the patient
// and marks the medication as delivered for that particular patient
const initiateMedicationDeliveryToPatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get riders details from request..
        const driver = req.driver;
        const driverId = driver.id;
        // get medication details from request body...
        const medication_id = req.params.medication_id;
        const { amount, address } = req.body;
        const medication = yield medication_model_1.default.findById(medication_id);
        if (!medication) {
            return res.status(404).json({ message: "sorry, medication not found" });
        }
        // const patient_id = medication.userId;
        const patient = yield userReg_model_1.default.findById(medication.userId);
        if (!patient) {
            return res.status(404).json({ message: "sorry, patient for the medication was not found" });
        }
        // get doctor from medication...
        const doctor_id = medication.doctor;
        const doctor = yield doctor_reg_modal_1.default.findById(doctor_id);
        if (!doctor) {
            return res.status(404).json({ message: "couldnt find the prescriber doctor" });
        }
        // set delivery status as intiatated...
        const delivery_status = "initiate";
        // create a new delivery pobject and stor on the database..
        const newDelivery = new medication_delivery_model_1.default({
            patient: patient._id,
            medicationId: medication_id,
            amount,
            address,
            driverId,
            deliveredStatus: delivery_status,
            prescriber: doctor,
        });
        yield newDelivery.save();
        res.status(201).json({ message: "you initiated medication delivery!", medication, patient });
    }
    catch (error) {
        res.status(500).json({ message: "error initiating delivery for medication" });
    }
});
exports.initiateMedicationDeliveryToPatient = initiateMedicationDeliveryToPatient;
const markMedicationAsDelivered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const driver = req.driver;
        const driverId = driver.id;
        // confirm if the driver owns the delivery record..
        const medication_delivery_id = req.params.deliver_id;
        const medication_delivery = yield medication_delivery_model_1.default.findOne({ _id: medication_delivery_id, driverId });
        if (!medication_delivery) {
            return res.status(404).json({ message: "sorry no such driver or delivery record found" });
        }
        ;
        medication_delivery.deliveryStatus = 'delivered';
        yield medication_delivery.save();
        res.status(200).json({ message: "delivery successfully marked as delivered, awaiting patient confirmation" });
    }
    catch (error) {
        res.status(500).json({ message: "error marking medication as delivered" });
    }
});
exports.markMedicationAsDelivered = markMedicationAsDelivered;
/*
this controller will finalize the medication delivery process
and credit the prescriber (doctor) 5% from the total medication amount..
 */
const confirmMedicationAsDelivered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const medication_delivery_id = req.params.deliver_id;
        const medication_delivery = yield medication_delivery_model_1.default.findOne({ _id: medication_delivery_id, deliveryStatus: "delivered" });
        if (!medication_delivery) {
            return res.status(404).json({ message: "sorry this medication has not be delivered yet" });
        }
        ;
        medication_delivery.deliveryStatus = "confirmDelivered";
        yield medication_delivery.save();
        // const medication_price:Number = medication_delivery.amount;
        // doctors cut percentage is only 5% of medication price...
        const doctor_percentage = Number(medication_delivery.amount) * 0.05;
        const doctor_id = medication_delivery.prescriber;
        const doctor = yield doctor_reg_modal_1.default.findById(doctor_id);
        const doctor_wallet = yield doctorWallet_model_1.default.findOne({ doctorId: doctor_id });
        if (!doctor_wallet) {
            const newWallet = new doctorWallet_model_1.default({
                doctorId: doctor_id,
                amount: doctor_percentage
            });
            yield newWallet.save();
        }
        else {
            doctor_wallet.amount = doctor_wallet.amount + doctor_percentage;
            yield doctor_wallet.save();
        }
        res.status(200).json({ message: "medication deliverey confirmed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "error confirming delivery..." });
    }
});
exports.confirmMedicationAsDelivered = confirmMedicationAsDelivered;
