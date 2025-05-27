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
exports.verifyDoctorById = exports.expiredMedicationController = exports.dashboardController = void 0;
const patient_reg_model_1 = __importDefault(require("../../doctor/modal/patient_reg.model"));
const doctor_reg_modal_1 = __importDefault(require("../../doctor/modal/doctor_reg.modal"));
const medication_model_1 = __importDefault(require("../models/medication.model"));
const order_model_1 = __importDefault(require("../models/order.model"));
//dashboard /////////////
const dashboardController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalPatient = yield patient_reg_model_1.default.countDocuments();
        const totalProvider = yield doctor_reg_modal_1.default.countDocuments();
        const outStock = yield medication_model_1.default.countDocuments({ quantity: { $lt: 1 } });
        const result = yield order_model_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalAmount" } // Sum the price field
                }
            }
        ]);
        // Extract the total price from the result
        const totalSales = result.length > 0 ? result[0].total : 0;
        return res.status(200).json({
            totalPatient,
            totalProvider,
            outStock,
            totalSales
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.dashboardController = dashboardController;
//expired medication /////////////
const expiredMedicationController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { page, limit } = req.query;
        page = page || 1; // Page number, default to 1
        limit = limit || 50; // Documents per page, default to 10
        const skip = (page - 1) * limit; // Calculate how many documents to skip= req.body;
        const expiredMedication = yield medication_model_1.default.find({ expiredDate: { $lt: new Date() } }).skip(skip).limit(limit);
        const expiredMedicationTotal = yield medication_model_1.default.countDocuments({ expiredDate: { $lt: new Date() } });
        return res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(expiredMedicationTotal / limit),
            expiredMedicationTotal,
            expiredMedication
        });
    }
    catch (err) {
        // signup error
        res.status(500).json({ message: err.message });
    }
});
exports.expiredMedicationController = expiredMedicationController;
// verify doctors by their ID...
const verifyDoctorById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor_id = req.params.doctor_id;
        if (!doctor_id) {
            return res.status(400).json({ message: "please provide a valid doctor Id in request param" });
        }
        const doctor = yield doctor_reg_modal_1.default.findById(doctor_id);
        if (!doctor) {
            return res.status(404).json({ message: "doctor not found!" });
        }
        ;
        if (doctor.clinicVerification.isVerified) {
            return res.status(200).json({ message: `doctor already verified`, date: doctor.clinicVerification.date });
        }
        doctor.clinicVerification.isVerified = true;
        yield doctor.save();
        res.status(201).json({ message: "doctor verified successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.verifyDoctorById = verifyDoctorById;
