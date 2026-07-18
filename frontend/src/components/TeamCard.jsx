"use client";
import axios from "axios";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Appcontext } from "../context/Appcontext";
import { motion } from "framer-motion";
import { HiOutlineUserGroup, HiOutlineCalendar, HiOutlineClock, HiOutlineExternalLink, HiOutlinePencilAlt, HiOutlineTrash, HiOutlineLogout } from "react-icons/hi";
import { toast } from "react-toastify";

const TeamCard = ({ team, handleLeaveTeam, onTeamDeleted }) => {
  const { token, backendUrl, userData } = useContext(Appcontext);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const teamId = team._id;

  const isTeamCreator = () => {
    if (!userData || !team.creator) return false;
    return typeof team.creator === "object" ? team.creator._id === userData._id : team.creator === userData._id;
  };

  const handleDeleteTeam = async () => {
    if (!window.confirm("Are you sure you want to delete this team? This action cannot be undone.")) return;
    try {
      setIsDeleting(true);
      await axios.delete(`${backendUrl}/api/team/${teamId}`, { headers: { Authorization: `Bearer ${token}` } });
      if (onTeamDeleted) onTeamDeleted(teamId);
      toast.success("Team deleted successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete team");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group relative bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-[100px] -z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-[22px] flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200">
            {team.avatar ? (
              <img src={team.avatar} alt={team.name} className="w-full h-full object-cover rounded-[22px]" />
            ) : (
              team.name.charAt(0)
            )}
          </div>
          
          <div className="flex gap-2">
            {isTeamCreator() && (
              <>
                <Link 
                  href={`/edit-team/${teamId}`}
                  className="p-3 text-slate-300 hover:text-amber-500 hover:bg-amber-50 rounded-2xl transition-all"
                >
                  <HiOutlinePencilAlt size={20} />
                </Link>
                <button 
                  onClick={handleDeleteTeam}
                  disabled={isDeleting}
                  className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all disabled:opacity-50"
                >
                  <HiOutlineTrash size={20} />
                </button>
              </>
            )}
            <button 
              onClick={() => handleLeaveTeam(teamId)}
              className="p-3 text-slate-300 hover:text-orange-500 hover:bg-orange-50 rounded-2xl transition-all"
              title="Leave Team"
            >
              <HiOutlineLogout size={20} />
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
              {team.cause || 'Community'}
            </span>
            {isTeamCreator() && (
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                Founder
              </span>
            )}
          </div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
            {team.name}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
            {team.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-slate-50 p-4 rounded-3xl text-center">
            <div className="text-lg font-black text-slate-900">{team.memberCount || 0}</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Members</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-3xl text-center">
            <div className="text-lg font-black text-slate-900">{team.eventsCount || 0}</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Events</div>
          </div>
          <div className="bg-slate-50 p-4 rounded-3xl text-center">
            <div className="text-lg font-black text-slate-900">{team.hoursContributed || 0}h</div>
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Impact</div>
          </div>
        </div>

        <Link 
          href={`/teams/${teamId}`} 
          className="flex items-center justify-center gap-2 w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-slate-200"
        >
          Open Workspace <HiOutlineExternalLink size={18} />
        </Link>
      </div>
    </motion.div>
  );
};

export default TeamCard;
