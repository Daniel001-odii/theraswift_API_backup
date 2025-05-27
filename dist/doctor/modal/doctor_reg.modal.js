"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_2 = __importDefault(require("mongoose"));
const DoctorSchema = new mongoose_1.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    organization: {
        type: String,
        enum: ["clinic", "hospital", "HMO"],
        required: true,
    },
    clinicCode: {
        type: String,
        default: '',
    },
    completedAccountSteps: {
        step1: {
            verifiedProfileDetails: {
                type: Boolean,
                required: true,
                default: false
            },
            addedProviders: {
                type: Boolean,
                required: true,
                default: false
            }
        },
        step2: {
            addedHmoInfo: {
                type: Boolean,
                required: true,
                default: false
            },
            addedPaymentMethod: {
                type: Boolean,
                required: true,
                default: false
            },
            addedVideoMeetingLocation: {
                type: Boolean,
                required: true,
                default: false
            },
            setupCalender: {
                type: Boolean,
                required: true,
                default: false
            }
        },
        step3: {
            addedPatients: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    },
    requestClinicCode: {
        type: String,
        enum: ["request", "given"],
    },
    verifyClinicCode: {
        type: Boolean,
    },
    superDoctor: {
        type: Boolean,
        default: false,
    },
    addresss: {
        type: String,
        required: true,
    },
    speciality: {
        type: String,
        required: true,
    },
    regNumber: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    emailOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    phoneNumberOtp: {
        otp: String,
        createdTime: Date,
        verified: Boolean,
    },
    passwordToken: {
        type: Number
    },
    passwordChangeStatus: {
        type: Boolean
    },
    clinicVerification: {
        isVerified: Boolean,
        date: {
            type: Date,
            default: Date.now,
        }
    },
    //  followers and following...
    followers: [{
            _id: {
                type: mongoose_2.default.Schema.Types.ObjectId,
                ref: 'DoctorReg',
            },
            name: String,
        }],
    following: [{
            _id: {
                type: mongoose_2.default.Schema.Types.ObjectId,
                ref: 'DoctorReg',
            },
            name: String,
        }],
}, {
    timestamps: true,
});
const DoctotModel = (0, mongoose_1.model)("DoctorReg", DoctorSchema);
exports.default = DoctotModel;
