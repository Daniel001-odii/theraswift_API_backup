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
const chat_room_model_1 = __importDefault(require("../model/chat.room.model"));
const chat_model_1 = __importDefault(require("../model/chat.model"));
const chatSocket_1 = require("../../utils/chatSocket");
const doctor_reg_modal_1 = __importDefault(require("../../doctor/modal/doctor_reg.modal"));
const admin_reg_model_1 = __importDefault(require("../../admin/models/admin_reg.model"));
const userReg_model_1 = __importDefault(require("../../user/models/userReg.model"));
// chats here can be between
// doctors and fellow doctors..
// doctors and pharmacies...
// pharmacies and patients...
const createChatRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { name, doctor, pharmacy, patient } = req.body;
        const doctor_id = ((_a = req.doctor) === null || _a === void 0 ? void 0 : _a._id) || null;
        const admin_id = ((_b = req.admin) === null || _b === void 0 ? void 0 : _b.id) || null;
        const patient_id = ((_c = req.user) === null || _c === void 0 ? void 0 : _c.id) || null;
        if (!name) {
            return res.status(400).json({ error: 'Room name is required' });
        }
        if (!doctor && !pharmacy && !patient) {
            return res.status(400).json({ error: 'A doctor, pharmacy, or patient is required to create a chat room' });
        }
        let new_chat_room;
        let owner, ownerModel;
        // check if room is already exisiting...
        const existingRoom = yield chat_room_model_1.default.findOne({
            name,
            owner: doctor_id || admin_id || patient_id,
            doctor: doctor_id || null,
            pharmacy: pharmacy || null,
            patient: patient_id || null
        }).populate({
            path: "doctor",
            select: "firstName lastName email"
        }).populate({
            path: "pharmacy",
            select: "firstName lastName email"
        }).populate({
            path: "patient",
            select: "firstName lastName email"
        });
        if (existingRoom) {
            return res.status(200).json({ message: 'room already exists', room: existingRoom });
        }
        if (doctor_id && doctor) {
            owner = doctor_id;
            ownerModel = "DoctorReg";
            new_chat_room = new chat_room_model_1.default({
                name,
                owner,
                ownerModel,
                doctor
            });
        }
        else if (doctor_id && pharmacy) {
            owner = doctor_id;
            ownerModel = "DoctorReg";
            new_chat_room = new chat_room_model_1.default({
                name,
                owner,
                ownerModel,
                pharmacy
            });
        }
        else if (admin_id && doctor) {
            owner = admin_id;
            ownerModel = "AdminReg";
            new_chat_room = new chat_room_model_1.default({
                name,
                owner,
                ownerModel,
                doctor
            });
        }
        else if (patient_id && pharmacy) {
            owner = patient_id;
            ownerModel = "UserReg";
            new_chat_room = new chat_room_model_1.default({
                name,
                owner,
                ownerModel,
                pharmacy
            });
        }
        else if (admin_id && patient) {
            owner = admin_id;
            ownerModel = "AdminReg";
            new_chat_room = new chat_room_model_1.default({
                name,
                owner,
                ownerModel,
                patient
            });
        }
        else {
            return res.status(400).json({ error: 'Invalid request to create a chat room' });
        }
        yield new_chat_room.save();
        res.status(201).json({ message: "New chat room created successfully", new_chat_room });
        console.log("New chat room created");
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to create chat room', error });
        console.log("Error creating room: ", error);
    }
});
exports.createChatRoom = createChatRoom;
// getting chat rooms...
const getChatRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e, _f;
    try {
        const doctor_id = (_d = req.doctor) === null || _d === void 0 ? void 0 : _d._id;
        const admin_id = (_e = req.admin) === null || _e === void 0 ? void 0 : _e.id;
        const patient_id = (_f = req.user) === null || _f === void 0 ? void 0 : _f.id;
        console.log("user making request: ", doctor_id || admin_id || patient_id);
        const ownerIds = [doctor_id, admin_id, patient_id].filter(Boolean);
        // Build the query object dynamically based on available IDs
        /*  const query: any = {
             $or: [
                 { owner: { $in: ownerIds } },
                 doctor_id ? { doctor: doctor_id } : null,
                 admin_id ? { pharmacy: admin_id } : null,
                 patient_id ? { patient: patient_id } : null
             ].filter(Boolean)
         };
    */
        const queryConditions = [
            { owner: { $in: ownerIds } },
            doctor_id && { doctor: doctor_id },
            admin_id && { pharmacy: admin_id },
            patient_id && { patient: patient_id }
        ].filter(Boolean);
        const query = { $or: queryConditions };
        // Find and populate rooms
        const rooms = yield chat_room_model_1.default.find(query)
            .populate({
            path: "doctor",
            select: "firstName lastName email"
        })
            .populate({
            path: "pharmacy",
            select: "firstName lastName email"
        })
            .populate({
            path: "patient",
            select: "firstName lastName email"
        });
        return res.status(200).json({ success: true, rooms });
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to fetch rooms' });
        console.log('Error getting user rooms: ', error);
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
    var _g, _h, _j;
    try {
        const userId = ((_g = req.doctor) === null || _g === void 0 ? void 0 : _g._id) || ((_h = req.admin) === null || _h === void 0 ? void 0 : _h._id) || ((_j = req.user) === null || _j === void 0 ? void 0 : _j._id);
        const roomId = req.params.room_id;
        const { text } = req.body;
        if (!text) {
            return res.status(400).json({ message: "please input a message text!" });
        }
        const room = yield chat_room_model_1.default.findById(roomId);
        if (!room) {
            return res.status(400).json({ message: "chat not sent, invalid room ID" });
        }
        const today = Date.now();
        // Create a new message
        const message = yield chat_model_1.default.create({ text, user: userId, room: roomId });
        const [doctor, admin, user] = yield Promise.all([
            doctor_reg_modal_1.default.findById(userId),
            admin_reg_model_1.default.findById(userId),
            userReg_model_1.default.findById(userId)
        ]);
        const message_sender = doctor || admin || user;
        room.updatedAt = today;
        room.last_message.sender_name = `${message_sender === null || message_sender === void 0 ? void 0 : message_sender.firstName} ${message_sender === null || message_sender === void 0 ? void 0 : message_sender.lastName}`;
        room.last_message.text = text;
        console.log("room date updated!!!");
        yield room.save();
        const io = (0, chatSocket_1.getIo)();
        // Emit the message to the room using Socket.io
        io.to(roomId).emit('message', message);
        console.log("msg sent to room: ", roomId, text);
        res.status(201).json({ message: "message sent successfully", data: message });
    }
    catch (error) {
        console.error('Error sending message:', error); // Log the error
        res.status(500).json({ error: 'Unable to send message' });
    }
});
exports.sendChatToRoom = sendChatToRoom;
