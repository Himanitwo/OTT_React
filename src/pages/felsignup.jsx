import React from 'react';

function App() {
  return (
    <div
      className="h-screen w-full bg-cover bg-center flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url('/img/background rectangle.png')", // Assuming same background image as Login
        backgroundColor: "black",
      }}
    >
      {/* Blurred Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-green-900/60 backdrop-blur-xs z-0"></div>

      {/* Glassmorphism SignUp Card with Aesthetic Design */}
      <form className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/20 shadow-2xl p-12 rounded-3xl w-120 sm:w-128 lg:w-144 flex flex-col space-y-6">
        <h2 className="text-white text-4xl font-semibold text-center mb-8">Create Your Account</h2>

        <div className="flex flex-col space-y-3">
          <label className="text-white text-lg font-medium">Username or Email</label>
          <input
            type="text"
            placeholder="Enter username or email"
            className="p-4 rounded-full bg-transparent border border-white text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label className="text-white text-lg font-medium">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            className="p-4 rounded-full bg-transparent border border-white text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label className="text-white text-lg font-medium">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="p-4 rounded-full bg-transparent border border-white text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label className="text-white text-lg font-medium">Aadhar Card</label>
          <input
            type="text"
            placeholder="Enter Aadhar card details"
            className="p-4 rounded-full bg-transparent border border-white text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        <div className="flex flex-col space-y-3">
          <label className="text-white text-lg font-medium">Phone Number</label>
          <input
            type="tel"
            placeholder="+91"
            className="p-4 rounded-full bg-transparent border border-white text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
          />
        </div>

        <div>
        <button class="w-full py-3 rounded-full bg-gradient-to-r from-green-900 to-green-600 text-white font-semibold shadow-lg hover:shadow-[0_0_20px_#FFD700] transition-all">
          Sign Up
        </button>

        </div>
      </form>
    </div>
  );
}

export default App;
