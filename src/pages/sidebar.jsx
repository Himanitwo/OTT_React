import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCompass, FaCog, FaSignInAlt } from "react-icons/fa";

const SidebarItem = ({ to, Icon, label, isExpanded }) => {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center space-x-4 p-2 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
      >
        <div className="min-w-[2rem] flex justify-center">
          <Icon className="text-xl text-gray-900 dark:text-white" />
        </div>
        {/* Show label only if sidebar is expanded */}
        {isExpanded && (
          <span className="transition-opacity duration-300 whitespace-nowrap">
            {label}
          </span>
        )}
      </Link>
    </li>
  );
};

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  return (
    <aside
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed top-0 left-0 z-40 h-screen ${
        isExpanded ? "w-64" : "w-16"
      } transition-all duration-300 bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden`}
    >
      <div className="h-full px-3 pt-20 pb-4 overflow-y-auto">
        <ul className="space-y-2 font-medium">
          <SidebarItem to="/" Icon={FaHome} label="Homepage" isExpanded={isExpanded} />
          <SidebarItem to="/explore" Icon={FaCompass} label="Explore" isExpanded={isExpanded} />
          <SidebarItem to="/setting" Icon={FaCog} label="Settings" isExpanded={isExpanded} />
          <SidebarItem to="/loginpage" Icon={FaSignInAlt} label="Loginpage" isExpanded={isExpanded} />
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
