"use client";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Appcontext } from "../context/Appcontext";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineUsers, HiOutlineCalendar, HiOutlineClock, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineLogout, HiOutlineGlobeAlt, HiOutlineShieldCheck, HiOutlineUserCircle } from "react-icons/hi";
import { toast } from "react-toastify";

// Helper function for cause colors
const getCauseColor = (cause) => {
  switch (cause?.toLowerCase()) {
    case "environment": return "bg-emerald-500";
    case "education": return "bg-sky-500";
    case "food": return "bg-amber-500";
    case "healthcare": return "bg-rose-500";
    case "animals": return "bg-indigo-500";
    default: return "bg-blue-600";
  }
};

function TeamDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { token, backendUrl, userData, isLoggedIn } = useContext(Appcontext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchTeamDetail = async () => {
      try {
        setLoading(true);
        let response;
        try {
          response = await axios.get(`/api/team/${id}`);
        } catch (e) {
          response = await axios.get(`${backendUrl}/api/team/${id}`);
        }
        setTeam(response?.data?.team || response?.data);
      } catch (err) {
        console.error("Error fetching team detail:", err);
        toast.error("Failed to load team details");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTeamDetail();
  }, [id, backendUrl]);

  const isTeamCreator = () => {
    if (!userData || !team || !team.creator) return false;
    const creatorId = typeof team.creator === "object" ? team.creator._id : team.creator;
    return creatorId === userData._id;
  };

  const isTeamMember = () => {
    if (!userData || !team || !team.members) return false;
    return team.members.some(m => {
      const mId = typeof m.user === "object" ? m.user._id : m.user;
      return mId === userData._id;
    });
  };

  const handleJoinTeam = async () => {
    if (!isLoggedIn) {
      toast.info("Please login first");
      return router.push("/login");
    }
    try {
      await axios.post(`${backendUrl}/api/team/join/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Welcome to the team!");
      const res = await axios.get(`${backendUrl}/api/team/${id}`);
      setTeam(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join team");
    }
  };

  const handleLeaveTeam = async () => {
    try {
      await axios.post(`${backendUrl}/api/team/leave/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Group left successfully");
      if (isTeamCreator()) router.push("/teams");
      else {
        const res = await axios.get(`${backendUrl}/api/team/${id}`);
        setTeam(res.data);
      }
    } catch (err) {
      toast.error("Failed to leave team");
    }
  };

  const handleDeleteTeam = async () => {
    try {
      await axios.delete(`${backendUrl}/api/team/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Team disbanded");
      router.push("/teams");
    } catch (err) {
      toast.error("Failed to delete team");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!team) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
      <h2 className="text-2xl font-black text-slate-900">Team not found</h2>
      <Link href="/teams" className="text-blue-600 font-bold hover:underline">Return to Teams</Link>
    </div>
  );

  const causeColor = getCauseColor(team.cause);

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Hero Section */}
      <div className="relative h-[480px] overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
          <div className={`absolute inset-0 opacity-40 mix-blend-multiply ${causeColor}`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_30%,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 lg:px-10 h-full flex flex-col justify-end pb-16 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/teams" className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-10 transition-all font-black text-[10px] uppercase tracking-[0.2em] group">
              <HiOutlineArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Communities
            </Link>
          </motion.div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
            <div className="flex items-center gap-8">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-28 h-28 bg-white rounded-[36px] p-2 flex-shrink-0 shadow-2xl rotate-3"
              >
                {team.avatar ? (
                  <img src={team.avatar} alt={team.name} className="w-full h-full object-cover rounded-[30px]" />
                ) : (
                  <div className={`w-full h-full text-white flex items-center justify-center text-4xl font-black rounded-[30px] ${causeColor}`}>
                    {team.name.charAt(0)}
                  </div>
                )}
              </motion.div>
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-4 py-1.5 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg ${causeColor}`}>
                    {team.cause}
                  </span>
                  <span className="flex items-center gap-1.5 text-white/60 text-[10px] font-black uppercase tracking-widest bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    {team.isPublic ? <HiOutlineGlobeAlt size={14} /> : <HiOutlineShieldCheck size={14} />}
                    {team.isPublic ? 'Public' : 'Private'}
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">{team.name}</h1>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {isTeamCreator() ? (
                <>
                  <button onClick={() => router.push(`/edit-team/${id}`)} className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-[20px] font-black text-sm flex items-center gap-2 transition-all border border-white/10">
                    <HiOutlinePencilAlt size={20} /> Edit Squad
                  </button>
                  <button onClick={() => setDeleteConfirm(true)} className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-100 backdrop-blur-md rounded-[20px] font-black text-sm flex items-center gap-2 transition-all border border-red-500/20">
                    <HiOutlineTrash size={20} /> Disband
                  </button>
                </>
              ) : isTeamMember() ? (
                <button onClick={handleLeaveTeam} className="px-8 py-4 bg-white/10 hover:bg-red-600/20 hover:text-red-100 backdrop-blur-md text-white rounded-[20px] font-black text-sm flex items-center gap-2 transition-all border border-white/10">
                  <HiOutlineLogout size={20} /> Leave Group
                </button>
              ) : team.isPublic && (
                <button onClick={handleJoinTeam} className="px-10 py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg shadow-2xl shadow-blue-500/40 hover:bg-blue-700 hover:-translate-y-1 transition-all active:scale-95">
                  Join Community
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 lg:px-10 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white rounded-[40px] p-8 md:p-14 shadow-xl shadow-slate-200/40 border border-slate-100"
            >
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">Our Mission</h2>
              <p className="text-slate-500 text-xl leading-relaxed font-medium">
                {team.description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-[40px] p-8 md:p-14 shadow-xl shadow-slate-200/40 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Active Initiatives</h2>
                  <p className="text-slate-400 font-medium text-sm mt-1">Projects making a difference right now</p>
                </div>
                <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[22px] flex flex-col items-center justify-center font-black">
                  <span className="text-xl leading-none">{team.events?.length || 0}</span>
                  <span className="text-[8px] uppercase tracking-widest mt-1">Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {team.events && team.events.length > 0 ? (
                  team.events.map((event) => (
                    <Link
                      key={event._id}
                      href={`/events/${event._id}`}
                      className="group flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-slate-50 hover:bg-blue-600 rounded-[32px] transition-all duration-500 border border-transparent hover:shadow-xl hover:shadow-blue-500/20"
                    >
                      <div className="flex gap-6 items-center">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform duration-500">
                           <HiOutlineCalendar size={28} />
                        </div>
                        <div>
                          <h4 className="font-black text-xl text-slate-900 mb-1 group-hover:text-white transition-colors">{event.title}</h4>
                          <div className="flex items-center gap-4 text-xs text-slate-400 group-hover:text-white/60 font-black uppercase tracking-widest transition-colors">
                            <span className="flex items-center gap-1.5">{new Date(event.date).toLocaleDateString()}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200 group-hover:bg-white/20" />
                            <span className="flex items-center gap-1.5">{event.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 py-3 bg-white/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-white group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                        Join Project
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-black text-lg">No active projects yet.</p>
                    <p className="text-slate-400 text-sm mt-1">Impact initiatives will appear here when launched.</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-slate-900 text-white rounded-[40px] p-10 shadow-2xl shadow-blue-900/40 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700" />
              
              <h3 className="text-sm font-black mb-10 flex items-center gap-3 uppercase tracking-[0.2em] text-white/40">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" /> Community Pulse
              </h3>
              
              <div className="grid grid-cols-1 gap-10">
                <div className="space-y-2">
                  <div className="text-5xl font-black text-white">{team.memberCount || team.members?.length || 0}</div>
                  <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Active Members</div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-[65%]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-5xl font-black text-white">{team.hoursContributed || 0}<span className="text-blue-500">h</span></div>
                  <div className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Collective Impact</div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 w-[45%]" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-5xl font-black text-white">{team.eventsCount || team.events?.length || 0}</div>
                  <div className="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]">Completed Initiatives</div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 w-[30%]" />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-[40px] p-10 shadow-xl shadow-slate-200/40 border border-slate-100"
            >
              <h3 className="text-xl font-black text-slate-900 mb-8 tracking-tight">Top Contributors</h3>
              <div className="space-y-6 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                {team.members?.map((member, idx) => {
                  const m = typeof member.user === "object" ? member.user : member;
                  const isCreator = (team.creator._id || team.creator) === m._id;
                  return (
                    <div key={idx} className="flex items-center gap-5 group">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 font-black group-hover:bg-blue-50 group-hover:text-blue-600 transition-all overflow-hidden border-2 border-transparent group-hover:border-blue-100">
                          {m.avatar ? <img src={m.avatar} className="w-full h-full object-cover" /> : m.name?.charAt(0) || <HiOutlineUserCircle size={24} />}
                        </div>
                        {isCreator && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 text-white rounded-lg flex items-center justify-center border-2 border-white shadow-lg">
                            <HiOutlineShieldCheck size={12} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">{m.name || 'Member'}</div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 uppercase transition-colors">
                          {isCreator ? 'Community Founder' : 'Impact Maker'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            className="bg-white p-12 rounded-[50px] max-w-md w-full text-center shadow-2xl"
          >
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <HiOutlineTrash size={40} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Disband Squad?</h3>
            <p className="text-slate-500 font-medium mb-10 px-4 leading-relaxed">
              This action is permanent and will delete all team data, history, and records. This cannot be undone.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleDeleteTeam} className="w-full py-5 bg-red-600 text-white rounded-[24px] font-black text-sm shadow-xl shadow-red-500/30 hover:bg-red-700 transition-all">
                Disband Forever
              </button>
              <button onClick={() => setDeleteConfirm(false)} className="w-full py-5 bg-slate-100 text-slate-600 rounded-[24px] font-black text-sm hover:bg-slate-200 transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default TeamDetail;
