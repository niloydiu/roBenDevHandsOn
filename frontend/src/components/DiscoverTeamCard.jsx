import React from "react";
import { motion } from "framer-motion";
import { Users, Plus, Check } from "lucide-react";

const DiscoverTeamCard = ({ team, handleJoinTeam, myTeams }) => {
  const teamId = team._id || team.id;
  const isAlreadyMember = (myTeams || []).some(
    (myTeam) => (myTeam._id || myTeam.id) === teamId
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-saas flex flex-col justify-between h-full relative"
    >
      <div>
        <div className="flex justify-between items-start mb-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 text-emerald-600 dark:text-emerald-400 font-bold text-sm flex items-center justify-center overflow-hidden shrink-0">
            {team.avatar ? (
              <img src={team.avatar} alt={team.name} className="w-full h-full object-cover" />
            ) : (
              <Users size={18} />
            )}
          </div>
          <span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] font-medium rounded-full">
            {team.cause || 'General'}
          </span>
        </div>

        <div className="mb-4">
          <h3 className="text-base font-semibold text-zinc-900 dark:text-white leading-tight mb-1">
            {team.name}
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed">
            {team.description}
          </p>
        </div>

        <div className="flex items-center gap-4 py-2 border-t border-zinc-100 dark:border-zinc-800/60 mb-4 text-xs text-zinc-500">
          <div>
            <span className="font-semibold text-zinc-900 dark:text-white">{team.memberCount || 0}</span>
            <span className="ml-1 text-[11px]">Members</span>
          </div>
          <div>
            <span className="font-semibold text-zinc-900 dark:text-white">{team.eventsCount || 0}</span>
            <span className="ml-1 text-[11px]">Events</span>
          </div>
        </div>
      </div>

      {isAlreadyMember ? (
        <div className="btn-saas btn-secondary w-full text-center justify-center text-xs opacity-75 cursor-default">
          <Check size={14} className="text-emerald-500" />
          <span>Already Joined</span>
        </div>
      ) : (
        <button
          onClick={() => handleJoinTeam(teamId)}
          className="btn-saas btn-primary w-full text-center justify-center text-xs"
        >
          <Plus size={14} />
          <span>Join Team</span>
        </button>
      )}
    </motion.div>
  );
};

export default DiscoverTeamCard;
