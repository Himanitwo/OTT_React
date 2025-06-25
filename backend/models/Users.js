// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  uid: { type: String, unique: true, required: true },
  email: String,
  name: String,
  picture: String,
  emoji: String,
  img: String,
  bio: String,
  theme: {
    type: String,
    enum: ["dark", "cherryBlossom", "techno"],
    default: "dark"
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
