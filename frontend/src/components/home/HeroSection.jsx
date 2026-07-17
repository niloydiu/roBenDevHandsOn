import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Appcontext } from "../../context/Appcontext";
import { motion } from "framer-motion";
import { HiArrowRight, HiOutlineGlobe, HiOutlineUserGroup, HiOutlineShieldCheck } from "react-icons/hi";

const HeroSection = () => {
  const { isLoggedIn } = useContext(Appcontext);
  const navigate = useNavigate();

  const navigateToHelpRequests = () => {
    navigate("/community-help");
    setTimeout(() => {
      const element = document.getElementById("help-requests");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32 bg-slate-50/50 dark:bg-slate-950/20">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 dark:bg-blue-900/10 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 dark:bg-indigo-900/10 rounded-full blur-[120px] opacity-60 animate-pulse" />
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-800/30">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600 dark:bg-blue-400"></span>
                </span>
                Join 500+ Active Volunteers
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-slate-900 dark:text-white">
                Lend a <span className="text-blue-600 dark:text-blue-400">Hand</span>,<br />
                Shape a <span className="text-blue-600 dark:text-blue-400">Future</span>.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with local opportunities, build impactful teams, and track your social contribution in real-time. Join the community-driven movement that makes a difference.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isLoggedIn ? (
                  <button
                    onClick={navigateToHelpRequests}
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-750 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Explore Requests <HiArrowRight />
                  </button>
                ) : (
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-750 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 dark:shadow-none transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Start Volunteering <HiArrowRight />
                  </Link>
                )}
                <Link
                  to="/events"
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all flex items-center justify-center gap-2"
                >
                  Browse Events
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 pt-12 border-t border-slate-100 dark:border-slate-800/40">
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">1.2k+</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Events Held</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">$0</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Platform Fees</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900 dark:text-white">5k+</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">Hours Logged</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Side */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square"
            >
              {/* Decorative Background Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-100 dark:bg-yellow-950/20 rounded-3xl -z-10 rotate-12 blur-sm" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 dark:bg-blue-950/20 rounded-3xl -z-10 -rotate-12 blur-sm" />

              {/* Main Image Graphic Container */}
              <div className="w-full h-full glass rounded-[40px] p-4 shadow-2xl overflow-hidden relative group">
                <img 
                  src="/hero_volunteer_graphic.jpg" 
                  alt="HandsOn Community Volunteers" 
                  className="w-full h-full object-cover rounded-[32px] transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Visual Glassmorphic Indicators Overlaid */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="absolute bottom-8 left-8 right-8 p-4 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-slate-800/40 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0">
                    <HiOutlineGlobe size={20} />
                  </div>
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white text-sm">Empowering Local Neighborhoods</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Join a Team • Make Impact</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
