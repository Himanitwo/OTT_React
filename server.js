import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import profileroutes from "./backend/routes/Profileroutes.js";
import { connectDB } from "./backend/config/db.js";

const app = express();
app.use(cors());
app.use(express.json());

await connectDB(); // ✅ Ensure connection before routes

app.use("/api/profile", profileroutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
