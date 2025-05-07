import React from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaCompass,
  FaCog,
  FaSignInAlt,
  FaBell,
  FaPhone,
  FaUser,
  FaTachometerAlt, // For Dashboard
} from "react-icons/fa";

const SidebarItem = ({ to, Icon, label, isExpanded }) => {
  return (
    <li>
      <Link
        to={to}
        className="group flex items-center space-x-4 p-2 text-white rounded-lg hover:bg-white/10 transition-colors duration-300"
      >
        <div className="min-w-[2rem] flex justify-center">
          <Icon className="text-xl group-hover:text-yellow-300 drop-shadow-md" />
        </div>
        {isExpanded && (
          <span className="transition-opacity duration-300 whitespace-nowrap group-hover:text-yellow-300 drop-shadow-md">
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
      } transition-all duration-300 
        bg-white/10 backdrop-blur-xl backdrop-saturate-150
        border-r border-white/20 shadow-lg overflow-hidden`}
    >
      <div className="h-full flex flex-col px-3 pt-20 pb-4">
        {/* Navigation */}
        <ul className="space-y-4 font-medium flex-1">
          {/* <SidebarItem to="/dashboard" Icon={FaTachometerAlt} label="Dashboard" isExpanded={isExpanded} /> */}
          <SidebarItem to="/" Icon={FaHome} label="Homepage" isExpanded={isExpanded} />
          <SidebarItem to="/explore" Icon={FaCompass} label="Explore" isExpanded={isExpanded} />
          <SidebarItem to="/setting" Icon={FaCog} label="Settings" isExpanded={isExpanded} />
          <SidebarItem to="/loginpage" Icon={FaSignInAlt} label="Loginpage" isExpanded={isExpanded} />
          <SidebarItem to="/subscription" Icon={FaBell} label="Subscribe" isExpanded={isExpanded} />
          <SidebarItem to="/contact" Icon={FaPhone} label="Contact us" isExpanded={isExpanded} />
        </ul>

        {/* Profile at Bottom */}
        <div className="flex items-center space-x-3 p-2 mt-auto">
          <Link to="/dashboard">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg" // Replace with your own avatar path
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          </Link>
          {isExpanded && <span className="text-white font-semibold">Tom Cook</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
