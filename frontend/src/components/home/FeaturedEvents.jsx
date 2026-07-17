import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Appcontext } from "../../context/Appcontext";
import { motion } from "framer-motion";
import { HiOutlineCalendar, HiOutlineClock, HiOutlineLocationMarker, HiOutlineUserGroup, HiOutlineArrowRight } from "react-icons/hi";
import { toast } from "react-toastify";

const FeaturedEvents = () => {
  const { events, loadingEvents, userData, token, backendUrl } = useContext(Appcontext);
  const navigate = useNavigate();
  const [userJoinedEvents, setUserJoinedEvents] = useState({});
  const [processingEvent, setProcessingEvent] = useState(null);

  const featuredEvents = events.slice(0, 3);

  useEffect(() => {
    if (userData?.eventsJoined && Array.isArray(userData.eventsJoined)) {
      const joinedMap = {};
      userData.eventsJoined.forEach((eventId) => {
        const id = typeof eventId === "object" ? eventId._id : eventId;
        joinedMap[id] = true;
      });
      setUserJoinedEvents(joinedMap);
    }
  }, [userData]);

  const hasUserJoinedEvent = (eventId) => !!userJoinedEvents[eventId];

  const handleJoinEvent = async (eventId) => {
    if (!token) {
      toast.info("Please login to join this event");
      navigate("/login");
      return;
    }

    try {
      setProcessingEvent(eventId);
      const isJoined = hasUserJoinedEvent(eventId);
      const endpoint = isJoined
        ? `${backendUrl}/api/event/leave/${eventId}`
        : `${backendUrl}/api/event/join/${eventId}`;

      const response = await axios.post(endpoint, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setUserJoinedEvents((prev) => {
          const updated = { ...prev };
          if (isJoined) delete updated[eventId];
          else updated[eventId] = true;
          return updated;
        });
        toast.success(isJoined ? "Left event" : "Joined event!");
      } else {
        toast.error(response.data.message || "Failed");
      }
    } catch (error) {
      toast.error("Operation failed. Try again.");
    } finally {
      setProcessingEvent(null);
    }
  };

  const getCategoryTheme = (category) => {
    switch (category?.toLowerCase()) {
      case "environment": return "bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/40";
      case "education": return "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40";
      case "healthcare": return "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/40";
      default: return "bg-slate-50 dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-850";
    }
  };

  if (loadingEvents) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-[400px] rounded-3xl bg-slate-100 dark:bg-slate-900 animate-pulse" />
      ))}
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {featuredEvents.map((event, idx) => (
        <motion.div
          key={event._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          className="group bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800/40 hover:border-blue-100 dark:hover:border-blue-900/50 hover:shadow-2xl hover:shadow-blue-500/10 dark:hover:shadow-none transition-all duration-500 flex flex-col h-full"
        >
          {/* Image/Header Area */}
          <div className="h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-850">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            
            {/* Fallback pattern if no image */}
            <div className="absolute inset-0 bg-blue-600 dark:bg-indigo-950/50 flex items-center justify-center">
              <span className="text-white/20 dark:text-white/5 text-8xl font-black select-none">
                {event.category?.charAt(0) || "V"}
              </span>
            </div>

            <div className="absolute top-4 left-4 z-20">
              <span className={`px-4 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${getCategoryTheme(event.category)}`}>
                {event.category}
              </span>
            </div>
            
            <div className="absolute bottom-4 left-6 right-6 z-20">
              <h3 className="text-xl font-bold text-white leading-tight">
                {event.title}
              </h3>
            </div>
          </div>

          <div className="p-6 flex flex-col flex-grow">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 line-clamp-2 leading-relaxed">
              {event.description}
            </p>

            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-455">
                  <HiOutlineCalendar size={18} />
                </div>
                <span className="text-sm font-medium">
                  {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-455">
                  <HiOutlineClock size={18} />
                </div>
                <span className="text-sm font-medium">{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-blue-600 dark:text-blue-455">
                  <HiOutlineLocationMarker size={18} />
                </div>
                <span className="text-sm font-medium truncate">{event.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/40">
              <div className="flex -space-x-2">
                {[...Array(Math.min(3, event.participants?.length || 0))].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900" />
                ))}
                {event.participants?.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-950/40 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    +{event.participants.length - 3}
                  </div>
                )}
              </div>
              <div className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {event.participants?.length || 0}/{event.maxParticipants} slots
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                to={`/events/${event._id}`}
                className="flex-[0.4] py-3 text-center text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Details
              </Link>
              <button
                onClick={() => handleJoinEvent(event._id)}
                disabled={processingEvent === event._id}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                  hasUserJoinedEvent(event._id)
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-none active:scale-95"
                }`}
              >
                {processingEvent === event._id ? "..." : hasUserJoinedEvent(event._id) ? "Leave" : "Join Now"}
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FeaturedEvents;
