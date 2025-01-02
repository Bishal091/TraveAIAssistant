import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  // Utility function to check if a link is active
  const isActiveLink = (path) => {
    return location.pathname === path;
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const closeMenu = (event) => {
      if (
        isMenuOpen &&
        !event.target.closest(".mobile-menu-button, .mobile-menu")
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("click", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, [isMenuOpen]);

  return (
    <header className="bg-gray-800 text-white shadow-lg left-0 w-full z-50 sticky top-0">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* Logo */}
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-white"
        >
          <Link to="/" className="hover:text-green-300">
            Travel AI Assistant
          </Link>
        </motion.h1>

        {/* Navigation */}
        <nav className="hidden md:flex items-stretch">
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex items-center gap-16"
          >
            <li>
              <Link
                to="/"
                className={`hover:text-white transition duration-300 ${
                  isActiveLink("/") ? "text-blue-500 hover:text-blue-600" : "text-gray-300"
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`hover:text-white transition duration-300 ${
                  isActiveLink("/about") ? "text-blue-500 hover:text-blue-600" : "text-gray-300"
                }`}
              >
                About
              </Link>
            </li>
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white p-2 py-[0.6vh] rounded-md hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    to="/login"
                    className={`hover:text-white transition duration-300 ${
                      isActiveLink("/login") ? "text-blue-500 hover:text-blue-600" : "text-gray-300"
                    }`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    to="/signup"
                    className={`hover:text-white transition duration-300 ${
                      isActiveLink("/signup")
                        ? "text-blue-500 hover:text-blue-600"
                        : "text-gray-300"
                    }`}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}
          </motion.ul>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-gray-300 hover:text-white focus:outline-none mobile-menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-full left-0 w-full bg-gray-900 shadow-md z-10 mobile-menu"
          >
            <ul className="flex flex-col items-center space-y-4 py-4">
              <li>
                <Link
                  to="/"
                  className={`hover:text-white transition duration-300 ${
                    isActiveLink("/") ? "text-blue-500 hover:text-blue-600" : "text-gray-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className={`hover:text-white transition duration-300 ${
                    isActiveLink("/about") ? "text-blue-500 hover:text-blue-600" : "text-gray-300"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              {isLoggedIn ? (
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="bg-red-600 text-white p-2 py-[0.6vh] rounded-md hover:bg-red-700 transition duration-300"
                  >
                    Logout
                  </button>
                </li>
              ) : (
                <>
                  <li>
                    <Link
                      to="/login"
                      className={`hover:text-white transition duration-300 ${
                        isActiveLink("/login")
                          ? "text-blue-500 hover:text-blue-600"
                          : "text-gray-300"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className={`hover:text-white transition duration-300 ${
                        isActiveLink("/signup")
                          ? "text-blue-500 hover:text-blue-600"
                          : "text-gray-300"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;