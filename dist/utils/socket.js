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
exports.socket = void 0;
const socket_io_1 = require("socket.io");
const User_model_1 = __importDefault(require("../models/User.model"));
const ChatMessages_model_1 = __importDefault(require("../models/ChatMessages.model"));
const socket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        const { userId } = socket.handshake.query;
        // Find user by ID
        const user = yield User_model_1.default.findById(userId);
        if (!user)
            return;
        if (user.role === 'admin') {
            // Admin joins all rooms
            const users = yield User_model_1.default.find({ role: 'user' });
            // TODO return those who have chatted admin
            // for (const user of users) {
            //   socket.join(user.id);
            // }
        }
        else {
            // User joins room with admin
            const admins = yield User_model_1.default.find({ role: 'admin' });
            for (const admin of admins) {
                socket.join(admin.id);
            }
        }
        // Listen for incoming chats
        socket.on('chat', ({ sender, receiver, message }) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                // Save chat to database
                const chat = new ChatMessages_model_1.default({
                    sender,
                    receiver,
                    message,
                });
                yield chat.save();
                // Emit chat to all sockets in the room
                socket.to(receiver).emit('chat', chat);
            }
            catch (error) {
                console.error(error);
            }
        }));
        socket.on("leave", (userId) => {
            socket.leave(userId);
            console.log(`User ${userId} left`);
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    }));
};
exports.socket = socket;
exports.default = exports.socket;
