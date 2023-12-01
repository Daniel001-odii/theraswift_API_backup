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
const chat_model_1 = __importDefault(require("../models/chat.model"));
// export default (io: Server) => {
exports.default = (io) => {
    io.on('connection', (socket) => {
        socket.on('join', (join) => __awaiter(void 0, void 0, void 0, function* () {
            //socket.join(userId);
            // Get chats involving the user
            const chats = yield chat_model_1.default.find({
                $or: [{ sender: join.userId }, { reciever: join.userId }],
            })
                .sort({ createdAt: 1 });
            // Emit the chats to the user
            socket.emit('chats', { chats });
        }));
        socket.on('getUsersChattedAdmin', (join) => __awaiter(void 0, void 0, void 0, function* () {
            //const userChat = await User.find({ 'chats.adminId': adminId }).select('_id email');
            const userChat = yield chat_model_1.default.find({
                $or: [{ sender: join.userId }, { reciever: join.userId }],
            })
                .sort({ createdAt: 1 });
            socket.emit('usersChattedAdmin', { userChat });
        }));
        socket.on('new_message', ({ sender, receiver = '7053578760', message }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Create new chat
                const chat = new chat_model_1.default({
                    sender,
                    reciever: receiver,
                    message,
                });
                yield chat.save();
                let newMessage = {
                    sender: chat.sender,
                    receiver: chat.reciever,
                    message: chat.message,
                    time: chat.createdAt
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
