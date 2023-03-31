import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./middleware/logger";
import routes from "./routes/routes";
import mongoose, { ConnectOptions, MongooseOptions } from "mongoose";
import dotenv from "dotenv";
import { sendGiftTopUpSenderEmail } from "./utils/sendEmailUtility";
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(logger);
dotenv.config();

// database connection
const MONGODB_URI = process.env.MONGODB_URI as string;
// process.env.MONGODB_URI!

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

console.log(process.env.MONGODB_URI);


// Router middleware
app.use("/", routes);

// MONGODB_URI=mongodb+srv://yumustyung:yumustyung@cluster0.aa6bi.mongodb.net/theraswift?retryWrites=true&w=majority
// JWT_SECRET_KEY=THERASWIFT_SECRETE_JWT_STRING
// PAYSTACK_API_KEY=sk_test_3c8a5c6ad09a0d29f4d4b26031b9d0bc9034d3d9


// app.get("/", (req, res) => {
//   res.send("Hello, TypeScript!");
// });

// app initialized port
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
