"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const RequestSchema = new mongoose_1.default.Schema({
    sender: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'AdminReg',
    },
    time: {
        type: Date,
    },
    request_type: {
        type: String,
        enum: ["HMO", "PRC", "THS"],
        required: [true, "please provide a request type (HMO, PRC or THS)"]
    },
    description: {
        type: String,
        required: true,
    },
    medication: String,
    /*  user:{
         type: mongoose.Schema.Types.ObjectId,
         ref: 'UserReg',
         required: true,
     }, */
    doctor: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'DoctorReg',
        required: true,
    },
    replies: [{
            user: String,
            text: String,
            time: {
                type: Date,
                default: Date.now,
            }
        }],
    status: {
        type: String,
        enum: ["resolved", 'unresolved'],
        default: "unresolved",
    },
}, { timestamps: true });
const pharmacyRequestModel = mongoose_1.default.model('pharmRequests', RequestSchema);
exports.default = pharmacyRequestModel;
