import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCompass, FaCog, FaSignInAlt } from "react-icons/fa";

const SidebarItem = ({ to, Icon, label, isExpanded }) => {
  return (
    <li>
      <Link
        to={to}
        className="flex items-center space-x-8 p-2 text-white hover:bg-teal-700 hover:text-yellow-300"
      >
        <div className="min-w-[2rem] flex justify-center">
          <Icon className="text-xl group-hover:text-yellow-300" />
        </div>
        {isExpanded && (
          <span className="transition-opacity duration-300 whitespace-nowrap group-hover:text-yellow-300">
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
      } transition-all duration-300 bg-teal-600 border-r border-yellow-400 overflow-hidden`}
    >
      <div className="h-full px-3 pt-20 pb-4 overflow-y-auto">
        <ul className="space-y-8 font-medium">
          <SidebarItem to="/" Icon={FaHome} label="Homepage" isExpanded={isExpanded} />
          <SidebarItem to="/explore" Icon={FaCompass} label="Explore" isExpanded={isExpanded} />
          <SidebarItem to="/setting" Icon={FaCog} label="Settings" isExpanded={isExpanded} />
          <SidebarItem to="/loginpage" Icon={FaSignInAlt} label="Loginpage" isExpanded={isExpanded} />
          {/* <SidebarItem to="/subscription" Icon={FaSignInAlt} label="Subscribe" isExpanded={isExpanded} />
          <SidebarItem to="/watchlist" Icon={FaSignInAlt} label="Watchlist" isExpanded={isExpanded} /> */}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
