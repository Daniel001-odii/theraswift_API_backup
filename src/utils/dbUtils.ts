import mongoose, { ConnectOptions, MongooseOptions } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
// process.env.MONGODB_URI!

export let dbConnection = async () => {
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
  }