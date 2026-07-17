import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CommunityRequests from "../components/home/CommunityRequests";
import FeaturedEvents from "../components/home/FeaturedEvents";
import HeroSection from "../components/home/HeroSection";
import { HiOutlineArrowRight, HiOutlineUserGroup, HiOutlineCalendar, HiOutlineHeart } from "react-icons/hi2";
import PageWrapper from "../components/PageWrapper";

const Home = () => {
  return (
    <PageWrapper>
      <div className="space-y-0">
      <HeroSection />

      {/* Stats / Proof Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Volunteers", val: "2,400+", color: "text-blue-600" },
              { label: "Hours Donated", val: "15k+", color: "text-green-600" },
              { label: "Impact Projects", val: "450+", color: "text-orange-600" },
              { label: "Lives Touched", val: "10k+", color: "text-purple-600" },
            ].map((stat, i) => (
              <div key={i} className="text-center group">
                <div className={`text-3xl md:text-4xl font-black ${stat.color} mb-1 transition-transform group-hover:scale-110`}>
                  {stat.val}
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="section-padding bg-slate-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-50/50 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 lg:px-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest mb-4"
              >
                <HiOutlineCalendar /> Upcoming Opportunities
              </motion.div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Make an impact <br />in your <span className="text-blue-600">Neighborhood</span>.
              </h2>
            </div>
            <Link
              to="/events"
              className="group flex items-center gap-2 text-blue-600 font-bold hover:gap-4 transition-all"
            >
              See all events <HiOutlineArrowRight />
            </Link>
          </div>
          <FeaturedEvents />
        </div>
      </section>

      {/* Community Help Requests */}
      <section className="section-padding bg-white">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 sticky top-32">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-widest mb-4">
                  <HiOutlineHeart /> Direct Mutual Aid
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 font-display">
                  Hearts needing <br />a <span className="text-blue-600">Helping Hand</span>.
                </h2>
                <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                  Real people, real needs. Sometimes the biggest impact starts with a simple grocery run or a few hours of mentorship. Browse requests from your immediate community.
                </p>
                <Link
                  to="/community-help"
                  className="inline-flex items-center justify-center p-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all gap-2 shadow-xl shadow-slate-200"
                >
                  Post a Request <HiOutlineArrowRight />
                </Link>
              </motion.div>
            </div>
            <div className="lg:col-span-7" id="help-requests">
              <CommunityRequests />
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / CTA Card */}
      <section className="section-padding bg-slate-50">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="bg-blue-600 rounded-[48px] p-8 md:p-16 lg:p-20 relative overflow-hidden shadow-2xl shadow-blue-200">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />

            <div className="max-w-4xl relative z-10">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[1.1]">
                Ready to build a <br />stronger community?
              </h2>
              <p className="text-blue-100 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
                Join our network of Change Makers. Whether you want to lead a team or just donate an hour, every action counts. 
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 px-8 py-5 rounded-2xl font-black text-center transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                >
                  Create Your Free Account
                </Link>
                <Link
                  to="/teams"
                  className="bg-blue-700/50 text-white border border-blue-400/30 backdrop-blur-sm px-8 py-5 rounded-2xl font-black text-center transition-all hover:bg-blue-700"
                >
                  Browse Volunteering Teams
                </Link>
              </div>
            </div>
            
            {/* Float icon */}
            <motion.div 
              animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute right-20 top-1/2 -translate-y-1/2 hidden lg:flex w-40 h-40 bg-white/10 backdrop-blur-xl rounded-[40px] items-center justify-center text-white/40"
            >
              <HiOutlineUserGroup size={80} />
            </motion.div>
          </div>
        </div>
      </section>
      </div>
    </PageWrapper>
  );
};

export default Home;
