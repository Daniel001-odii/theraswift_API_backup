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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const csurf_1 = __importDefault(require("csurf"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
//doctor routes
const routes_1 = __importDefault(require("./doctor/routes/routes"));
//admin routes
const route_1 = __importDefault(require("./admin/route/route"));
//user route
const route_2 = __importDefault(require("./user/route/route"));
//driver route
const route_3 = __importDefault(require("./driver/route/route"));
/*
  DANNIE
*/
// chat & messaging route...
const routes_2 = __importDefault(require("./chats/routes/routes"));
// intialize sockets for chat system..
const chatSocket_1 = require("./utils/chatSocket");
dotenv_1.default.config(); // Load environment variables at the very beginning
const app = (0, express_1.default)();
const csrfProtection = (0, csurf_1.default)({ cookie: true });
// const server = http.createServer(app);
/* const io = new Server(server, {
  cors: {
    origin: "*",
  },
}); */
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000, // limit each IP to 100 requests per windowMs
});
// Middleware
app.use(limiter);
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.use("/uploads", express_1.default.static("../public"));
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    // origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:5000", "http://localhost:3000", "http://localhost:8000", "https://www.providers.theraswift.co", "https://www.theraswift.co", "https://theraswift.co"],
    origin: "*",
    credentials: true
}));
app.use((0, helmet_1.default)());
// Database connection
// const MONGODB_URI = "mongodb://localhost:27017/TheraSwiftLocal";
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error('The MONGODB_URI environment variable is not set.');
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGODB_URI, {
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
app.use("/", express_1.default.Router().get("/", (req, res) => {
    res.json("Hello");
}));
app.use("/hello", express_1.default.Router().get("/", (req, res) => {
    res.json("Hello");
}));
app.use("/doctor", routes_1.default);
app.use("/admin", route_1.default);
app.use("/user", route_2.default);
app.use("/driver", route_3.default);
app.use("", routes_2.default);
// Handle socket connections
// chatSocketConfigUser(io);
// updated by Daniel...
const server = (0, chatSocket_1.initializeSocket)(app);
// App initialized port
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
