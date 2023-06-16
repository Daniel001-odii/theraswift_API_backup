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
const logger_1 = require("./middleware/logger");
const routes_1 = __importDefault(require("./routes/routes"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const csurf_1 = __importDefault(require("csurf"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const socket_1 = require("./utils/socket");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const csrfProtection = (0, csurf_1.default)({ cookie: true });
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 1000, // limit each IP to 100 requests per windowMs
// });
// Middleware
// app.use(limiter);
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(logger_1.logger);
app.use(express_1.default.static("public"));
dotenv_1.default.config();
// Configure Express to use EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path_1.default.join(__dirname, "/", "views"));
app.use(express_1.default.urlencoded({ extended: true }));
// Set up Content Security Policy middleware
// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self'; img-src 'self' data: https://theraswift-bucket.s3.amazonaws.com; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com"
//   );
//   next();
// });
// database connection
const MONGODB_URI = process.env.MONGODB_URI;
// process.env.MONGODB_URI! --
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
// console.log(process.env.MONGODB_URI);
// Router middleware
app.use("/", routes_1.default);
// Handle socket connections
(0, socket_1.socket)(server);
// app initialized port
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
// GMAIL_USERNAME='yumustyology@gmail.com'
// GMAIL_PASSWORD='gdcduniexzzthcau'
// TERMI_API_KEY='TLQuyFMJ4VTHRgNj6URWPoaULuwWWJdI90CckJlZgWp9bvG34m49kpt2LIOLEB'
// MONGODB_URI='mongodb+srv://yumustyung:yumustyung@cluster0.aa6bi.mongodb.net/theraswift?retryWrites=true&w=majority'
// JWT_SECRET_KEY='THERASWIFT_SECRETE_JWT_STRING'
// PAYSTACK_API_KEY='sk_test_3c8a5c6ad09a0d29f4d4b26031b9d0bc9034d3d9'
// AWS_ACCESS_KEY_ID=hafPXEhF+v6sT6nKVY+M/ufFjjgmlT5NSYvnbzu0
// AWS_SECRET_ACCESS_KEY=AKIAVSIJJJWE5LHTRZX4
