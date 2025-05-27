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
exports.sendChatToRoom = exports.getChatMessagesInRoom = exports.getChatRooms = exports.createChatRoomForPharmacy = exports.createChatRoomForDoctor = void 0;
const chat_modelOld_1 = __importDefault(require("../models/chat.modelOld"));
const chatSocket_1 = require("../../utils/chatSocket");
const chatRoom_model_1 = __importDefault(require("../models/chatRoom.model"));
const chatRoom_model_2 = __importDefault(require("../models/chatRoom.model"));
// CREATE A CHAT ROOM BETWEEN DOCTOR AND USER
const createChatRoomForDoctor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const { name, doctor_id } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'room name is required' });
        }
        if (!doctor_id) {
            return res.status(400).json({ error: 'a doctor id is required' });
        }
        // Check if the room already exists
        const existingRoom = yield chatRoom_model_1.default.findOne({ name, user: user_id, pharm: doctor_id });
        if (existingRoom) {
            return res.status(400).json({ error: 'room already exists' });
        }
        // Create a new room and store references to the user and employer
        const room = new chatRoom_model_1.default({ name, user: user_id, doctor: doctor_id });
        yield room.save();
        res.status(201).json({ message: "new room created for user and doctor", room });
        console.log("new message room created");
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to create chat room', error });
        console.log("error creating rooom: ", error);
    }
});
exports.createChatRoomForDoctor = createChatRoomForDoctor;
// CREATE A CHAT ROOM BETWEEN PHARMACY AND USER
const createChatRoomForPharmacy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        const { name, pharm_id } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'room name is required' });
        }
        if (!pharm_id) {
            return res.status(400).json({ error: 'a pharmacy id is required' });
        }
        // Check if the room already exists
        const existingRoom = yield chatRoom_model_1.default.findOne({ name, user: user_id, pharm: pharm_id });
        if (existingRoom) {
            return res.status(400).json({ error: 'room already exists' });
        }
        // Create a new room and store references to the user and employer
        const room = new chatRoom_model_1.default({ name, user: user_id, pharm: pharm_id });
        yield room.save();
        res.status(201).json({ message: "new room created for user and pharmacy", room });
        console.log("new message room created");
    }
    catch (error) {
        res.status(500).json({ message: 'Unable to create chat room', error });
        console.log("error creating rooom: ", error);
    }
});
exports.createChatRoomForPharmacy = createChatRoomForPharmacy;
/* export const createChatRoom = async (req:any, res:Response) => {
  try {
    const user_id = req.user.id;
    const { name, pharm_id } = req.body;

    if(!name){
      return res.status(400).json({ error: 'room name is required' });
    }

    if(!pharm_id){
      return res.status(400).json({ error: 'a pharmacy id is required' });
    }

    // Check if the room already exists
    const existingRoom = await Room.findOne({ name, user: user_id, pharm: pharm_id });

    if (existingRoom) {
      return res.status(400).json({ error: 'room already exists' });
    }

    // Create a new room and store references to the user and employer
    const room = new Room({ name, user: user_id, pharm: pharm_id });
    await room.save();

    res.status(201).json({ room });
    console.log("new message room created");
  } catch (error) {
    res.status(500).json({ message: 'Unable to create chat room', error });
    console.log("error creating rooom: ", error);
  }
};
 */
// GET ALL CHATS ROOMS FOR A USER >>>
const getChatRooms = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user_id = req.user.id;
        // const user = req.user;
        // console.log("user in request payload: ", user.email)
        // const pharm = await AdminModel.findById(user_id);
        const rooms = yield chatRoom_model_2.default.find({ user: user_id }).populate({
            path: "doctor",
            select: "firstName lastName email"
        });
        res.status(200).json({ rooms });
    }
    catch (error) {
        res.status(500).json({ error: 'unable to fetch rooms' });
        console.log('error getting user rooms: ', error);
    }
});
exports.getChatRooms = getChatRooms;
// GET MESSAGES IN A PARTICULAR ROOM >>>
const getChatMessagesInRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const room_id = req.params.room_id;
        const messages = yield chat_modelOld_1.default.find({ room: room_id });
        res.status(200).json({ messages });
    }
    catch (error) {
        res.status(500).json({ error: 'Unable to fetch messages from room' });
        console.log("error getting messages for room: ", error);
    }
});
exports.getChatMessagesInRoom = getChatMessagesInRoom;
// SEND MESSAGE CONTROLLER >>>
const sendChatToRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        // console.log("user ;", userId)
        const roomId = req.params.room_id;
        const { text } = req.body;
        const room = yield chatRoom_model_1.default.findById(roomId);
        if (!text) {
            return res.status(400).json({ message: "please provide a valid message text" });
        }
        if (!room) {
            return res.status(404).json({ message: "cant send message to room, room not found" });
        }
        const today = Date.now();
        // Create a new message
        const message = yield chat_modelOld_1.default.create({ text, user: userId, room: roomId });
        room.updatedAt = today;
        console.log("room date updated!!!");
        yield room.save();
        // await message.save();
        const io = (0, chatSocket_1.getIo)();
        // Emit the message to the room using Socket.io
        io.to(roomId).emit('message', message);
        console.log("new socket msg sent to room: ", roomId);
        res.status(201).json({ message });
    }
    catch (error) {
        console.error('Error sending message:', error); // Log the error
        res.status(500).json({ error: 'Unable to send message' });
    }
});
exports.sendChatToRoom = sendChatToRoom;
