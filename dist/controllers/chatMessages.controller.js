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
exports.sendChatController = exports.getUsersChattedAdmin = exports.getChatsController = void 0;
const ChatMessages_model_1 = __importDefault(require("../models/ChatMessages.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
// Get all chats involving a user
const getChatsController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body;
        // Find all chats involving user
        const chats = yield ChatMessages_model_1.default.find({
            $or: [{ sender: userId }, { receiver: userId }],
        })
            .populate('sender', '-password')
            .populate('receiver', '-password')
            .sort({ createdAt: -1 });
        res.status(200).json({ chats });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getChatsController = getChatsController;
// Get users that have chatted with an admin
const getUsersChattedAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.body;
        const users = yield User_model_1.default.find({ 'chats.adminId': adminId }).select('_id email');
        res.status(200).json({ users });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getUsersChattedAdmin = getUsersChattedAdmin;
// Send a chat message
const sendChatController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sender, receiver, message } = req.body;
        // Create new chat
        const chat = new ChatMessages_model_1.default({
            sender,
            receiver,
            message,
        });
        yield chat.save();
        res.status(201).json({ message: 'Chat sent successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.sendChatController = sendChatController;
