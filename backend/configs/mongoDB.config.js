import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};
export default connectDB;
