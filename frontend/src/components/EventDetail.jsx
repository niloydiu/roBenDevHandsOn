"use client";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Appcontext } from "../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlineCalendar, 
  HiOutlineLocationMarker, 
  HiOutlineClock, 
  HiOutlineUserGroup, 
  HiOutlineArrowLeft,
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineCheckCircle,
  HiOutlineShieldCheck,
  HiOutlineEmojiHappy
} from "react-icons/hi";
import { toast } from "react-toastify";
import EventCompletion from "./EventCompletion";

function EventDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { token, backendUrl, userData, fetchAllEvents } = useContext(Appcontext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const userId = userData?._id || userData?.id;

  const isEventCreator = () => {
    if (!userData || !event || !event.createdBy) return false;
    const creatorId = typeof event.createdBy === "object" ? event.createdBy._id : event.createdBy;
    return String(creatorId) === String(userId);
  };

  const fetchEventDetail = async () => {
    try {
      setLoading(true);
      let response;
      try {
        response = await axios.get(`/api/event/${id}`);
      } catch (e) {
        response = await axios.get(`${backendUrl}/api/event/${id}`);
      }
      
      const eventData = response?.data?.success ? response.data.event : response?.data;
      if (eventData) {
        setEvent(eventData);

        if (userId && eventData.participants) {
          const isUserRegistered = eventData.participants.some(p => {
            const pId = typeof p === "object" ? (p.user?._id || p.user?.id || p.user || p._id) : p;
            return String(pId) === String(userId);
          });
          setIsRegistered(isUserRegistered);
        }
      } else {
        const remoteRes = await axios.get(`${backendUrl}/api/event/${id}`);
        setEvent(remoteRes.data.event || remoteRes.data);
      }
    } catch (err) {
      console.error("Error fetching event detail:", err);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id && backendUrl) fetchEventDetail();
  }, [id, backendUrl, userId]);

  const handleRegisterClick = async () => {
    if (!token) {
      toast.info("Please login to join this event");
      router.push("/login");
      return;
    }

    try {
      if (isRegistered) {
        await axios.post(`${backendUrl}/api/event/leave/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setIsRegistered(false);
        toast.success("Successfully left the event");
      } else {
        await axios.post(`${backendUrl}/api/event/join/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
        setIsRegistered(true);
        toast.success("Successfully joined the event!");
      }
      fetchEventDetail();
      fetchAllEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  const handleDeleteEvent = async () => {
    try {
      await axios.delete(`${backendUrl}/api/event/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Event deleted successfully");
      fetchAllEvents();
      router.push("/events");
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!event) return null;

  const participantsCount = event.participants?.length || 0;
  const maxParticipants = parseInt(event.maxParticipants) || 0;
  const progress = Math.min((participantsCount / maxParticipants) * 100, 100);
  const isEventPast = new Date(event.date) < new Date();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pb-20 bg-slate-50/50 dark:bg-slate-900/80"
    >
      {/* Hero Section */}
      <div className="relative h-[45vh] lg:h-[60vh] overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-800">
        {event.image ? (
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-600 to-indigo-800" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        
        <div className="absolute top-8 left-4 lg:left-10 flex gap-4">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-white/10 dark:bg-white/20 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all border border-white/20"
          >
            <HiOutlineArrowLeft size={24} />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-4 lg:p-10">
          <div className="container mx-auto">
            <motion.span 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 rounded-full text-[10px] font-black uppercase tracking-widest mb-4"
            >
              {event.category}
            </motion.span>
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl lg:text-6xl font-black text-white max-w-4xl leading-tight"
            >
              {event.title}
            </motion.h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-10 -mt-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 lg:p-12 shadow-sm border border-slate-100 dark:border-zinc-700">
              <div className="flex flex-wrap gap-6 mb-12 py-8 border-y border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <HiOutlineCalendar size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest">Date</p>
                    <p className="font-bold text-slate-900 dark:text-white">{new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <HiOutlineClock size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 dark:text-gray-400 uppercase tracking-widest">Time</p>
                    <p className="font-bold text-slate-900 dark:text-white">{event.startTime} - {event.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <HiOutlineLocationMarker size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                    <p className="font-bold text-slate-900 dark:text-white">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">About this event</h3>
                <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>

              {event.requirements && (
                <div className="mt-12 p-8 bg-slate-50 dark:bg-zinc-900 rounded-[32px] border border-slate-100 dark:border-zinc-700">
                  <h4 className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white mb-4">
                    <HiOutlineShieldCheck className="text-blue-600" size={24} />
                    Requirements
                  </h4>
                  <p className="text-slate-600 dark:text-gray-300 font-medium">{event.requirements}</p>
                </div>
              )}
            </div>

            {/* Admin Management */}
            {isEventCreator() && (
              <div className="bg-slate-900 rounded-[40px] p-8 lg:p-12 text-white">
                <h3 className="text-xl font-bold mb-6">Event Management</h3>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => router.push(`/edit-event/${id}`)}
                    className="flex items-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold transition-all"
                  >
                    <HiOutlinePencilAlt /> Edit Event
                  </button>
                  <div className="flex items-center gap-2">
                    {deleteConfirm ? (
                       <div className="flex items-center gap-4">
                         <span className="text-red-400 font-bold">Confirm Delete?</span>
                         <button onClick={handleDeleteEvent} className="px-6 py-4 bg-red-600 rounded-2xl font-bold">Yes, Delete</button>
                         <button onClick={() => setDeleteConfirm(false)} className="px-6 py-4 bg-white/10 rounded-2xl font-bold">Cancel</button>
                       </div>
                    ) : (
                      <button 
                        onClick={() => setDeleteConfirm(true)}
                        className="flex items-center gap-2 px-6 py-4 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-2xl font-bold transition-all"
                      >
                        <HiOutlineTrash /> Delete Event
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-[40px] p-8 shadow-sm border border-slate-100 dark:border-zinc-700 sticky top-32">
              <div className="mb-8">
                <div className="flex justify-between items-end mb-4">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Participation</h3>
                  <span className="text-blue-600 font-black">{participantsCount} / {maxParticipants}</span>
                </div>
                <div className="h-3 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    className={`h-full rounded-full ${progress >= 100 ? 'bg-red-500' : 'bg-blue-600'}`}
                  />
                </div>
                <p className="text-xs text-slate-400 dark:text-gray-400 mt-4 font-bold uppercase tracking-widest">
                  {maxParticipants - participantsCount} slots remaining
                </p>
              </div>

              {!isEventCreator() && (
                <div className="space-y-4">
                  <button
                    onClick={handleRegisterClick}
                    disabled={!isRegistered && participantsCount >= maxParticipants}
                    className={`w-full py-5 rounded-[24px] font-black text-lg shadow-xl shadow-blue-500/10 transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      isRegistered
                        ? "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 hover:shadow-red-500/10 border border-slate-200"
                        : participantsCount >= maxParticipants
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-blue-500/20"
                    }`}
                  >
                    {isRegistered ? (
                      <><HiOutlineArrowLeft /> Leave Event</>
                    ) : participantsCount >= maxParticipants ? (
                      "Event Full"
                    ) : (
                      <><HiOutlineCheckCircle /> Join Event</>
                    )}
                  </button>

                  <AnimatePresence>
                    {isRegistered && isEventPast && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                      >
                        <EventCompletion 
                          eventId={id} 
                          eventTitle={event.title} 
                          onSuccess={fetchEventDetail} 
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="mt-10 pt-10 border-t border-slate-50 dark:border-zinc-700">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Organizer</h4>
                <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-zinc-800 rounded-3xl">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
                    {(event.organizer || (event.createdBy?.name) || "C").charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{event.organizer || event.createdBy?.name || "Community Organizer"}</p>
                    <p className="text-xs text-slate-400 dark:text-gray-400 font-bold uppercase tracking-widest">Verified Partner</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-3xl p-6">
                <h4 className="flex items-center gap-2 text-blue-800 font-bold mb-4">
                  <HiOutlineEmojiHappy size={20} /> Impact
                </h4>
                <ul className="space-y-3">
                  <li className="flex gap-2 text-[13px] text-blue-700/80 font-semibold leading-snug">
                    <span className="text-blue-500">✓</span> Gain verified volunteer hours
                  </li>
                  <li className="flex gap-2 text-[13px] text-blue-700/80 font-semibold leading-snug">
                    <span className="text-blue-500">✓</span> Network with local changemakers
                  </li>
                  <li className="flex gap-2 text-[13px] text-blue-700/80 font-semibold leading-snug">
                    <span className="text-blue-500">✓</span> Support {event.category} causes
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default EventDetail;

