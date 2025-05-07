import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-black-600  text-white">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center p-2 text-white rounded-lg sm:hidden"
              onClick={() =>
                document.getElementById("logo-sidebar").classList.toggle("-translate-x-full")
              }
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zM2 15.25a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75z" />
              </svg>
            </button>
            <a href="/" className="flex ms-2 text-lg font-semibold text-white">
              {/* Logo / Brand */}
              {/* Marathi Play */}
            </a>
          </div>
          {/* <div className="flex items-center">
            <Link to="/dashboard">
              <img
                className="w-8 h-8 rounded-full border-2 border-white cursor-pointer"
                src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                alt="User"
              />
            </Link>
          </div> */}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
