import React from "react";

const SignUpPage = () => {
  return (
    <div
      className="bg-cover bg-center h-screen"
      style={{ backgroundImage: "url('your-background-image.jpg')" }}
    >
      <div className="flex items-center justify-center h-full bg-black bg-opacity-60">
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">SignUp</h2>

          <form className="space-y-4">
            {/* Username */}
            <div>
              <label className="block font-semibold mb-1">
                Username or email
              </label>
              <input
                type="text"
                placeholder="Enter username or email id"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block font-semibold mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter password"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-semibold mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Enter password again"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Phone Number */}
            <div>
              <label className="block font-semibold mb-1">Phone Number</label>
              <input
                type="tel"
                placeholder="+91"
                className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              />
            </div>

            {/* Sign Up Button */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-2 px-4 bg-lime-400 hover:bg-lime-500 text-black font-bold rounded-full transition duration-300"
              >
                SIGN UP
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
