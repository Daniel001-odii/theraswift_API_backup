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
exports.userGetHmoController = exports.userAddHmoController = exports.userGetAddressController = exports.userAddAddressController = exports.userGetMemberController = exports.userRegistMemberController = exports.userdetailController = exports.userMobileNumberSignInController = exports.userEmailSignInController = exports.userSignUpController = exports.userCheckStateController = exports.userCheckEmailController = void 0;
const express_validator_1 = require("express-validator");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userReg_model_1 = __importDefault(require("../models/userReg.model"));
const mobilNumberFormatter_1 = require("../../utils/mobilNumberFormatter");
const code_model_1 = __importDefault(require("../models/code.model"));
const familyMember_model_1 = __importDefault(require("../models/familyMember.model"));
const address_model_1 = __importDefault(require("../models/address.model"));
const hmo_model_1 = __importDefault(require("../models/hmo.model"));
const aws3_utility_1 = require("../../utils/aws3.utility");
const uuid_1 = require("uuid");
const otpGenerator_1 = require("../../utils/otpGenerator");
const send_email_utility_1 = require("../../utils/send_email_utility");
//user check email/////////////
const userCheckEmailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const userEmailExists = yield userReg_model_1.default.findOne({ email });
        // check if user exists
        if (!userEmailExists) {
            return res
                .status(401)
                .json({ message: "Email do not exists" });
        }
        res.json({
            message: "Email already exist",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userCheckEmailController = userCheckEmailController;
//user check state/////////////
const userCheckStateController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { address, state } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        res.json({
            message: "deliver location successfully saved",
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userCheckStateController = userCheckStateController;
// "email"
//user signup /////////////
const userSignUpController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, firstName, dateOfBirth, lastName, mobileNumber, gender, refererCode, operatingLocation, address, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        // try find user with the same email
        const userEmailExists = yield userReg_model_1.default.findOne({ email });
        const userNumberExists = yield userReg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (userEmailExists || userNumberExists) {
            return res
                .status(401)
                .json({ message: "Email or Mobile Number exists already" });
        }
        // give referer his reward
        if (refererCode) {
            const referer = yield userReg_model_1.default.findOne({ refererCode });
            if (referer) {
                referer.refererCredit = referer.refererCredit + 500;
                referer.save();
            }
        }
        const storeedCode = yield code_model_1.default.find();
        if (storeedCode.length < 1) {
            const firstCode = new code_model_1.default({ code: 1000 });
            yield firstCode.save();
        }
        const codestored = yield code_model_1.default.find();
        const { code, _id } = codestored[0];
        const newUserRefererCode = (code + 1).toString();
        // update the code generator
        yield code_model_1.default.findOneAndUpdate({ _id }, { code: parseInt(newUserRefererCode) }, { new: true });
        // Hash password
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const userId = mobileNumber.substring(1);
        const user = new userReg_model_1.default({
            email: email,
            userId: userId,
            firstName: firstName,
            dateOfBirth: dateOfBirth,
            lastName: lastName,
            password: hashedPassword,
            mobileNumber: phonenumber,
            gender: gender,
            refererCode: newUserRefererCode,
            refererCredit: 500,
            operatingLocation: operatingLocation,
            address
        });
        // SEND VERIFICATION EMAIL AT ONCE >>>
        const otp = (0, otpGenerator_1.generateOTP)();
        const createdTime = new Date();
        user.emailOtp = {
            otp,
            createdTime,
            verified: false
        };
        let emailData = {
            emailTo: email,
            subject: "Theraswift email verification",
            otp,
            firstName: user.firstName,
        };
        (0, send_email_utility_1.sendUserAccountVerificationEmail)(emailData);
        // //////////
        let userSaved = yield user.save();
        res.json({
            message: "Signup successful, check for verifcation code in email",
            user: {
                id: userSaved._id,
                userId: userSaved.userId,
                firstName: userSaved.firstName,
                lastName: userSaved.lastName,
                email: userSaved.email,
                gender: userSaved.gender,
                mobileNumber: userSaved.mobileNumber,
                refererCode: userSaved.refererCode,
                refererCredit: userSaved.refererCredit,
                address: userSaved.address,
                state: userSaved.operatingLocation
            },
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userSignUpController = userSignUpController;
//user signin  with email/////////////
const userEmailSignInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // try find user with the same email
        const user = yield userReg_model_1.default.findOne({ email });
        // check if user exists
        if (!user) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "incorrect credential." });
        }
        if (!user.emailOtp.verified) {
            return res.status(401).json({ message: "email not verified." });
        }
        if (user.isDeleted) {
            return res.status(401).json({ message: "user account is deleted" });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            id: user === null || user === void 0 ? void 0 : user._id,
            email: user.email,
            mobileNumber: user.mobileNumber,
        }, process.env.JWT_User_SECRET_KEY);
        // return access token
        res.json({
            message: "Login successful",
            Token: accessToken
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userEmailSignInController = userEmailSignInController;
//user signin  with mobile number/////////////
const userMobileNumberSignInController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { mobileNumber, password, } = req.body;
        // Check for validation errors
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // format mobile number to international format
        let phonenumber = (0, mobilNumberFormatter_1.modifiedPhoneNumber)(mobileNumber);
        // try find user with the same email
        const user = yield userReg_model_1.default.findOne({ mobileNumber: phonenumber });
        // check if user exists
        if (!user) {
            return res
                .status(401)
                .json({ message: "invalid credential" });
        }
        ;
        if (user.isDeleted) {
            return res.status(401).json({ message: "user account is deleted" });
        }
        // compare password with hashed password in database
        const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: "incorrect credential." });
        }
        if (!user.phoneNumberOtp.verified) {
            return res.status(401).json({ message: "mobile number not verified." });
        }
        // generate access token
        const accessToken = jsonwebtoken_1.default.sign({
            id: user === null || user === void 0 ? void 0 : user._id,
            email: user.email,
            mobileNumber: user.mobileNumber,
        }, process.env.JWT_User_SECRET_KEY);
        // return access token
        res.json({
            message: "Login successful",
            Token: accessToken
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userMobileNumberSignInController = userMobileNumberSignInController;
//get login user deatial/////////////
const userdetailController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
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
        res.json({
            user: {
                id: userExist._id,
                userId: userExist.userId,
                email: userExist.email,
                mobileNumber: userExist.mobileNumber,
                firstName: userExist.firstName,
                lastName: userExist.lastName,
                dateOfbirth: userExist.dateOfBirth,
                gender: userExist.gender,
                refererCode: userExist.refererCode,
                referereCredit: userExist.refererCredit,
                reference: userExist.reference,
                operatingLocation: userExist.operatingLocation
            }
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userdetailController = userdetailController;
//user register his family member /////////////
const userRegistMemberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, dateOfBirth, lastName, gender, } = req.body;
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
        const newFamily = new familyMember_model_1.default({
            userId: userId,
            firstName: firstName,
            lastName: lastName,
            dateOfBirth: dateOfBirth,
            gender: gender
        });
        const saveFamily = yield newFamily.save();
        res.json({
            saveFamily
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userRegistMemberController = userRegistMemberController;
//user get his family member detail /////////////
const userGetMemberController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
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
        const families = yield familyMember_model_1.default.find({ userId: userId });
        res.json({
            families
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userGetMemberController = userGetMemberController;
//user Add new addresss /////////////
const userAddAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { streetAddress, streetNO, LGA, DeliveryInstruction, doorMan, handDeliver, state } = req.body;
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
        const newAddress = new address_model_1.default({
            userId: userId,
            streetAddress: streetAddress,
            streetNO: streetNO,
            LGA: LGA,
            DeliveryInstruction: DeliveryInstruction,
            doorMan,
            handDeliver,
            state
        });
        const savedAddress = yield newAddress.save();
        res.json({
            savedAddress
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userAddAddressController = userAddAddressController;
//user get his addressses /////////////
const userGetAddressController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
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
        const addresses = yield address_model_1.default.find({ userId: userId });
        res.json({
            addresses
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userGetAddressController = userGetAddressController;
//user Add hmo /////////////
const userAddHmoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { enrolNumber, EnrolName, provider, } = req.body;
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
        let hmoImg;
        if (!file) {
            hmoImg = "";
        }
        else {
            const filename = (0, uuid_1.v4)();
            const result = yield (0, aws3_utility_1.uploadToS3)(req.file.buffer, `${filename}.jpg`);
            hmoImg = result === null || result === void 0 ? void 0 : result.Location;
        }
        let enrolNumberDb = "";
        let enrolNameDb = "";
        let providerDb = "";
        if (EnrolName != "") {
            enrolNameDb = EnrolName;
        }
        if (enrolNumber != "") {
            enrolNumberDb = enrolNumber;
        }
        if (provider != "") {
            providerDb = provider;
        }
        const newHmo = new hmo_model_1.default({
            userId: userId,
            hmoImage: hmoImg,
            enrolName: enrolNameDb,
            enrolNumber: enrolNumberDb,
            provider: providerDb
        });
        const savedHmo = yield newHmo.save();
        res.json({
            savedHmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userAddHmoController = userAddHmoController;
//user get hmo detail/////////////
const userGetHmoController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const {} = req.body;
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
        const hmo = yield hmo_model_1.default.find({ userId: userId });
        res.json({
            hmo
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.userGetHmoController = userGetHmoController;
