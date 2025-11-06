import React from "react";
import { NavLink } from "react-router-dom";
import { FiMenu, FiX, FiShoppingCart, FiUser } from "react-icons/fi";
import logo from "../assets/logo.jpg";
const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
  { name: "Buy", path: "/properties/buy" },
  { name: "Rent", path: "/properties/rent" },
  { name: "Sale", path: "/properties/sale" },
  { name: "All", path: "/properties" },
];
const Header = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const getLinkClass = ({ isActive }) =>
    `block hover:text-blue-500 transition-colors duration-300 ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-800"
    }`;
  return (
    <header className="bg-[#D9EAFD] fixed top-0 w-full z-50 backdrop-blur-xl shadow-md border-b border-white/20 ">
      <div className=" container mx-auto flex justify-between items-center px-4 py-2">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="w-14 h-14 object-cover rounded-full border-2 border-white/50 shadow-sm "
          />
          <span className="text-2xl font-bold text-gray-600 drop-shadow-sm">
            {" "}
            Real Estate
          </span>
        </NavLink>
        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <li
              key={item.name}
              className="list-none transform transition-transform duration-200 hover:scale-105 will-change-transform"
            >
              <NavLink
                to={item.path}
                className={getLinkClass}
                end={item.path === "/properties"}
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* Right Section */}
        <div>
          {/* cart */}
          <NavLink to="cart" className="">
            <FiShoppingCart
              size={22}
              className="text-gray-800 hover:text-blue-500 transition-colors"
            />
          </NavLink>
          {/* profile dropdown */}
          <div>
            <button
              onClick={() => setProfileOpen((prev) => !prev)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <FiUser className="text-gray-700" />
            </button>
            {profileOpen && (
                
            )}
          </div>
        </div>

        {/*  */}
      </div>
    </header>
  );
};

export default Header;
