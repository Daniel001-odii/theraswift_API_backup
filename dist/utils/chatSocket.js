"use strict";
// const http = require('http')
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIo = exports.initializeSocket = void 0;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
let io;
const initializeSocket = (app) => {
    const server = http_1.default.createServer(app);
    io = new socket_io_1.Server(server, {
        cors: {
            origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:5000", "http://localhost:3000", "http://localhost:3001", "http://localhost:8000", "https://www.providers.theraswift.co", "https://www.theraswift.co", "https://theraswift.co"],
            methods: ["GET", "POST"],
            credentials: true,
        },
        path: "/socket.io",
    });
    io.on('connection', (socket) => {
        console.log("new socket io connection...");
        // listen for the 'join event and join the room
        socket.on('join', (room) => {
            socket.join(room);
            console.log(`user joined room: ${room}`);
        });
        socket.on('disconnect', () => {
            console.log('user disconnected');
        });
        socket.on('message', () => {
            console.log('new message received');
        });
    });
    return server;
};
exports.initializeSocket = initializeSocket;
const getIo = () => {
    if (!io) {
        throw new Error('socket is not initialized');
    }
    return io;
};
exports.getIo = getIo;
// module.exports = { initializeSocket, getIo };
