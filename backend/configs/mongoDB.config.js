import { config } from "dotenv";
import mongoose from "mongoose";

// this is for env variables
config();

// function to connect to DB
let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection) {
    return cachedConnection;
  }

  const db = process.env.MONGO_URI;

  if (!db) {
    console.error("No MongoDB URI found!!!");
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    // Use buffered commands false to avoid hanging queries if connection fails
    cachedConnection = await mongoose.connect(db, {
      bufferCommands: false,
    });
    console.log("Connected to MongoDB successfully!");
    return cachedConnection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    throw error;
  }
};

// export the function
export default connectDB;
