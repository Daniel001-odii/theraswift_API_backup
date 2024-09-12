import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import mongoose, { ConnectOptions } from "mongoose";
import dotenv from "dotenv";
import csrf from "csurf";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import http from "http";

//doctor routes
import doctorRoute from "./doctor/routes/routes";
//admin routes
import adminRoute from "./admin/route/route";
//user route
import userRoute from "./user/route/route";
//driver route
import driverRoute from "./driver/route/route";
import chatSocketConfigUser from "./user/socket/socket";

// intialize sockets for chat system..
import { initializeSocket } from "./utils/chatSocket";

dotenv.config(); // Load environment variables at the very beginning

const app = express();

const csrfProtection = csrf({ cookie: true });

// const server = http.createServer(app);

/* const io = new Server(server, {
  cors: {
    origin: "*",
  },
}); */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("../public"));
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use(helmet());

// Database connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('The MONGODB_URI environment variable is not set.');
}

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
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

// Router middleware
app.use(
  "/",
  express.Router().get("/", (req, res) => {
    res.json("Hello");
  })
);
app.use(
  "/hello",
  express.Router().get("/", (req, res) => {
    res.json("Hello");
  })
);

app.use("/doctor", doctorRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);
app.use("/driver", driverRoute);

// Handle socket connections
// chatSocketConfigUser(io);
// updated by Daniel...
const server = initializeSocket(app);

// App initialized port
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
