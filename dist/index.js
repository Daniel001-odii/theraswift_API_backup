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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
//import { logger } from "./middleware/logger";
//import routes from "./routes/routes";
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const csurf_1 = __importDefault(require("csurf"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
//import path from path
//import chatSocketConfig from './sockets/chatMessageSocketsConfig'
const socket_1 = __importDefault(require("./user/socket/socket"));
// import * as swaggerDocument from './swagger/swagger.json';
// import swaggerUi from 'swagger-ui-express';
//doctor routes
const routes_1 = __importDefault(require("./doctor/routes/routes"));
//admin routes
const route_1 = __importDefault(require("./admin/route/route"));
//user route
const route_2 = __importDefault(require("./user/route/route"));
const app = (0, express_1.default)();
const csrfProtection = (0, csurf_1.default)({ cookie: true });
const server = http_1.default.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: "*",
//   },
// });
const io = new socket_io_1.Server(server);
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000, // limit each IP to 100 requests per windowMs
});
//app.use('/theraswift-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// Middleware
app.use(limiter);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
//app.use(express.static('../public'));
app.use('/uploads', express_1.default.static('../public'));
app.use(express_1.default.json());
//app.use(cors());
app.use((0, cors_1.default)({
    origin: '*'
}));
app.use((0, helmet_1.default)());
//app.use(logger);
dotenv_1.default.config();
// database connection
const MONGODB_URI = process.env.MONGODB_URI;
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        mongoose_1.default.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected To Database - Initial Connection");
    }
    catch (err) {
        console.log(`Initial Distribution API Database connection error occurred -`, err);
    }
}))();
// Router middleware
//app.use("/", routes);
app.use("/doctor", routes_1.default);
app.use("/admin", route_1.default);
app.use("/user", route_2.default);
// Handle socket connections
(0, socket_1.default)(io);
// app initialized port
const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
