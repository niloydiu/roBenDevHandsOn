import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

const Navbar = () => {
  const { token, userData, setToken } = useContext(Appcontext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  return (
    <nav className="bg-primary text-gray-600 py-4 px-6 md:px-10 lg:px-20 rounded-lg shadow-lg mb-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold">HandsOn</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative overflow-hidden py-2 px-3
                hover:text-blue-500 transition-colors duration-300
                before:absolute before:top-0 before:left-0 before:w-full before:h-full
                before:bg-blue-100 before:opacity-50
                before:transform before:translate-x-[-100%]
                before:transition-transform before:duration-300 before:ease-in-out
                hover:before:translate-x-[0%]
                ${
                  isActive
                    ? "text-blue-500 font-bold border-b-2 border-blue-500"
                    : ""
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/events"
              className={({ isActive }) =>
                `relative overflow-hidden py-2 px-3
                hover:text-blue-500 transition-colors duration-300
                before:absolute before:top-0 before:left-0 before:w-full before:h-full
                before:bg-blue-100 before:opacity-50
                before:transform before:translate-x-[-100%]
                before:transition-transform before:duration-300 before:ease-in-out
                hover:before:translate-x-[0%]
                ${
                  isActive
                    ? "text-blue-500 font-bold border-b-2 border-blue-500"
                    : ""
                }`
              }
            >
              Events
            </NavLink>
            <NavLink
              to="/community-help"
              className={({ isActive }) =>
                `relative overflow-hidden py-2 px-3
                hover:text-blue-500 transition-colors duration-300
                before:absolute before:top-0 before:left-0 before:w-full before:h-full
                before:bg-blue-100 before:opacity-50
                before:transform before:translate-x-[-100%]
                before:transition-transform before:duration-300 before:ease-in-out
                hover:before:translate-x-[0%]
                ${
                  isActive
                    ? "text-blue-500 font-bold border-b-2 border-blue-500"
                    : ""
                }`
              }
            >
              Community Help
            </NavLink>
            {token && (
              <NavLink
                to="/teams"
                className={({ isActive }) =>
                  `relative overflow-hidden py-2 px-3
                  hover:text-blue-500 transition-colors duration-300
                  before:absolute before:top-0 before:left-0 before:w-full before:h-full
                  before:bg-blue-100 before:opacity-50
                  before:transform before:translate-x-[-100%]
                  before:transition-transform before:duration-300 before:ease-in-out
                  hover:before:translate-x-[0%]
                  ${
                    isActive
                      ? "text-blue-500 font-bold border-b-2 border-blue-500"
                      : ""
                  }`
                }
              >
                Teams
              </NavLink>
            )}
          </div>

          {/* Auth Buttons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {token ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 group"
                >
                  <span className="text-lg font-semibold text-gray-600">
                    {userData?.name || "User"}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 bg-white text-primary rounded-full font-medium hover:scale-105 transition-all duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2 border border-white text-gray-600 rounded-full hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-white text-primary rounded-full hover:scale-105 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 rounded-lg bg-gray-200 py-4">
              <div className="flex flex-col space-y-3 px-4">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `text-gray-600 py-2 hover:text-blue-500 hover:bg-gray-300 rounded-lg px-3 ${
                      isActive ? "text-blue-500 font-bold" : ""
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/events"
                  className={({ isActive }) =>
                    `text-gray-600 py-2 hover:text-blue-500 hover:bg-gray-300 rounded-lg px-3 ${
                      isActive ? "text-blue-500 font-bold" : ""
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Events
                </NavLink>
                <NavLink
                  to="/community-help"
                  className={({ isActive }) =>
                    `text-gray-600 py-2 hover:text-blue-500 hover:bg-gray-300 rounded-lg px-3 ${
                      isActive ? "text-blue-500 font-bold" : ""
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community Help
                </NavLink>
                {token && (
                  <>
                    <NavLink
                      to="/teams"
                      className={({ isActive }) =>
                        `text-gray-600 py-2 hover:text-blue-500 hover:bg-gray-300 rounded-lg px-3 ${
                          isActive ? "text-blue-500 font-bold" : ""
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Teams
                    </NavLink>
                    <NavLink
                      to="/profile"
                      className={({ isActive }) =>
                        `text-gray-600 py-2 hover:text-blue-500 hover:bg-gray-300 rounded-lg px-3 ${
                          isActive ? "text-blue-500 font-bold" : ""
                        }`
                      }
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </NavLink>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="text-gray-600 py-2 hover:text-blue-500 hover:bg-gray-300 rounded-lg px-3 text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
