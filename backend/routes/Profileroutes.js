// backend/routes/Profileroutes.js
import express from "express";
import Profile from "../models/Profile.js"; // ✅ Use correct path
import {
  updateOrCreateProfile,
  syncUser
} from "../controllers/profileController.js";

const router = express.Router();

// ✅ Get profiles by user UID
router.get("/:uid", async (req, res) => {
  try {
    // Change from find() to findOne()
    const profile = await Profile.findOne({ uid: req.params.uid });
    
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    
    res.json(profile); // Now returns a single object
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

// ✅ Create a new profile
router.post("/", async (req, res) => {
  try {
    const profile = new Profile(req.body);
    const savedProfile = await profile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error("Error creating profile:", error); 
    res.status(400).json({ error: "Failed to create profile" });
  }
});

// ✅ Update or create profile (used for theme updates too)
router.put("/:uid", updateOrCreateProfile);

// ✅ Sync Firebase user to MongoDB
router.post("/syncUser", syncUser);

export default router;
