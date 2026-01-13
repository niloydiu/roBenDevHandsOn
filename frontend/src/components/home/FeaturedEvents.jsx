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
      case "environment": return "bg-green-50 text-green-600 border-green-100";
      case "education": return "bg-blue-50 text-blue-600 border-blue-100";
      case "healthcare": return "bg-red-50 text-red-600 border-red-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  if (loadingEvents) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-[400px] rounded-3xl bg-slate-100 animate-pulse" />
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
          className="group bg-white rounded-[32px] overflow-hidden border border-slate-100 hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 flex flex-col h-full"
        >
          {/* Image/Header Area */}
          <div className="h-48 relative overflow-hidden bg-slate-100">
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
            
            {/* Fallback pattern if no image */}
            <div className="absolute inset-0 bg-blue-600 flex items-center justify-center">
              <span className="text-white/20 text-8xl font-black select-none">
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
            <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
              {event.description}
            </p>

            <div className="space-y-3 mb-8 flex-grow">
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600">
                  <HiOutlineCalendar size={18} />
                </div>
                <span className="text-sm font-medium">
                  {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600">
                  <HiOutlineClock size={18} />
                </div>
                <span className="text-sm font-medium">{event.startTime} - {event.endTime}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-blue-600">
                  <HiOutlineLocationMarker size={18} />
                </div>
                <span className="text-sm font-medium truncate">{event.location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              <div className="flex -space-x-2">
                {[...Array(Math.min(3, event.participants?.length || 0))].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white" />
                ))}
                {event.participants?.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-blue-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-600">
                    +{event.participants.length - 3}
                  </div>
                )}
              </div>
              <div className="text-xs font-semibold text-slate-400">
                {event.participants?.length || 0}/{event.maxParticipants} slots
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link
                to={`/events/${event._id}`}
                className="flex-[0.4] py-3 text-center text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
              >
                Details
              </Link>
              <button
                onClick={() => handleJoinEvent(event._id)}
                disabled={processingEvent === event._id}
                className={`flex-1 py-3 rounded-2xl text-sm font-bold transition-all ${
                  hasUserJoinedEvent(event._id)
                    ? "bg-slate-100 text-slate-900"
                    : "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-95"
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
