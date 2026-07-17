import axios from "axios";
import React, { useContext, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineSearch, HiOutlineFilter, HiOutlineCalendar, HiOutlineLocationMarker, HiOutlinePlus, HiOutlineCheckCircle, HiOutlineClock } from "react-icons/hi";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

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
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    showMyEvents: false,
  });

  const handleJoinEvent = async (eventId, e) => {
    e.preventDefault();
    if (!token) {
      toast.info("Please login to join");
      navigate("/login");
      return;
    }

    try {
      setIsJoining(true);
      const res = await axios.post(
        `${backendUrl}/api/event/join/${eventId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Joined successfully!");
        fetchAllEvents();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to join");
    } finally {
      setIsJoining(false);
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.location.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !filters.category || event.category === filters.category;
      
      const isCreator = userData && (
        (typeof event.createdBy === 'object' ? event.createdBy._id === userData._id : event.createdBy === userData._id)
      );
      
      const matchesMyEvents = !filters.showMyEvents || isCreator;
      
      return matchesSearch && matchesCategory && matchesMyEvents;
    }).sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        const now = new Date();
        const isPastA = dateA < now;
        const isPastB = dateB < now;
        if (isPastA && !isPastB) return 1;
        if (!isPastA && isPastB) return -1;
        return dateA - dateB;
    });
  }, [events, searchQuery, filters, userData]);

  const categories = ["Environmental", "Education", "Hunger Relief", "Community Support", "Healthcare", "Animal Welfare", "Other"];

  return (
    <PageWrapper>
      <div className="min-h-screen pb-20">
        {/* Header & Search */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-30 pt-8 pb-6">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">Explore Events</h1>
              <p className="text-slate-500 font-medium">Find your next opportunity to make an impact</p>
            </div>
            <Link
              to="/create-event"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
            >
              <HiOutlinePlus size={20} /> Create Event
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-grow relative">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search by title or location..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              <select
                className="px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-600 min-w-[160px]"
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              
              {isLoggedIn && (
                <button
                  onClick={() => setFilters({...filters, showMyEvents: !filters.showMyEvents})}
                  className={`px-6 py-4 rounded-2xl font-bold transition-all whitespace-nowrap ${
                    filters.showMyEvents ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600"
                  }`}
                >
                  My Events
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-10 mt-12">
        {loadingEvents ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-96 bg-slate-100 rounded-[32px] animate-pulse" />)}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <HiOutlineFilter size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">No events found</h3>
            <p className="text-slate-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredEvents.map((event, idx) => {
                const isJoined = userData && event.participants?.some(p => (typeof p === 'object' ? p._id === userData._id : p === userData._id));
                const isFull = (event.participants?.length || 0) >= event.maxParticipants;
                const isCreator = userData && (
                    (typeof event.createdBy === 'object' ? event.createdBy._id === userData._id : event.createdBy === userData._id)
                );
                
                return (
                  <motion.div
                    layout
                    key={event._id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group bg-white rounded-[32px] border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all flex flex-col"
                  >
                    <div className="p-8 flex flex-col h-full">
                      <div className="flex justify-between items-start mb-6">
                        <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                          {event.category}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          {isJoined && (
                            <div className="text-green-500 flex items-center gap-1 text-xs font-bold">
                              <HiOutlineCheckCircle size={18} /> Joined
                            </div>
                          )}
                          {isCreator && (
                            <div className="text-blue-500 flex items-center gap-1 text-[10px] font-black uppercase">
                              Your Event
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight line-clamp-2 min-h-[4rem]">
                        {event.title}
                      </h3>
                      
                      <p className="text-slate-500 text-sm line-clamp-2 mb-6 leading-relaxed flex-grow">
                        {event.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="flex items-center gap-3 text-slate-600 font-semibold text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <HiOutlineCalendar className="text-blue-500 shrink-0" size={18} />
                          <span className="truncate">{new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-600 font-semibold text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <HiOutlineClock className="text-blue-500 shrink-0" size={18} />
                          <span className="truncate">{event.startTime}</span>
                        </div>
                        <div className="col-span-2 flex items-center gap-3 text-slate-600 font-semibold text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <HiOutlineLocationMarker className="text-blue-500 shrink-0" size={18} />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex justify-between items-end mb-2">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Capacity</span>
                          <span className="text-sm font-bold text-slate-900">{event.participants?.length || 0} / {event.maxParticipants}</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${((event.participants?.length || 0) / event.maxParticipants) * 100}%` }}
                            className={`h-full rounded-full ${isFull ? 'bg-red-400' : 'bg-blue-600'}`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          to={`/events/${event._id}`}
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
