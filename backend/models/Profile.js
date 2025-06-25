// models/Profile.js
import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  email: String,
  name: String,
  emoji: String,
  img: String,
  bio: String,
  style: { type: String, default: "adventurer" },
  seed: { type: String, default: "newuser" },
  displayName: { type: String, default: "" },
  skinColor: { type: String, default: "F2D3B1" },
  hair: { type: String, default: "long01" },       // Updated
  eyes: { type: String, default: "default" },     // New
  mouth: { type: String, default: "default" },    // New
  avatarCustomized: { type: Boolean, default: false }, // Add this
  theme: {
    type: String,
    enum: ["dark", "cherryBlossom", "techno"],
    default: "dark",
  },
}, { timestamps: true });

const Profile = mongoose.models.Profile || mongoose.model("Profile", profileSchema);
export default Profile;