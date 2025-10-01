import mongoose from "mongoose";
import { config } from "./config.js";
import { logger } from "../utils/logger.js";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      logger.info("Connected to database Successfully");
    });

    mongoose.connection.on("error", (error) => {
      logger.error("Error in connecting to database", error);
    });

    await mongoose.connect(config.databaseUrl as string);
  } catch (error) {
    logger.error("Failed to connect the database", error);
    process.exit(1);
  }
};

export default connectDB;
