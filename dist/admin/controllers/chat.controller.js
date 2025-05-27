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
exports.sendChatToRoom = exports.getChatsInRoom = exports.getChatRooms = exports.createChatRoom = void 0;
const chatRoom_model_1 = __importDefault(require("../models/chatRoom.model"));
const chatRoom_model_2 = __importDefault(require("../../doctor/modal/chatRoom.model"));
const chat_model_1 = __importDefault(require("../models/chat.model"));
const chatSocket_1 = require("../../utils/chatSocket");
const doctor_reg_modal_1 = __importDefault(require("../../doctor/modal/doctor_reg.modal"));
const admin_reg_model_1 = __importDefault(require("../../admin/models/admin_reg.model"));
// CREATE A CHAT ROOM BETWEEN PHARM AND DOCTOR
const createChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, pharm_id, doctor_id } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'room name is required' });
        }
        if (!pharm_id) {
            return res.status(400).json({ error: 'pharmacy id is required' });
        }
        if (!doctor_id) {
            return res.status(400).json({ error: 'doctor id is required' });
        }
        // Check if the room already exists
        const existingRoom = yield chatRoom_model_1.default.findOne({ name, pharm: pharm_id, doctor: doctor_id });
        if (existingRoom) {
            return res.status(400).json({ error: 'room already exists' });
        }
        // Create a new room and store references to the user and employer
        const room = new chatRoom_model_1.default({ name, pharm: pharm_id, doctor: doctor_id });
        yield room.save();
        res.status(201).json({ room });
        console.log("new message room created");
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to create chat room', error });
        console.log("error creating rooom: ", error);
    }
});
exports.createChatRoom = createChatRoom;
// GET ALL CHATS ROOMS FOR A USER >>>
const getChatRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const user_id = req.params.user_id;
        const user_id = req.admin.id;
        console.log("from request: ", req.admin);
        // const user = req.user;
        // console.log("user in request payload: ", user.email)
        if (!user_id) {
            return res.status(400).json({ message: "user_id is missing in url params" });
        }
        const pharm = yield admin_reg_model_1.default.findById(user_id);
        const doctor = yield doctor_reg_modal_1.default.findById(user_id);
        console.log("..", pharm, doctor);
        if (!pharm && !doctor) {
            return res.status(404).json({ message: "user not found" });
        }
        if (pharm) {
            const rooms = yield chatRoom_model_1.default.find({ pharm }).populate({
                path: "doctor",
                select: "firstName lastName email phoneNumber title organization speciality"
            });
            return res.status(200).json({ rooms });
        }
        if (doctor) {
            const rooms = yield chatRoom_model_1.default.find({ doctor }).populate({
                path: "pharm",
                select: "firstName lastName email phoneNumber"
            });
            return res.status(200).json({ rooms });
        }
    }
    catch (error) {
        res.status(500).json({ error: 'unable to fetch rooms' });
        console.log('error getting user rooms: ', error);
    }
});
exports.getChatRooms = getChatRooms;
// GET MESSAGES IN A PARTICULAR ROOM >>>
const getChatsInRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room_id = req.params.room_id;
        const messages = yield chat_model_1.default.find({ room: room_id });
        res.status(200).json({ messages });
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to fetch messages from room' });
        console.log("error getting messages for room: ", error);
    }
});
exports.getChatsInRoom = getChatsInRoom;
// SEND MESSAGE CONTROLLER >>>
const sendChatToRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.admin.id;
        const roomId = req.params.room_id;
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "please input a message text!" });
        }
        const room = (yield chatRoom_model_1.default.findById(roomId)) || (yield chatRoom_model_2.default.findById(roomId));
        if (!room) {
            return res.status(400).json({ message: "chat not sent, room not found" });
        }
        const today = Date.now();
        // Create a new message
        const message = yield chat_model_1.default.create({ text, user: userId, room: roomId });
        const message_sender = yield admin_reg_model_1.default.findById(userId);
        room.updatedAt = today;
        room.last_message.sender_name = `${message_sender === null || message_sender === void 0 ? void 0 : message_sender.firstName} ${message_sender === null || message_sender === void 0 ? void 0 : message_sender.lastName}`;
        room.last_message.text = text;
        console.log("room date updated!!!");
        yield room.save();
        const io = (0, chatSocket_1.getIo)();
        // Emit the message to the room using Socket.io
        io.to(roomId).emit('message', message);
        console.log("msg sent to room: ", roomId, text);
        res.status(201).json({ message });
    }
    catch (error) {
        console.error('Error sending message:', error); // Log the error
        res.status(500).json({ error: 'Unable to send message' });
    }
});
exports.sendChatToRoom = sendChatToRoom;
