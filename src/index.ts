import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
//import { logger } from "./middleware/logger";
//import routes from "./routes/routes";
import mongoose, { ConnectOptions, MongooseOptions } from "mongoose";
import dotenv from "dotenv";
import csrf from "csurf";
import rateLimit from "express-rate-limit";
import { Server, Socket } from "socket.io";
import http from "http";
//import chatSocketConfig from './sockets/chatMessageSocketsConfig'
// import * as swaggerDocument from './swagger/swagger.json';
// import swaggerUi from 'swagger-ui-express';

//doctor routes
import doctorRoute from "./doctor/routes/routes";
//admin routes
import adminRoute from "./admin/route/route";
//user route
import userRoute from "./user/route/route";

const app = express();

const csrfProtection = csrf({ cookie: true })

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



//app.use('/theraswift-api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



// Middleware
app.use(limiter);
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup());
app.use(bodyParser.json());
app.use(express.static('../public'));
app.use(express.json());
app.use(cors());
app.use(helmet());
//app.use(logger);
dotenv.config();
app.use(express.urlencoded({ extended: true }));



// database connection
const MONGODB_URI = process.env.MONGODB_URI as string;

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


// Router middleware
//app.use("/", routes);
app.use("/doctor", doctorRoute);
app.use("/admin", adminRoute);
app.use("/user", userRoute);

// Handle socket connections
//chatSocketConfig(io);

// app initialized port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
