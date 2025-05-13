import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase"; // adjust path as needed

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const [formError, setFormError] = useState("");
  const [userInfo, setUserInfo] = useState(null); // for now

  const handleChange = (e) => {
    setFormError("");
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const userData = {
        uid: user.uid,
        email: user.email,
        phone: formData.phone,
      };

      setUserInfo(userData);
      console.log("User registered:", userData);
    } catch (error) {
      setFormError(error.message);
    }
  };

  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: "url('your-background-image.jpg')" }}
    >
      <div className="flex items-center justify-center h-full bg-black bg-opacity-60">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">SignUp</h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Username or Email */}
            <div>
              <label className="block font-semibold mb-1">
                Username or email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter username or email id"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter password again"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Error Message */}
            {formError && (
              <p className="text-red-500 text-sm mb-4 text-center">
                {formError}
              </p>
            )}

            {/* Sign Up Button */}
            <button
              type="submit"
              className="w-full pt-4 bg-green-600 text-black text-xl font-bold py-2 rounded-full mb-6 hover:bg-green-500 transition"
            >
              SIGN UP
            </button>
          </form>

          {/* Bottom Links & Google Button */}
          <div className="text-center">
            <p className="text-black text-xl mb-4">
              Already a member?{" "}
              <Link to="/login" className="text-cyan-600 underline">
                Login
              </Link>
            </p>

            <button className="bg-white p-2 rounded-full hover:bg-gray-300 transition">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
