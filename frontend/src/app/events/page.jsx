"use client";
import axios from "axios";
import React, { useContext, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Appcontext } from "../../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineFilter, HiOutlineCalendar, HiOutlineLocationMarker, HiOutlinePlus, HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi";
import { toast } from "react-toastify";
import PageWrapper from "../../components/PageWrapper";

function Events() {
  const {
    events,
    loadingEvents,
    token,
    backendUrl,
    userData,
    fetchAllEvents,
    isLoggedIn,
  } = useContext(Appcontext);
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    showMyEvents: false,
  });

  const handleJoinEvent = async (eventId, e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.info("Please login first");
      router.push("/login");
      return;
    }

    try {
      setIsJoining(true);
      const response = await axios.post(
        `${backendUrl}/api/event/join/${eventId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        toast.success("Welcome to the project!");
        fetchAllEvents();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join event");
    } finally {
      setIsJoining(false);
    }
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    return events.filter((event) => {
      const matchesSearch =
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !filters.category || event.category === filters.category;

      const matchesLocation =
        !filters.location ||
        event.location?.toLowerCase().includes(filters.location.toLowerCase());

      const matchesMyEvents =
        !filters.showMyEvents ||
        event.participants?.some(
          (p) => (typeof p === "object" ? p._id : p) === userData?._id
        ) ||
        (typeof event.creator === "object"
          ? event.creator._id
          : event.creator) === userData?._id;

      return (
        matchesSearch && matchesCategory && matchesLocation && matchesMyEvents
      );
    });
  }, [events, searchQuery, filters, userData]);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="container mx-auto px-4 lg:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">Initiatives</h1>
            <p className="text-white/60 font-semibold text-sm">Join active volunteer events and create a local impact.</p>
          </div>
          {isLoggedIn && (
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[20px] font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
            >
              <HiOutlinePlus size={20} /> Host Initiative
            </Link>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-10 mt-10">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-8 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative w-full lg:flex-1">
            <HiOutlineSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search initiatives by title or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl pl-14 pr-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-555 cursor-pointer appearance-none"
            >
              <option value="">All Categories</option>
              <option value="Environment">Environment</option>
              <option value="Education">Education</option>
              <option value="Food">Food</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Animals">Animals</option>
              <option value="Elderly">Elderly</option>
              <option value="Development">Development</option>
              <option value="Community">Community</option>
            </select>

            <input
              type="text"
              placeholder="Filter by city/location"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="bg-slate-50 border-none rounded-2xl px-6 py-4 font-bold text-sm focus:ring-2 focus:ring-blue-500"
            />

            {isLoggedIn && (
              <button
                onClick={() => setFilters({ ...filters, showMyEvents: !filters.showMyEvents })}
                className={`px-6 py-4 rounded-2xl font-bold text-sm transition-all border ${
                  filters.showMyEvents 
                  ? "bg-blue-50 border-blue-200 text-blue-600" 
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                My Schedule
              </button>
            )}
          </div>
        </div>

        {/* Loading / Empty States */}
        {loadingEvents ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Syncing with server...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="bg-white rounded-[40px] border border-slate-100 p-20 text-center shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <HiOutlineFilter size={36} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">No initiatives matched your filters</h3>
            <p className="text-slate-400 font-medium max-w-md mx-auto text-sm mb-8">Try adjusting your keywords, selecting all categories, or hosting a new event yourself.</p>
            <button 
              onClick={() => {
                setSearchQuery("");
                setFilters({ category: "", location: "", showMyEvents: false });
              }}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Events Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence>
              {filteredEvents.map((event) => {
                const isJoined = event.participants?.some(
                  (p) => (typeof p === "object" ? p._id : p) === userData?._id
                );
                const isFull = event.participants?.length >= event.maxParticipants;
                
                return (
                  <motion.div
                    key={event._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-350 flex flex-col group"
                  >
                    {/* Header visual representation based on category */}
                    <div className="h-4 bg-blue-600 shrink-0" />
                    
                    <div className="p-8 flex-grow flex flex-col">
                      <div className="flex items-center justify-between gap-4 mb-6">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 font-bold text-[10px] uppercase tracking-wider rounded-full">
                          {event.category}
                        </span>
                        {isJoined && (
                          <span className="flex items-center gap-1 text-green-600 font-bold text-xs">
                            <HiOutlineCheckCircle size={16} /> Attending
                          </span>
                        )}
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors leading-tight shrink-0">
                        {event.title}
                      </h3>

                      <p className="text-slate-500 font-medium text-sm mb-6 line-clamp-3 leading-relaxed flex-grow">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-8">
                        <div className="flex items-center gap-3 text-slate-600 font-semibold text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <HiOutlineCalendar className="text-blue-500 shrink-0" size={18} />
                          <span className="truncate">{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 font-semibold text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <HiOutlineClock className="text-blue-500 shrink-0" size={18} />
                          <span className="truncate">{event.startTime}</span>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          href={`/events/${event._id}`}
                          className="flex-1 py-4 text-center text-sm font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-all"
                        >
                          Details
                        </Link>
                        {!isJoined && (
                          <button
                            onClick={(e) => handleJoinEvent(event._id, e)}
                            disabled={isJoining || isFull}
                            className={`flex-[1.5] py-4 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95 ${
                              isFull 
                              ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed" 
                              : "bg-blue-600 text-white shadow-blue-200 hover:bg-blue-700"
                            }`}
                          >
                            {isFull ? "Full" : "Join Now"}
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
      </div>
    </PageWrapper>
  );
}

export default Events;
