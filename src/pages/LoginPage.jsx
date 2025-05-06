import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: url('/img/background rectangle.png'),
        backgroundColor: "black"
      }}
    >
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-green-700/70 backdrop-blur-xs z-0"></div>

      {/* Glassmorphism Login Card */}
      <div className="relative z-10 bg-black/30 backdrop-blur-md p-16 rounded-2xl w-full max-w-md  border border-white/20 shadow-2xl">
        <h2 className="text-3xl text-white font-bold text-center mb-4">Welcome Back</h2>
        <p className="text-white text-center text-3xl mb-10">Login</p>

        <div className="mb-8">
          <label htmlFor="username" className="text-white text-xl">
            Username or email
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter username or email id"
            className="w-full mt-1 p-4 rounded-full bg-transparent border border-white text-white placeholder-white focus:outline-none"
          />
        </div>

        <div className="mb-8">
          <label htmlFor="password" className="text-white text-xl">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            className="w-full mt-1 p-4 rounded-full bg-transparent border border-white text-white placeholder-white focus:outline-none"
          />
        </div>

        <button className="w-full pt-4 bg-green-700 text-black text-xl font-bold py-2 rounded-full mb-6 hover:bg-green-500 transition">
          LOGIN
        </button>

        <div className="text-center">
          <p className="text-white text-xl mb-4">
            not a member yet?{" "}
            <Link to="/signup" className="text-cyan-300 underline">
              SignUp
            </Link> {/* Link to sign-up page */}
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
  );
};

export default LoginPage;