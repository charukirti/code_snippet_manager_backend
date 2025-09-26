import mongoose from "mongoose";
import { config } from "./config.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database Successfully");
    });

    mongoose.connect(config.databaseUrl as string);

    mongoose.connection.on("error", (error) => {
      console.error("Error in connecting to database", error);
    });
  } catch (error) {
    console.error("Failed to connect the database", error);
    process.exit(1);
  }
};


export default connectDB