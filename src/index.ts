import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./middleware/logger";
import  routes from "./routes/routes";
import mongoose from "mongoose";
const app = express();

// Middleware
// app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(logger);

// database connection
mongoose.connect(
     "mongodb+srv://yumustyung:yumustyung@cluster0.aa6bi.mongodb.net/weatherApp?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log("db connected")
  );



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
