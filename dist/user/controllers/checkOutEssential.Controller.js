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
exports.userCheckOutEssentialPRoductController = void 0;
const express_validator_1 = require("express-validator");
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const order_model_1 = __importDefault(require("../../admin/models/order.model"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const ensentialCart_model_1 = __importDefault(require("../models/ensentialCart.model"));
const essentialProduct_model_1 = __importDefault(require("../../admin/models/essentialProduct.model"));
//user checkout  essential Product/////////////
const userCheckOutEssentialPRoductController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { deliveryDate, firstName, lastName, dateOfBirth, gender, address, } = req.body;
        const file = req.file;
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
        const carts = yield ensentialCart_model_1.default.find({ userId });
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
            const product = yield essentialProduct_model_1.default.findOne({ _id: cart.productId });
            // const userMedication = await UserMedicationModel.findOne({_id: cart.userMedicationId, userId})
            if (product) {
                // if (medication.prescriptionRequired == "required" && userMedication.prescriptionStatus == false) {  
                //     continue;
                // }
                totalCost = totalCost + (cart.quantityrquired * parseInt(product.price));
                const productObt = {
                    productId: product._id,
                    name: product.name,
                    quantity: product.quantity,
                    price: product.price.toString(),
                    orderQuantity: cart.quantityrquired.toString(),
                    refill: cart.refill,
                };
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
            const order = new order_model_1.default({
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
            });
            yield order.save();
            userExist.refererCredit = refererCredit - totalCost;
            userExist.reference = "referer credit";
            yield userExist.save();
            return res.status(200).json({
                message: "payment successfully using referer credit",
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
            medications: productArray,
            deliveryDate: deliveryDate,
            refererBunousUsed: refCre,
            totalAmount: totalCost,
        };
        const paystackSecretKey = 'sk_test_b27336978f0f77d84915d7e883b0f756f6d150e7';
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
                metadata
            }),
        });
        const data = yield response.json();
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
        const order = new order_model_1.default({
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
        });
        const savedOrdered = yield order.save();
        userExist.refererCredit = 0;
        userExist.reference = data.data.reference;
        yield userExist.save();
        return res.status(200).json({
            message: "payment successfully initialize",
            url: data.data.authorization_url,
            reference: data.data.reference,
            orderId: savedOrdered._id
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userCheckOutEssentialPRoductController = userCheckOutEssentialPRoductController;
