"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_1 = require("http");
const chatRouter_1 = require("./routers/chatRouter");
const app = (0, express_1.default)();
const server = (0, http_1.createServer)(app);
const io = (0, socket_io_1.default)(server);
// MongoDB configuration
mongoose_1.default
    .connect('mongodb://localhost:27017/chatApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('MongoDB connection error:', error));
// Socket.IO configuration
const socket_1 = __importDefault(require("./socket"));
(0, socket_1.default)(io);
// Routers
app.use('/api/chat', chatRouter_1.ChatRouter);
const port = 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
