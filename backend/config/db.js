// backend/config/db.js
import mongoose from "mongoose";

const mongoUri = "mongodb+srv://Felu:helloCar@cluster0.zzchdz9.mongodb.net/Profile_Data?retryWrites=true&w=majority&appName=Cluster0";

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

export default mongoose;
