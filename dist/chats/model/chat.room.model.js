"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "room name is required to create room"]
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'ownerModel', // Dynamic reference path
    },
    ownerModel: {
        type: String,
        required: true,
        enum: ['DoctorReg', 'AdminReg', 'UserReg'] // Allowed models for `owner`
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DoctorReg',
    },
    pharmacy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AdminReg',
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserReg'
    },
    unread_messages: {
        type: Number,
        default: 0
    },
    last_message: {
        sender_name: String,
        text: String,
    },
}, { timestamps: true });
const chatRoom = mongoose.model('ChatRoom', roomSchema);
exports.default = chatRoom;
