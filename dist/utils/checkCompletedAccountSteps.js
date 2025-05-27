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
exports.updateCompletedAccountSteps = void 0;
const doctor_reg_modal_1 = __importDefault(require("../doctor/modal/doctor_reg.modal"));
const patient_reg_model_1 = __importDefault(require("../doctor/modal/patient_reg.model"));
function updateCompletedAccountSteps(doctorId, clinicCode) {
    return __awaiter(this, void 0, void 0, function* () {
        const doctor = yield doctor_reg_modal_1.default.findById(doctorId);
        if (!doctor) {
            return null;
        }
        // Check if the doctor is a super doctor
        if (doctor.superDoctor) {
            const otherDoctors = yield doctor_reg_modal_1.default.find({ clinicCode });
            doctor.completedAccountSteps.step1.addedProviders = otherDoctors.length > 1;
        }
        // Check if there are patients associated with this doctor
        const patients = yield patient_reg_model_1.default.find({ doctorId: doctorId });
        doctor.completedAccountSteps.step3.addedPatients = patients.length > 0;
        yield doctor.save();
        return doctor;
    });
}
exports.updateCompletedAccountSteps = updateCompletedAccountSteps;
