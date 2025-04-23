import React from "react";

const LoginPage = () => {
  return (
    <div
      className="bg-cover bg-center h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('c2579e48-abf8-4a3a-b7e5-bb8bfd141a94.png')",
      }}
    >
      <div className="bg-black bg-opacity-80 p-8 rounded-2xl w-96 shadow-xl text-white">
        <h2 className="text-2xl font-semibold mb-1">Welcome Back</h2>
        <p className="mb-6 text-lg">Login</p>

        <div className="mb-4">
          <label className="block text-sm mb-1" htmlFor="username">
            Username or email
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter username or email id"
            className="w-full px-4 py-2 rounded-full bg-transparent border border-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Enter password"
            className="w-full px-4 py-2 rounded-full bg-transparent border border-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-400"
          />
        </div>

        <button className="w-full bg-lime-400 text-black font-bold py-2 rounded-full hover:bg-lime-300 transition">
          LOGIN
        </button>

        <div className="text-center mt-6 text-sm">
          <p>
            not a member yet{" "}
            <a
              href="signuup.html"
              className="text-lime-400 cursor-pointer hover:underline"
            >
              SignUp
            </a>
          </p>

          <div className="flex items-center justify-center mt-2 space-x-2">
            <a
              href="signuup.html"
              className="text-white cursor-pointer hover:underline"
            >
              SignUp
            </a>
            <span>|</span>
            <button className="bg-white p-2 rounded-full">
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google login"
                className="w-5 h-5"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
