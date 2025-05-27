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
exports.userCheckOutFromAvailableMedController = exports.userGetDeliveredOrderController = exports.userGetNotDeliveredOrderController = exports.userGetPendingOrderController = exports.userCheckOutPaymentVerificationController = exports.userCheckOutController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const medication_model_1 = __importDefault(require("../../admin/models/medication.model"));
const order_model_1 = __importDefault(require("../../admin/models/order.model"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const essentialProduct_model_1 = __importDefault(require("../../admin/models/essentialProduct.model"));
//user checkout /////////////
const userCheckOutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deliveryDate, firstName, lastName, dateOfBirth, gender, address, others, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const carts = yield cart_model_1.default.find({ userId });
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
                const medication = yield medication_model_1.default.findOne({ _id: cart.medicationId });
                // const userMedication = await UserMedicationModel.findOne({_id: cart.userMedicationId, userId})
                if (medication) {
                    // if (medication.prescriptionRequired == "required" && userMedication.prescriptionStatus == false) {  
                    //     continue;
                    // }
                    totalCost = totalCost + (cart.quantityrquired * medication.price);
                    const medicationObt = {
                        medication: medication,
                        orderQuantity: cart.quantityrquired,
                        refill: cart.refill,
                    };
                    medArray.push(medicationObt);
                }
            }
            else {
                const essentialProdut = yield essentialProduct_model_1.default.findOne({ _id: cart.productId });
                if (!essentialProdut) {
                    continue;
                }
                totalCost = totalCost + (cart.quantityrquired * parseFloat(essentialProdut.price));
                const productObt = {
                    product: essentialProdut,
                    orderQuantity: cart.quantityrquired,
                    refill: cart.refill,
                };
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
            const order = new order_model_1.default({
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
            });
            const me = yield order.save();
            userExist.refererCredit = refererCredit - totalCost;
            userExist.reference = "referer credit";
            yield userExist.save();
            for (let i = 0; i < carts.length; i++) {
                const cart = carts[i];
                const deletedCart = yield cart_model_1.default.findOneAndDelete({ _id: cart._id, userId: userId }, { new: true });
                if (!deletedCart)
                    continue;
            }
            return res.status(200).json({
                message: "payment successfully using referer credit",
                url: "",
                reference: "",
                orderId: ""
            });
        }
        let refCre = 0;
        if (refererCredit > 0) {
            refCre = refererCredit;
        }
        else {
            refCre = 0;
        }
        const amount = totalCost - refCre;
        const metadata = {
            userId,
            medications: medArray,
            deliveryDate: deliveryDate,
            refererBunousUsed: refCre,
            totalAmount: totalCost,
        };
        const paystackSecretKey = process.env.PAYSTACK_KEY;
        const currentDate = new Date();
        const milliseconds = currentDate.getMilliseconds();
        const response = yield (0, node_fetch_1.default)('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount * 100,
                email: userExist.email,
                reference: milliseconds,
                metadata,
                callback_url: "https://app.theraswift.co/checkout/verify"
            }),
        });
        const data = yield response.json();
        if (!data.status) {
            console.log("pment :", data);
            return res
                .status(401)
                .json({ message: "unable to initailize payment" });
        }
        let orderId = milliseconds.toString().substring(milliseconds.toString().length - 5);
        const order = new order_model_1.default({
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
        });
        const savedOrdered = yield order.save();
        userExist.refererCredit = 0;
        userExist.reference = data.data.reference;
        yield userExist.save();
        for (let i = 0; i < carts.length; i++) {
            const cart = carts[i];
            const deletedCart = yield cart_model_1.default.findOneAndDelete({ _id: cart._id, userId: userId }, { new: true });
            if (!deletedCart)
                continue;
        }
        return res.status(200).json({
            message: "payment successfully initialize",
            url: data.data.authorization_url,
            reference: data.data.reference,
            //orderId: savedOrdered._id
        });
    }
    catch (err) {
        // signup error
        console.log("error", err);
        res.status(500).json({ message: err.message });
    }
});
exports.userCheckOutController = userCheckOutController;
//user payment verification /////////////
const userCheckOutPaymentVerificationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reference,
        // orderId,
         } = req.body;
        const paystackSecretKey = process.env.PAYSTACK_KEY;
        const response = yield (0, node_fetch_1.default)(`https://api.paystack.co/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
            },
        });
        const data = yield response.json();
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
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
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
        const order = yield order_model_1.default.findOneAndUpdate({ paymentId: reference, userId: userId, deliveredStatus: "pending" }, { deliveredStatus: "not delivered" }, { new: true });
        if (!order) {
            return res
                .status(401)
                .json({ message: "order not fund" });
        }
        return res.status(200).json({
            message: "transaction verified successfully",
            order
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userCheckOutPaymentVerificationController = userCheckOutPaymentVerificationController;
//user pending order /////////////
const userGetPendingOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const pendingOrder = yield order_model_1.default.find({ userId, deliveredStatus: "pending" });
        return res.status(200).json({
            pendingOrder
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userGetPendingOrderController = userGetPendingOrderController;
//user not delivered order /////////////
const userGetNotDeliveredOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const notDeliveredOrder = yield order_model_1.default.find({ userId, deliveredStatus: "not delivered" });
        return res.status(200).json({
            notDeliveredOrder
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userGetNotDeliveredOrderController = userGetNotDeliveredOrderController;
//user delivered order /////////////
const userGetDeliveredOrderController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
        if (!userExist) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        const deliveredOrder = yield order_model_1.default.find({ userId, deliveredStatus: "delivered" });
        return res.status(200).json({
            deliveredOrder
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userGetDeliveredOrderController = userGetDeliveredOrderController;
//user checkout from list of medication /////////////
const userCheckOutFromAvailableMedController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deliveryDate, firstName, lastName, dateOfBirth, gender, address, others, medicationId, type, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = req.user;
        const userId = user.id;
        //get user info from databas
        const userExist = yield userReg_model_1.default.findOne({ _id: userId });
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
            const medication = yield medication_model_1.default.findOne({ _id: medicationId });
            if (!medication) {
                return res
                    .status(401)
                    .json({ message: "can not find this medication" });
            }
            totalCost = totalCost + medication.price;
            const medicationObt = {
                medication: medication,
                orderQuantity: 1,
                refill: 'non',
            };
            medArray.push(medicationObt);
        }
        else {
            const essentialProdut = yield essentialProduct_model_1.default.findOne({ _id: medicationId });
            if (!essentialProdut) {
                return res
                    .status(401)
                    .json({ message: "can not find this product" });
            }
            totalCost = totalCost + parseFloat(essentialProdut.price);
            const productObt = {
                product: essentialProdut,
                orderQuantity: 1,
                refill: 'non',
            };
            essentialProductarray.push(productObt);
        }
        if (refererCredit >= totalCost) {
            const currentDate = new Date();
            const milliseconds = currentDate.getMilliseconds();
            let orderId = milliseconds.toString().substring(milliseconds.toString().length - 5);
            const order = new order_model_1.default({
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
            });
            const me = yield order.save();
            userExist.refererCredit = refererCredit - totalCost;
            userExist.reference = "referer credit";
            yield userExist.save();
            return res.status(200).json({
                message: "payment successfully using referer credit",
                url: "",
                reference: "",
                orderId: ""
            });
        }
        let refCre = 0;
        if (refererCredit > 0) {
            refCre = refererCredit;
        }
        else {
            refCre = 0;
        }
        const amount = totalCost - refCre;
        const metadata = {
            userId,
            medications: medArray,
            deliveryDate: deliveryDate,
            refererBunousUsed: refCre,
            totalAmount: totalCost,
        };
        const paystackSecretKey = process.env.PAYSTACK_KEY;
        const currentDate = new Date();
        const milliseconds = currentDate.getMilliseconds();
        const response = yield (0, node_fetch_1.default)('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${paystackSecretKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: amount * 100,
                email: userExist.email,
                reference: milliseconds,
                metadata,
                callback_url: "https://app.theraswift.co/checkout/verify"
            }),
        });
        const data = yield response.json();
        if (!data.status) {
            return res
                .status(401)
                .json({ message: "unable to initailize payment" });
        }
        let orderId = milliseconds.toString().substring(milliseconds.toString().length - 5);
        const order = new order_model_1.default({
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
        });
        const savedOrdered = yield order.save();
        userExist.refererCredit = 0;
        userExist.reference = data.data.reference;
        yield userExist.save();
        return res.status(200).json({
            message: "payment successfully initialize",
            url: data.data.authorization_url,
            reference: data.data.reference,
            //orderId: savedOrdered._id
        });
    }
    catch (err) {
        // signup error
        console.log("error", err);
        res.status(500).json({ message: err.message });
    }
});
exports.userCheckOutFromAvailableMedController = userCheckOutFromAvailableMedController;
