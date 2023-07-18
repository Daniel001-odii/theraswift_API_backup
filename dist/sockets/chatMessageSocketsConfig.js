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
const ChatMessages_model_1 = __importDefault(require("../models/ChatMessages.model"));
const User_model_1 = __importDefault(require("../models/User.model"));
exports.default = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
            socket.join(userId);
            // Get chats involving the user
            const chats = yield ChatMessages_model_1.default.find({
                $or: [{ sender: userId }, { receiver: userId }],
            })
                .sort({ createdAt: 1 });
            // Emit the chats to the user
            socket.emit('chats', { chats });
        }));
        socket.on('getUsersChattedAdmin', ({ adminId }) => __awaiter(void 0, void 0, void 0, function* () {
            const users = yield User_model_1.default.find({ 'chats.adminId': adminId }).select('_id email');
            socket.emit('usersChattedAdmin', { users });
        }));
        socket.on('new_message', ({ sender, receiver = '7053578760', message }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Create new chat
                const chat = new ChatMessages_model_1.default({
                    sender,
                    receiver,
                    message,
                });
                yield chat.save();
                let newMessage = {
                    sender: chat.sender,
                    receiver: chat.receiver,
                    message: chat.message,
                    // type: chat.sender === userId ? 'send' | 'recieve'
                };
                // Emit the message to the receiver
                io.to(receiver).emit('new_message', newMessage);
                // Send success status to the sender
                socket.emit('messageStatus', { success: true });
            }
            catch (error) {
                console.error(error);
                // Send error status to the sender
                socket.emit('messageStatus', { success: false });
            }
        }));
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
