import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@radix-ui/react-dialog";

export default function AvatarModal({ onSave }) {
  const style = "adventurer";

  const predefinedSeeds = [
    "Adrian", "Jack", "Oliver", "Riley",
    "Vivian", "Chase", "Kingston", "Sawyer",
  ];

  const [seed, setSeed] = useState(predefinedSeeds[0]);
  const [bgColor, setBgColor] = useState("b6e3f4");
  const [skinColor, setSkinColor] = useState("e0ac69");
  const [hairColor, setHairColor] = useState("2c1b18");
  const [hairStyle, setHairStyle] = useState("short01");
  const [facialHair, setFacialHair] = useState("none");
  const [glasses, setGlasses] = useState("none");
  const [eyes, setEyes] = useState("variant01");
  const [eyebrows, setEyebrows] = useState("variant01");
  const [mouth, setMouth] = useState("variant01");
  const [earrings, setEarrings] = useState("none");

  const avatarUrl = `
    https://api.dicebear.com/9.x/${style}/svg
    ?seed=${seed}
    &backgroundColor=${bgColor}
    &hair=${hairStyle}
    &hairColor=${hairColor}
    &skinColor=${skinColor}
    &facialHair=${facialHair}
    ${glasses !== "none" ? `&glasses=${glasses}` : ""}
    &eyes=${eyes}
    &eyebrows=${eyebrows}
    &mouth=${mouth}
    ${earrings !== "none" ? `&earrings=${earrings}` : ""}
  `.replace(/\s+/g, "");

  const handleSave = () => {
    onSave({ name: seed, img: avatarUrl, bio: "Custom Adventurer" });
  };

  return (
    <Dialog>
      <DialogTrigger className="bg-[#f5e0a9] text-black px-4 py-2 rounded">
        Add Avatar
      </DialogTrigger>

      <DialogContent className="
        bg-white w-[600px] max-w-[90vw] max-h-[90vh]
        p-6 rounded-lg shadow-xl mx-auto overflow-auto
      ">
        <h2 className="text-lg font-bold mb-4 text-black text-center">
          Create Adventurer Avatar
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 space-y-3">
            <label className="block text-sm text-black">Choose Seed</label>
            <select
              value={seed}
              onChange={e => setSeed(e.target.value)}
              className="border p-1 w-full text-black"
            >
              {predefinedSeeds.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>

            <label className="block text-sm text-black">Background Color</label>
            <input
              type="color"
              value={`#${bgColor}`}
              onChange={e => setBgColor(e.target.value.slice(1))}
              className="w-12 h-8 border-none cursor-pointer"
            />

            <label className="block text-sm text-black">Skin Color</label>
            <select
              value={skinColor}
              onChange={e => setSkinColor(e.target.value)}
              className="border p-1 w-full text-black"
            >
              <option value="e0ac69">Light</option>
              <option value="c68642">Medium</option>
              <option value="8d5524">Dark</option>
            </select>

            <label className="block text-sm text-black">Hair Color</label>
            <select
              value={hairColor}
              onChange={e => setHairColor(e.target.value)}
              className="border p-1 w-full text-black"
            >
              <option value="2c1b18">Black</option>
              <option value="b55239">Brown</option>
              <option value="dba279">Blonde</option>
              <option value="e5d7a3">Light Blonde</option>
              <option value="fff">White</option>
            </select>

            <label className="block text-sm text-black">Hair Style</label>
            <select
              value={hairStyle}
              onChange={e => setHairStyle(e.target.value)}
              className="border p-1 w-full text-black"
            >
              <option value="short01">Short</option>
              <option value="long01">Medium</option>
              <option value="long06">Medium</option>
              <option value="long23">Bun</option>
              <option value="short18">Afro</option>
              <option value="short15">Mohawk</option>
              <option value="long08">Flower Crown</option>
            </select>
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex-1 flex flex-col items-center gap-4">
            <label className="block text-sm text-black w-full">Facial Hair</label>
            <select
              value={facialHair}
              onChange={e => setFacialHair(e.target.value)}
              className="border p-1 w-full text-black"
            >
              <option value="none">None</option>
              <option value="beardLight">Beard (Light)</option>
              <option value="beardMedium">Beard (Medium)</option>
              <option value="beardHeavy">Beard (Heavy)</option>
              <option value="moustacheFancy">Fancy</option>
              <option value="moustacheMagnum">Magnum</option>
            </select>

            <label className="block text-sm text-black w-full">Glasses</label>
            <select
              value={glasses}
              onChange={e => setGlasses(e.target.value)}
              className="border p-1 w-full text-black"
            >
              <option value="none">None</option>
              <option value="variant01">Square</option>
              <option value="variant02">Round</option>
              <option value="variant03">Sunglasses</option>
            </select>

            <label className="block text-sm text-black w-full">Eyes</label>
            <select
              value={eyes}
              onChange={e => setEyes(e.target.value)}
              className="border p-1 w-full text-black"
            >
              <option value="variant01">Variant 01</option>
              <option value="variant02">Variant 02</option>
              <option value="variant03">Variant 03</option>
            </select>

            <label className="block text-sm text-black w-full">Eyebrows</label>
            <select
              value={eyebrows}
              onChange={e => setEyebrows(e.target.value)}
              className="border p-1 w-full text-black"
            >
              <option value="variant01">Variant 01</option>
              <option value="variant02">Variant 02</option>
              <option value="variant03">Variant 03</option>
            </select>

            <label className="block text-sm text-black w-full">Mouth</label>
            <select
              value={mouth}
              onChange={e => setMouth(e.target.value)}
              className="border p-1 w-full text-black"
            >
              <option value="variant01">Variant 01</option>
              <option value="variant02">Variant 02</option>
              <option value="variant03">Variant 03</option>
            </select>

            <label className="block text-sm text-black w-full">Earrings</label>
            <select
              value={earrings}
              onChange={e => setEarrings(e.target.value)}
              className="border p-1 w-full text-black"
            >
              <option value="none">None</option>
              <option value="variant01">Hoop</option>
              <option value="variant02">Stud</option>
              <option value="variant03">Drop</option>
            </select>

            <img
              src={avatarUrl}
              alt="Avatar Preview"
              className="w-24 h-24 rounded-full border-2 border-gray-300 mt-2"
            />

            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mt-auto"
            >
              Save
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
