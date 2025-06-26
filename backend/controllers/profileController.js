import admin from "../firebase.js";
import Profile from "../models/Profile.js";

// ✅ Sync Firebase user to Profile model
export const syncUser = async (req, res) => {
  try {
    const { token } = req.body;
    const decoded = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decoded;

    const profile = await Profile.findOneAndUpdate(
      { uid },
      { uid, email, name, img: picture, updatedAt: new Date() },
      { new: true, upsert: true }  // upsert = create if doesn't exist
    );

    res.status(200).json({ message: "Profile synced", profile });
  } catch (err) {
    console.error("❌ syncUser error", err);
    res.status(401).json({ error: "Unauthorized" });
  }
};

// ✅ Get profile
export const getProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const profile = await Profile.findOne({ uid });
    if (!profile) return res.status(404).json({ error: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error("❌ getProfile error", err);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Update OR Create profile
export const updateOrCreateProfile = async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;

    // Verify token
    const token = req.headers.authorization?.split(" ")[1];
    await admin.auth().verifyIdToken(token);

    // Find or create profile
    let profile = await Profile.findOne({ uid });
    const validUpdates = {
      ...updates,
      avatarCustomized: updates.avatarCustomized || (profile?.avatarCustomized || false),
      hair: updates.hair || (profile?.hair || "long01"),
      eyes: updates.eyes || (profile?.eyes || "variant01"),
      mouth: updates.mouth || (profile?.mouth || "variant01"),
    };
    if (!profile) {
      // Create new profile if doesn't exist
      profile = new Profile({
        uid,
        ...updates,
        createdAt: new Date(),
        updatedAt: new Date()
        
      });
    } else {
      // Update only valid fields
      Object.keys(validUpdates).forEach(key => {
        if (validUpdates[key] !== undefined) {
          profile[key] = validUpdates[key];
        }
      });
      profile.updatedAt = new Date();
    }

    const savedProfile = await profile.save();
    res.json({ profile: savedProfile });
  } catch (err) {
    console.error("Profile update error:", err);
    res.status(500).json({ error: err.message });
  }
};