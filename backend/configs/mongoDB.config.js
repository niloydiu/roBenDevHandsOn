import { config } from "dotenv";
import mongoose from "mongoose";

// this is for env variables
config();

// function to connect to DB
const connectDB = async () => {
  // get the URI for mongoDB from env file
  const db = process.env.MONGO_URI;

  // checking if MONGO_URI exists
  if (!db) {
    console.log("No MongoDB URI found!!!");
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    // connecting to mongodb using mongoose
    const conn = await mongoose.connect(db);

    // if success then print this
    console.log("Connected to MongoDB successfully!");
    return mongoose.connection;
  } catch (error) {
    // if error then print this
    console.error("Error connecting to MongoDB:", error.message);
    console.log("Check your internet connection or MongoDB URI");
    process.exit(1); // exit with error code
  }
};

// export the function
export default connectDB;
