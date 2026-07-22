"use client";
import axios from "axios";
import React, { useContext, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Appcontext } from "../context/Appcontext";
import { motion } from "framer-motion";
import { Users, Calendar, Clock, ExternalLink, Pencil, Trash2, LogOut } from "lucide-react";
import { toast } from "react-toastify";

const TeamCard = ({ team, handleLeaveTeam, onTeamDeleted = null }) => {
  const { token, backendUrl, userData } = useContext(Appcontext);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const teamId = team._id || team.id;
  const userId = userData?._id || userData?.id;

  const isTeamCreator = () => {
    if (!userData || !team.creator) return false;
    const creatorId = typeof team.creator === "object" ? (team.creator._id || team.creator.id) : team.creator;
    return creatorId === userId;
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
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-saas flex flex-col justify-between h-full relative"
    >
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white font-bold text-lg flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            {team.avatar ? (
              <img src={team.avatar} alt={team.name} className="w-full h-full object-cover" />
            ) : (
              team.name.charAt(0)
            )}
          </div>
          
          <div className="flex items-center gap-1">
            {isTeamCreator() && (
              <>
                <Link 
                  href={`/edit-team/${teamId}`}
                  className="p-1.5 text-zinc-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-md transition-colors"
                  title="Edit Team"
                >
                  <Pencil size={15} />
                </Link>
                <button 
                  onClick={handleDeleteTeam}
                  disabled={isDeleting}
                  className="p-1.5 text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors disabled:opacity-50"
                  title="Delete Team"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
            <button 
              onClick={() => handleLeaveTeam(teamId)}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors"
              title="Leave Team"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 text-[10px] font-semibold rounded-full">
              {team.cause || 'Community'}
            </span>
            {isTeamCreator() && (
              <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-[10px] font-medium rounded-full">
                Founder
              </span>
            )}
          </div>
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white leading-tight mb-1">
            {team.name}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
            {team.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-100 dark:border-zinc-800/60 mb-4 text-center text-xs">
          <div>
            <div className="font-semibold text-zinc-900 dark:text-white">{team.memberCount || 0}</div>
            <div className="text-[10px] text-zinc-400 font-medium">Members</div>
          </div>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-white">{team.eventsCount || 0}</div>
            <div className="text-[10px] text-zinc-400 font-medium">Events</div>
          </div>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-white">{team.hoursContributed || 0}h</div>
            <div className="text-[10px] text-zinc-400 font-medium">Impact</div>
          </div>
        </div>
      </div>

      <Link 
        href={`/teams/${teamId}`} 
        className="btn-saas btn-primary w-full text-center justify-center text-xs"
      >
        <span>Open Workspace</span>
        <ExternalLink size={13} />
      </Link>
    </motion.div>
  );
};

export default TeamCard;
