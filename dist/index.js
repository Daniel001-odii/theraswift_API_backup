"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const chatMessageSocketsConfig_1 = __importDefault(require("./sockets/chatMessageSocketsConfig"));
// import * as swaggerDocument from './'swagger.yaml';
const swaggerDocument = __importStar(require("./swagger/swagger.json"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const app = (0, express_1.default)();
const csrfProtection = (0, csurf_1.default)({ cookie: true });
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 1000, // limit each IP to 100 requests per windowMs
});
// Swagger setup
// const swaggerOptions = {
//   definition: {
//     openapi: '3.0.0',
//     info: {
//       title: 'Theraswift API Documentation',
//       version: '1.0.0',
//       description: 'API documentation for Theraswift organization containing all of the implementations',
//     },
//   },
//   apis: ['path/to/your/routes/*.js'], // Replace with the path to your route files
// };
// const swaggerDocument = YAML.load(path.join(__dirname, './swagger/swagger.json'));
// const swaggerDocument = YAML.load('./swagger/swagger.json');
// app.use('/swagger-ui', express.static(path.join(__dirname, 'node_modules/swagger-ui-dist')));
// app.use('/theraswift-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// const swaggerDocument = yaml.parse('./swagger.yaml');
// app.use('/theraswift-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// const swaggerContent = fs.readFileSync('./swagger.json', 'utf8');
// const swaggerDocument = yaml.parse(swaggerContent);
app.use('/theraswift-api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
// const swaggerSpec = swaggerJSDoc(swaggerOptions);
// const swaggerDocument = YAML.load('./swagger.yaml'); 
// Middleware
app.use(limiter);
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// app.get('/api-docs.json', (req, res) => {
//   res.setHeader('Content-Type', 'application/json');
//   res.send(swaggerDocument);
// });
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup());
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use(logger_1.logger);
dotenv_1.default.config();
app.use(express_1.default.urlencoded({ extended: true }));
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
// Router middleware
app.use("/", routes_1.default);
// Handle socket connections
(0, chatMessageSocketsConfig_1.default)(io);
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
