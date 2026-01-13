import React from "react";
import { motion } from "framer-motion";
import { HiOutlineUserGroup, HiOutlinePlus } from "react-icons/hi";

const DiscoverTeamCard = ({ team, handleJoinTeam, myTeams }) => {
  const teamId = team._id || team.id;
  const isAlreadyMember = myTeams.some(
    (myTeam) => (myTeam._id || myTeam.id) === teamId
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="group bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="w-16 h-16 bg-blue-50 rounded-[22px] flex items-center justify-center text-blue-600 font-black shadow-inner">
          {team.avatar ? (
            <img src={team.avatar} alt={team.name} className="w-full h-full object-cover rounded-[22px]" />
          ) : (
            <HiOutlineUserGroup size={24} />
          )}
        </div>
        <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-full">
          {team.cause || 'General'}
        </span>
      </div>

      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
          {team.name}
        </h3>
        <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed font-medium">
          {team.description}
        </p>
      </div>

      <div className="flex items-center gap-6 mb-8 text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-black text-slate-900">{team.memberCount || 0}</span>
          <span className="text-[10px] font-black uppercase tracking-wider">Members</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-lg font-black text-slate-900">{team.eventsCount || 0}</span>
          <span className="text-[10px] font-black uppercase tracking-wider">Events</span>
        </div>
      </div>

      {isAlreadyMember ? (
        <div className="w-full py-4 bg-slate-50 text-slate-400 text-center rounded-2xl font-black text-sm border border-slate-100">
          Already a Member
        </div>
      ) : (
        <button
          onClick={() => handleJoinTeam(teamId)}
          className="flex items-center justify-center gap-2 w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
        >
          <HiOutlinePlus size={18} /> Join Community
        </button>
      )}
    </motion.div>
  );
};

export default DiscoverTeamCard;
