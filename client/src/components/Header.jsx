import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiShoppingCart, FiUser } from "react-icons/fi";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../features/auth/authSlice";
import Button from "./Button";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart || { cartItems: [] });

  const handleSignIn = () => navigate("/sign-in");
  const handleSignOut = () => {
    dispatch(signOut());
    navigate("/");
    setProfileOpen(false);
  };

  const getLinkClass = ({ isActive }) =>
    `block hover:text-blue-500 transition-colors duration-300 ${
      isActive ? "text-blue-600 font-semibold" : "text-gray-800"
    }`;

  const AuthButton = () => {
    if (loading) return <Button>Loading...</Button>;
    return isAuthenticated ? (
      <Button variant="danger" onClick={handleSignOut}>
        Sign Out
      </Button>
    ) : (
      <Button variant="primary" onClick={handleSignIn}>
        Sign In
      </Button>
    );
  };

  return (
    <header className="bg-[#D9EAFD] fixed top-0 w-full z-50 backdrop-blur-xl shadow-md border-b border-white/20">
      <div className="container mx-auto flex justify-between items-center px-4 py-2">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Logo"
            className="h-14 w-14 object-cover rounded-full border-2 border-white/50 shadow-sm"
          />
          <span className="text-2xl font-bold text-gray-600 drop-shadow-sm">
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
        <div className="hidden md:flex items-center gap-5 relative">
          {/* Cart */}
          <NavLink to="/cart" className="relative group">
            <FiShoppingCart
              size={22}
              className="text-gray-800 hover:text-blue-500 transition-colors"
            />
            {cartItems?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5">
                {cartItems.length}
              </span>
            )}
          </NavLink>

          {/* Profile */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <FiUser className="text-gray-700" />
              </button>

              {/* Profile dropdown */}
              <AnimatePresence>
                {profileOpen && (
                  <Motion.div
                    key="profile-menu"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50"
                  >
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/my-properties"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50"
                      onClick={() => setProfileOpen(false)}
                    >
                      My Properties
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      Sign Out
                    </button>
                  </Motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <AuthButton />
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="text-gray-800 hover:text-blue-500 transition-colors duration-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            aria-label="Toggle menu"
          >
            {menuOpen ? <FiX size={28} /> : <FiMenu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <Motion.div
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white/90 backdrop-blur-xl border-t border-gray-200 shadow-inner overflow-hidden"
          >
            <ul className="flex flex-col space-y-4 p-5">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={getLinkClass}
                  onClick={() => setMenuOpen(false)}
                  end={item.path === "/properties"}
                >
                  {item.name}
                </NavLink>
              ))}

              {/* Cart */}
              <NavLink
                to="/cart"
                className="flex items-center gap-2 text-gray-800 hover:text-blue-500"
                onClick={() => setMenuOpen(false)}
              >
                <FiShoppingCart /> Cart
                {cartItems?.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 rounded-full">
                    {cartItems.length}
                  </span>
                )}
              </NavLink>

              {/* Profile/Auth */}
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    className="text-gray-800 hover:text-blue-500"
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to="/my-properties"
                    className="text-gray-800 hover:text-blue-500"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Properties
                  </NavLink>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="text-red-500 text-left hover:text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <NavLink
                  to="/sign-in"
                  className="text-blue-600 font-medium hover:underline"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </NavLink>
              )}
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
