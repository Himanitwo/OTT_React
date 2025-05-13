import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase"; // Adjust path as needed

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const validateUsername = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    if (!value) {
      setUsernameError("Username or email is required.");
    } else if (!emailRegex.test(value) && !usernameRegex.test(value)) {
      setUsernameError("Enter a valid email or username (3–20 characters, no special characters).");
    } else {
      setUsernameError("");
    }
  };

  const validatePassword = (value) => {
    // Add if needed
    // const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    validateUsername(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    validateUsername(username);
    validatePassword(password);

    if (!username || !password || usernameError || passwordError) {
      setFormError("Invalid input. Please check your username and password.");
      return;
    }

    try {
      const email = username.includes("@") ? username : `${username}@yourdomain.com`;
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Logged in:", userCredential.user);
      setFormError("");
      navigate("/dashboard");
    } catch (error) {
      setFormError("Login failed: " + error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Google login:", result.user);
      navigate("/dashboard");
    } catch (error) {
      setFormError("Google login failed: " + error.message);
    }
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: `url('/img/background rectangle.png')`,
        backgroundColor: "black",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-green-900/70 backdrop-blur-xs z-0"></div>

      <div className="relative z-10 bg-black/30 backdrop-blur-md p-16 rounded-2xl w-full max-w-md border border-white/20 shadow-2xl">
        <h2 className="text-3xl text-white font-bold text-center mb-4">Welcome Back</h2>
        <p className="text-white text-3xl text-center mb-10">Login</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="username" className="text-white text-xl">Username or email</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              onBlur={() => validateUsername(username)}
              placeholder="Enter username or email id"
              className="w-full mt-1 p-4 rounded-full bg-transparent border border-white text-white placeholder-white focus:outline-none"
            />
            {usernameError && <p className="text-red-400 text-sm mt-1">{usernameError}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="text-white text-xl">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onBlur={() => validatePassword(password)}
              placeholder="Enter password"
              className="w-full mt-1 p-4 rounded-full bg-transparent border border-white text-white placeholder-white focus:outline-none"
            />
            {passwordError && <p className="text-red-400 text-sm mt-1">{passwordError}</p>}
          </div>

          {formError && (
            <p className="text-red-500 text-sm mb-4 text-center">{formError}</p>
          )}

          <button
            type="submit"
            className="w-full pt-4 bg-green-600 text-black text-xl font-bold py-2 rounded-full mb-6 hover:bg-green-500 transition"
          >
            LOGIN
          </button>
        </form>

        <div className="text-center">
          <p className="text-white text-xl mb-4">
            not a member yet?{" "}
            <Link to="/signup" className="text-cyan-300 underline">
              SignUp
            </Link>
          </p>

          <button
            onClick={handleGoogleSignIn}
            className="bg-white p-2 rounded-full hover:bg-gray-300 transition"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
