// server.js (in project root)
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import profileroutes from "./backend/routes/Profileroutes.js";

import { connectDB } from "./backend/config/db.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

await connectDB();

app.use("/api/profile", profileroutes);
// Token route

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
