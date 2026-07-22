"use client";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Appcontext } from "../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Menu, X, User, LogOut, Heart, ArrowRight } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { token, userData, setToken } = useContext(Appcontext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(false);
    router.push("/login");
  };

  const navLinks = [
    { name: "Feed", path: "/" },
    { name: "Events", path: "/events" },
    { name: "Mutual Aid", path: "/community-help" },
    ...(token ? [{ name: "Teams", path: "/teams" }] : []),
    ...(token ? [{ name: "Chat", path: "/chat" }] : []),
    { name: "Support", path: "/support" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-200 border-b ${
        scrolled 
          ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-zinc-200/80 dark:border-zinc-800/80 shadow-xs py-2.5" 
          : "bg-white/60 dark:bg-zinc-950/60 backdrop-blur-sm border-zinc-200/40 dark:border-zinc-800/40 py-3"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-md bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs group-hover:bg-emerald-700 dark:group-hover:bg-emerald-400 transition-colors">
              H
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-white leading-none">
                HandsOn
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide">Volunteer Network</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <Link
                  key={link.path}
                  href={link.path}
                  className={`
                    px-3.5 py-1.5 rounded-md text-[13.5px] font-medium transition-colors relative
                    ${isActive 
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50/80 dark:bg-emerald-950/40' 
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/50'
                    }
                  `}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action & Theme Controls */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center transition-colors cursor-pointer"
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>

            {token ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors text-xs font-medium text-zinc-900 dark:text-zinc-200"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold overflow-hidden">
                    {userData?.avatar ? <img src={userData.avatar} className="w-full h-full object-cover" /> : userData?.name?.charAt(0) || <User size={12} />}
                  </div>
                  <span className="truncate max-w-[100px]">{userData?.name?.split(' ')[0] || "Profile"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-8 h-8 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="px-3.5 py-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="btn-saas btn-primary text-xs !h-8 !px-3.5"
                >
                  Join Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="w-8 h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 flex items-center justify-center cursor-pointer"
            >
              {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-8 h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 flex items-center justify-center cursor-pointer"
            >
              {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden px-4 py-4 space-y-3"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`
                      px-3.5 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-between
                      ${isActive ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-semibold' : 'text-zinc-600 dark:text-zinc-400'}
                    `}
                  >
                    {link.name}
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
              {token ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href="/profile"
                    className="btn-saas btn-outline w-full justify-between"
                  >
                    <span>My Profile</span>
                    <User size={15} />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="btn-saas text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 w-full justify-between border border-red-200/40 dark:border-red-900/30"
                  >
                    <span>Sign Out</span>
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/login" className="btn-saas btn-secondary text-center justify-center">
                    Login
                  </Link>
                  <Link href="/signup" className="btn-saas btn-primary text-center justify-center">
                    Join Now
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
