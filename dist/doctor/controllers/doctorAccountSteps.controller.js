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
exports.doctorVerifyProfileDetails = void 0;
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
//Verify Profile Details /////////////
const doctorVerifyProfileDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { verifyAccountProfile } = req.body;
        if (typeof verifyAccountProfile !== "boolean") {
            return res.status(400).json({ message: "Invalid request body (verifyAccountProfile should be a boolean)" });
        }
        const doctor = yield doctor_reg_modal_1.default.findOne({ _id: req.doctor._id });
        if (doctor) {
            doctor.completedAccountSteps.step1.verifiedProfileDetails = verifyAccountProfile;
            yield doctor.save();
        }
        return res.json({
            message: "Doctor Profile Detailed Verified"
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.doctorVerifyProfileDetails = doctorVerifyProfileDetails;
