import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full sm:translate-x-0 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          <li><Link to="/" className="flex items-center p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Homepage</Link></li>
          <li><Link to="/explore" className="flex items-center p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Explore</Link></li>
          <li><Link to="/setting" className="flex items-center p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Settings</Link></li>
          <li><Link to="/loginpage" className="flex items-center p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">Loginpage</Link></li>
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
