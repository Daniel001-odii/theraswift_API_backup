import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./middleware/logger";
import routes from "./routes/routes";
import mongoose, { ConnectOptions, MongooseOptions } from "mongoose";
import dotenv from "dotenv";
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(logger);
dotenv.config();


// database connection
console.log(process.env.MONGODB_URI);
const MONGODB_URI = process.env.MONGODB_URI as string;
// process.env.MONGODB_URI!

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  } as ConnectOptions)
  .then((res) => {
    console.log("Connected to Distribution API Database - Initial Connection");
  })
  .catch((err) => {
    console.log(
      `Initial Distribution API Database connection error occured -`,
      err
    );
  });

// Router middleware
app.use("/", routes);

// app.get("/", (req, res) => {
//   res.send("Hello, TypeScript!");
// });

// app initialized port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
