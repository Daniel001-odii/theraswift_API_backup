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
exports.markPharmacyRequestAsSolved = exports.replyPharmacyRequestById = exports.getPharmacyRequestsForDoctor = exports.getAllSentRequest = exports.sendPharmacyRequest = void 0;
const pharmacyRequests_model_1 = __importDefault(require("../models/pharmacyRequests.model"));
const doctor_reg_modal_1 = __importDefault(require("../../doctor/modal/doctor_reg.modal"));
// create a pharmacy requet...
const sendPharmacyRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { request_type, description, medication, } = req.body;
        const doctor_id = req.params.doctor_id;
        if (!doctor_id) {
            return res.status(400).json({ message: "please provide a doctor ID in req params" });
        }
        const doctor = yield doctor_reg_modal_1.default.findById(doctor_id);
        if (!doctor) {
            return res.status(404).json({ message: "invalid doctor Id provided" });
        }
        ;
        const pharmacy_request = new pharmacyRequests_model_1.default({
            time: Date.now(),
            sender: req.admin.id,
            request_type,
            description,
            medication,
            doctor: doctor_id
        });
        yield pharmacy_request.save();
        res.status(201).json({ message: `request for the medication: ${medication} sent successfully!` });
    }
    catch (error) {
        console.log("error sending doctor request: ", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.sendPharmacyRequest = sendPharmacyRequest;
// get all sent pharm requests for a logged i pharmacy/admin
const getAllSentRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pharmacy_requests = yield pharmacyRequests_model_1.default.find({ sender: req.admin.id }).populate("doctor");
        res.status(200).json({ pharmacy_requests });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.getAllSentRequest = getAllSentRequest;
// get all requests for a doctor...
const getPharmacyRequestsForDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const doctor = req.doctor._id;
        // console.log("requesting doctor: ", req.doctor)
        // if(!doctor){
        //     return res.status(400).json({ message: "please provide a doctor ID in requests params"})
        // }
        const pharmacy_requests = yield pharmacyRequests_model_1.default.find({ doctor });
        res.status(200).json({ pharmacy_requests });
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.getPharmacyRequestsForDoctor = getPharmacyRequestsForDoctor;
// reply a sent requst...
const replyPharmacyRequestById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request_id = req.params.request_id;
        const { user, text } = req.body;
        if (!request_id) {
            return res.status(400).json({ message: "please provide a valid pharmacy request id in url params" });
        }
        const pharm_request = yield pharmacyRequests_model_1.default.findById(request_id);
        if (!pharm_request) {
            return res.status(404).json({ message: "pharmacy request not found" });
        }
        pharm_request.replies.push(user, text);
        yield pharm_request.save();
        if (pharm_request.replies.length <= 1) {
            return res.status(201).json({ message: "reply sent successfully" });
        }
        else {
            return res.status(200).json({ message: "new reply added to reply thread successfully" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "internal server error" });
    }
});
exports.replyPharmacyRequestById = replyPharmacyRequestById;
// mark a request as resolved after clarification from doctor...
const markPharmacyRequestAsSolved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request_id = req.params.request_id;
        if (!request_id) {
            return res.status(400).json({ message: "pharmacy request ID missing in URL params" });
        }
        const pharmacy_request = yield pharmacyRequests_model_1.default.findById(request_id);
        if (!pharmacy_request) {
            return res.status(404).json({ message: "the requested pharmacy request was not found" });
        }
        pharmacy_request.status = "resolved";
        yield pharmacy_request.save();
        res.status(200).json({ message: "request marked as resolved successfully!" });
    }
    catch (error) {
        res.status(500).json({ message: "could not mark request as solved" });
    }
});
exports.markPharmacyRequestAsSolved = markPharmacyRequestAsSolved;
