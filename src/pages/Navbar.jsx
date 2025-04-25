import React from "react";

const Navbar = () => {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-3 py-3 lg:px-5 lg:pl-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              type="button"
              className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden"
              onClick={() =>
                document.getElementById("logo-sidebar").classList.toggle("-translate-x-full")
              }
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zM2 15.25a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75z" />
              </svg>
            </button>
            <a href="/" className="flex ms-2">
              <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" />
              <span className="text-xl font-semibold text-gray-800 dark:text-white">
                Flowbite
              </span>
            </a>
          </div>
          <div className="flex items-center">
            <img
              className="w-8 h-8 rounded-full"
              src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              alt="User"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
