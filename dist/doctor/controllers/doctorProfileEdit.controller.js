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
exports.editDoctorProfile = void 0;
const doctor_reg_modal_1 = __importDefault(require("../modal/doctor_reg.modal"));
const editDoctorProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor_id = req.doctor._id;
        const doctor = yield doctor_reg_modal_1.default.findById(doctor_id);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        const { firstName, lastName, phoneNumber, title, organization, addresss } = req.body;
        Object.assign(doctor, {
            firstName: firstName || doctor.firstName,
            lastName: lastName || doctor.lastName,
            phoneNumber: phoneNumber || doctor.phoneNumber,
            title: title || doctor.title,
            organization: organization || doctor.organization,
            addresss: addresss || doctor.addresss,
        });
        //Editting Profile Details Is Basically Verifying It
        // doctor.completedActionSteps.step1.verifiedProfileDetails = true;
        doctor.completedAccountSteps.step1.verifiedProfileDetails = true;
        yield doctor.save();
        res.status(200).json({ message: "Profile updated successfully!" });
    }
    catch (error) {
        console.log("Error editing doctor profile: ", error);
        res.status(500).json({ message: "Couldn't update profile", error: error.message });
    }
});
exports.editDoctorProfile = editDoctorProfile;
