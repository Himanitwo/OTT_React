import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaCompass,
  FaCog,
  FaSignInAlt,
  FaBell,
  FaPhone,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const SidebarItem = ({ to, Icon, label, isExpanded }) => (
  <li>
    <Link
      to={to}
      className="group flex items-center space-x-4 p-2 text-white rounded-lg hover:bg-white/10 transition-colors duration-300"
    >
      <div className="min-w-[2rem] flex justify-center">
        <Icon className="text-xl group-hover:text-gray-300 drop-shadow-md" />
      </div>
      {isExpanded && (
        <span className="transition-opacity duration-300 whitespace-nowrap group-hover:text-gray-300 drop-shadow-md">
          {label}
        </span>
      )}
    </Link>
  </li>
);

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      navigate("/loginpage");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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
        <ul className="space-y-4 font-medium flex-1">
          <SidebarItem to="/" Icon={FaHome} label="Homepage" isExpanded={isExpanded} />
          <SidebarItem to="/explore" Icon={FaCompass} label="Explore" isExpanded={isExpanded} />
          <SidebarItem to="/setting" Icon={FaCog} label="Settings" isExpanded={isExpanded} />
          <SidebarItem to="/subscription" Icon={FaBell} label="Subscribe" isExpanded={isExpanded} />
          <SidebarItem to="/contact" Icon={FaPhone} label="Contact us" isExpanded={isExpanded} />
          <SidebarItem to="/vediocall" Icon={FaPhone} label="Video Call" isExpanded={isExpanded} />

          {user && (
            <>
              {/* <SidebarItem to="/dashboard" Icon={FaTachometerAlt} label="Dashboard" isExpanded={isExpanded} /> */}
              <li>
                <button
                  onClick={handleLogout}
                  className="group flex items-center space-x-4 p-2 text-white rounded-lg hover:bg-white/10 transition-colors duration-300 w-full text-left"
                >
                  <div className="min-w-[2rem] flex justify-center">
                    <FaSignOutAlt className="text-xl group-hover:text-gray-300 drop-shadow-md" />
                  </div>
                  {isExpanded && (
                    <span className="transition-opacity duration-300 whitespace-nowrap group-hover:text-gray-300 drop-shadow-md">
                      Logout
                    </span>
                  )}
                </button>
              </li>
            </>
          )}
        </ul>

        {/* Profile or Login (at bottom) */}
       <div className="p-2 mt-auto">
  {user ? (
    <Link
      to="/dashboard"
      className="flex items-center space-x-3 group hover:bg-white/10 rounded-lg p-2 transition-colors duration-300"
    >
      <img
        src={user.photoURL || "https://randomuser.me/api/portraits/men/32.jpg"}
        alt="Profile"
        className="w-8 h-8 rounded-full"
      />
      {isExpanded && (
        <span className="text-white font-semibold group-hover:text-gray-300">
          {user.email}
        </span>
      )}
    </Link>
  ) : (
    <SidebarItem to="/loginpage" Icon={FaSignInAlt} label="Login" isExpanded={isExpanded} />
  )}
</div>


      </div>
    </aside>
  );
};

export default Sidebar;
