import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3, HiOutlineX, HiOutlineUser, HiOutlineLogout, HiOutlineLogin, HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { token, userData, setToken } = useContext(Appcontext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  const navLinks = [
    { name: "Feed", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Action", path: "/community-help" },
    ...(token ? [{ name: "Chat", path: "/chat" }] : []),
    { name: "Support", path: "/support" },
    ...(token ? [{ name: "Teams", path: "/teams" }] : []),
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4' : 'py-6'}`}>
      <div className="container mx-auto px-4 md:px-10 lg:px-20">
        <div className={`relative flex justify-between items-center transition-all duration-500 rounded-[32px] px-8 py-4 ${scrolled ? 'bg-white dark:bg-slate-900 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-transparent dark:border-slate-800/40' : 'bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-slate-800/30 shadow-sm'}`}>
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-emerald-600 dark:bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:bg-emerald-750 transition-colors">
              H
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter">HandsOn</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  px-5 py-2.5 rounded-2xl text-[13px] font-black uppercase tracking-widest transition-all
                  ${isActive ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Auth & Theme Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-2xl transition-all cursor-pointer"
              title="Toggle Theme"
            >
              {theme === "light" ? <HiOutlineMoon size={20} /> : <HiOutlineSun size={20} />}
            </button>
            {token ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-2xl transition-all border border-slate-100 dark:border-slate-700 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-slate-700 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase overflow-hidden">
                    {userData?.avatar ? <img src={userData.avatar} className="w-full h-full object-cover" /> : userData?.name?.charAt(0) || <HiOutlineUser />}
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-slate-200 tracking-tight">{userData?.name?.split(' ')[0] || "Profile"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all cursor-pointer"
                  title="Logout"
                >
                  <HiOutlineLogout size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-6 py-2.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-black text-[13px] uppercase tracking-widest transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-3 bg-emerald-600 text-white rounded-2xl font-black text-[13px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-3 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 rounded-2xl transition-all cursor-pointer"
            >
              {theme === "light" ? <HiOutlineMoon size={18} /> : <HiOutlineSun size={18} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 flex items-center justify-center bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl transition-all active:scale-95 cursor-pointer"
            >
              {isMenuOpen ? <HiOutlineX size={24} /> : <HiOutlineMenuAlt3 size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-[99] md:hidden"
          >
            <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-2xl border border-slate-100 dark:border-slate-800/40 overflow-hidden">
              <div className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) => `
                      px-6 py-4 rounded-[20px] text-sm font-black uppercase tracking-widest transition-all flex items-center justify-between
                      ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}
                    `}
                  >
                    {link.name}
                    {link.path === location.pathname && <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 shadow-lg shadow-emerald-400" />}
                  </NavLink>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                {token ? (
                  <div className="space-y-3">
                    <Link
                      to="/profile"
                      className="flex items-center justify-between px-6 py-4 bg-emerald-600 text-white rounded-[24px] font-black text-sm uppercase tracking-widest"
                    >
                      My Dashboard <HiOutlineUser size={18} />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full px-6 py-4 text-red-500 font-black text-sm uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 rounded-[24px] transition-all cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link
                      to="/login"
                      className="px-6 py-4 text-center text-slate-600 dark:text-slate-400 font-black text-xs uppercase tracking-widest bg-slate-50 dark:bg-slate-800 rounded-[20px]"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="px-6 py-4 text-center bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-[20px]"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
