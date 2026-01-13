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
    <section className="relative overflow-hidden pt-16 pb-20 lg:pt-24 lg:pb-32">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-60 animate-pulse" />
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
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                Join 500+ Active Volunteers
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-slate-900">
                Lend a <span className="text-blue-600">Hand</span>,<br />
                Shape a <span className="text-blue-600">Future</span>.
              </h1>
              <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Connect with local opportunities, build impactful teams, and track your social contribution in real-time. Join the community-driven movement that makes a difference.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                {isLoggedIn ? (
                  <button
                    onClick={navigateToHelpRequests}
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Explore Requests <HiArrowRight />
                  </button>
                ) : (
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    Start Volunteering <HiArrowRight />
                  </Link>
                )}
                <Link
                  to="/events"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Browse Events
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-8 mt-12 pt-12 border-t border-slate-100">
                <div>
                  <div className="text-3xl font-bold text-slate-900">1.2k+</div>
                  <div className="text-sm text-slate-500">Events Held</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">$0</div>
                  <div className="text-sm text-slate-500">Platform Fees</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-slate-900">5k+</div>
                  <div className="text-sm text-slate-500">Hours Logged</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Side */}
          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-square"
            >
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-yellow-100 rounded-3xl -z-10 rotate-12" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-100 rounded-3xl -z-10 -rotate-12" />

              {/* Main Illustration Placeholder */}
              <div className="w-full h-full glass rounded-[40px] p-8 flex flex-col justify-center gap-6 shadow-2xl overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 group-hover:opacity-0 transition-opacity" />
                
                {/* Visual Cards within Hero */}
                <motion.div 
                  whileHover={{ x: 10 }}
                  className="p-4 bg-white rounded-2xl shadow-lg border border-slate-50 flex items-center gap-4 relative z-10"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                    <HiOutlineGlobe size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm italic">"Planting hope, one tree at a time."</div>
                    <div className="text-xs text-slate-500">Eco-Warriors Team</div>
                  </div>
                </motion.div>

                <motion.div 
                   whileHover={{ x: -10 }}
                   className="p-4 bg-white rounded-2xl shadow-lg border border-slate-50 flex items-center gap-4 self-end relative z-10"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                    <HiOutlineUserGroup size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Community Kitchen</div>
                    <div className="text-xs text-slate-500">12 members joined today</div>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ x: 10 }}
                  className="p-4 bg-white rounded-2xl shadow-lg border border-slate-50 flex items-center gap-4 relative z-10"
                >
                   <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <HiOutlineShieldCheck size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">Help Request Filled</div>
                    <div className="text-xs text-slate-500">By Sarah M. 5 mins ago</div>
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
