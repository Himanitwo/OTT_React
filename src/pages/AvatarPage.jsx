import React, { useState } from "react";
import { getAuth } from "firebase/auth";

// Pre-existing seeds
const allowedSeeds = [
  "phoenix", "tiger123", "marathiKing", "sunsetWave", "forestElf", "coolCinebuff"
];

// Valid parameters based on DiceBear Adventurer style
const skinColors = ["F2D3B1", "D5B294", "B58B68", "A17251", "5C3A21", "3D2314"];

// Generate eye variants (01-12)
const eyeOptions = Array.from({length: 12}, (_, i) => 
  `variant${String(i+1).padStart(2, '0')}`
);

// Generate hair variants (long01-26, short01-19)
const hairOptions = [
  ...Array.from({length: 26}, (_, i) => `long${String(i+1).padStart(2, '0')}`),
  ...Array.from({length: 19}, (_, i) => `short${String(i+1).padStart(2, '0')}`)
];

// Generate mouth variants (01-30)
const mouthOptions = Array.from({length: 30}, (_, i) => 
  `variant${String(i+1).padStart(2, '0')}`
);

const AvatarModal = ({ currentProfile = {}, onSave, onClose }) => {
  const [seed, setSeed] = useState(
    allowedSeeds.includes(currentProfile.seed) ? currentProfile.seed : allowedSeeds[0]
  );
  const [skinColor, setSkinColor] = useState(currentProfile.skinColor || "F2D3B1");
  const [hair, setHair] = useState(currentProfile.hair || "long01");
  const [eyes, setEyes] = useState(currentProfile.eyes || "variant01");
  const [mouth, setMouth] = useState(currentProfile.mouth || "variant01");
  const [displayName, setDisplayName] = useState(currentProfile.displayName || "");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  // Generate preview URL
  const generatePreviewUrl = () => {
    return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&skinColor=${skinColor}&hair=${hair}&eyes=${eyes}&mouth=${mouth}&size=150`;
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        throw new Error("User not authenticated. Please sign in.");
      }

      const token = await user.getIdToken(true);

      const payload = {
        style: "adventurer",
        seed,
        skinColor,
        hair,
        eyes,
        mouth,
        displayName: displayName || seed,
        avatarCustomized: true,
      };

      const response = await fetch(`http://localhost:4000/api/profile/${user.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || `Server responded with ${response.status}`);
      }

      const data = await response.json();
      onSave(data.profile);
    } catch (error) {
      console.error("Save failed:", error);
      setError(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-xl shadow-2xl max-w-md w-full border border-gray-700">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">
        {currentProfile.uid ? "Edit Your Avatar" : "Create Your Avatar"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-600 text-white rounded-lg text-center">
          {error}
        </div>
      )}

      <div className="flex flex-col items-center mb-6">
        <div className="bg-gray-900 rounded-full p-2 mb-4">
          <img
            src={generatePreviewUrl()}
            alt="Avatar preview"
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>

        <div className="w-full mb-4">
          <label className="block text-gray-300 mb-2 text-sm font-medium">
            Display Name
          </label>
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
            placeholder="Enter your display name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">
            Choose a Seed
          </label>
          <select
            value={seed}
            onChange={(e) => setSeed(e.target.value)}
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            {allowedSeeds.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">
            Skin Color
          </label>
          <select
            value={skinColor}
            onChange={(e) => setSkinColor(e.target.value)}
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            {skinColors.map((color) => (
              <option key={color} value={color}>
                #{color}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">
            Hair Style
          </label>
          <select
            value={hair}
            onChange={(e) => setHair(e.target.value)}
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            {hairOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">
            Eyes
          </label>
          <select
            value={eyes}
            onChange={(e) => setEyes(e.target.value)}
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            {eyeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2 text-sm font-medium">
            Mouth
          </label>
          <select
            value={mouth}
            onChange={(e) => setMouth(e.target.value)}
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white"
          >
            {mouthOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onClose}
          disabled={isSaving}
          className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition"
        >
          {isSaving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            "Save Avatar"
          )}
        </button>
      </div>
    </div>
  );
};

export default AvatarModal;