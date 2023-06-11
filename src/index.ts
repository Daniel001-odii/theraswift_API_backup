import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./middleware/logger";
import routes from "./routes/routes";
import mongoose, { ConnectOptions, MongooseOptions } from "mongoose";
import dotenv from "dotenv";
import csrf from "csurf";
import rateLimit from "express-rate-limit";
import { Server, Socket } from "socket.io";
import http from "http";
import handleSocketConnection, { socket } from "./utils/socket";
import path from "path";

const app = express();
const csrfProtection = csrf({ cookie: true });

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(logger);
app.use(express.static("public"));
dotenv.config();
// Configure Express to use EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/", "views"));
app.use(express.urlencoded({ extended: true }));
// Set up Content Security Policy middleware
// app.use((req, res, next) => {
//   res.setHeader(
//     "Content-Security-Policy",
//     "default-src 'self'; img-src 'self' data: https://theraswift-bucket.s3.amazonaws.com; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com"
//   );
//   next();
// });

// database connection
const MONGODB_URI = process.env.MONGODB_URI as string;
// process.env.MONGODB_URI! --

(async () => {
  try {
    mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as ConnectOptions);
    console.log("Connected To Database - Initial Connection");
  } catch (err) {
    console.log(
      `Initial Distribution API Database connection error occurred -`,
      err
    );
  }
})();

// console.log(process.env.MONGODB_URI);

// Router middleware
app.use("/", routes);

// Handle socket connections
socket(server);

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
