import mongoose from "mongoose";

export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/feedants";
  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(
      "MongoDB connection warning/failure:",
      error instanceof Error ? error.message : error
    );
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
};
