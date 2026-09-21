import mongoose from "mongoose";
import dns from "dns";

export const connectDB = async (): Promise<typeof mongoose | void> => {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/feedants";
  try {
    if (uri.startsWith("mongodb+srv://")) {
      try {
        dns.setServers(["8.8.8.8", "1.1.1.1"]);
      } catch (dnsErr) {
        console.warn("Could not set fallback DNS servers:", dnsErr);
      }
    }
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
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
