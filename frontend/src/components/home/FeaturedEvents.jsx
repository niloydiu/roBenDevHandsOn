"use client";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Appcontext } from "../../context/Appcontext";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";

const FeaturedEvents = () => {
  const { events, loadingEvents, userData, token, backendUrl } = useContext(Appcontext);
  const router = useRouter();
  const [userJoinedEvents, setUserJoinedEvents] = useState({});
  const [processingEvent, setProcessingEvent] = useState(null);

  const featuredEvents = (events || []).slice(0, 3);

  useEffect(() => {
    if (userData?.eventsJoined && Array.isArray(userData.eventsJoined)) {
      const joinedMap = {};
      userData.eventsJoined.forEach((eventId) => {
        const id = typeof eventId === "object" ? (eventId._id || eventId.id) : eventId;
        joinedMap[id] = true;
      });
      setUserJoinedEvents(joinedMap);
    }
  }, [userData]);

  const hasUserJoinedEvent = (eventId) => !!userJoinedEvents[eventId];

  const handleJoinEvent = async (eventId) => {
    if (!token) {
      toast.info("Please login to join this event");
      router.push("/login");
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

  if (loadingEvents) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-80 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 animate-pulse" />
      ))}
    </div>
  );

  if (featuredEvents.length === 0) return (
    <div className="p-8 text-center border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50 dark:bg-zinc-900/40">
      <p className="text-zinc-500 text-sm">No upcoming events scheduled right now.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {featuredEvents.map((event, idx) => {
        const eventId = event._id || event.id;
        const isJoined = hasUserJoinedEvent(eventId);
        
        return (
          <motion.div
            key={eventId}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            className="group card-saas flex flex-col justify-between h-full relative"
          >
            <div>
              {/* Category & Badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                  {event.category || "Community"}
                </span>

                <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                  <Users size={13} className="text-zinc-400" />
                  <span>{event.participants?.length || 0}/{event.maxParticipants || 20}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1 mb-2">
                {event.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-600 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-4">
                {event.description}
              </p>

              {/* Metadata */}
              <div className="space-y-2 py-3 border-y border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400">
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-zinc-400 shrink-0" />
                  <span className="truncate">
                    {new Date(event.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-zinc-400 shrink-0" />
                  <span className="truncate">{event.startTime || "09:00 AM"} - {event.endTime || "05:00 PM"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={13} className="text-zinc-400 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 mt-4 flex items-center gap-2">
              <Link
                href={`/events/${eventId}`}
                className="btn-saas btn-secondary !h-9 flex-1 text-center justify-center text-xs"
              >
                Details
              </Link>
              <button
                onClick={() => handleJoinEvent(eventId)}
                disabled={processingEvent === eventId}
                className={`btn-saas !h-9 flex-1 text-center justify-center text-xs ${
                  isJoined
                    ? "btn-outline border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    : "btn-primary"
                }`}
              >
                {processingEvent === eventId 
                  ? "..." 
                  : isJoined 
                    ? "Joined ✓" 
                    : "Join Event"
                }
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeaturedEvents;
