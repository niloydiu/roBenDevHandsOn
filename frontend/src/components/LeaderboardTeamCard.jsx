import React from "react";
import { HiOutlineArrowCircleRight } from "react-icons/hi";

const LeaderboardTeamCard = ({ team, index, handleJoinTeam, myTeams }) => {
  const teamId = team._id || team.id;
  const isAlreadyMember = myTeams.some(
    (myTeam) => (myTeam._id || myTeam.id) === teamId
  );

  const getRankBadge = (idx) => {
    switch (idx) {
      case 0: return <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-black">1</div>;
      case 1: return <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-black">2</div>;
      case 2: return <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-black">3</div>;
      default: return <div className="w-8 h-8 rounded-full bg-transparent text-slate-400 flex items-center justify-center font-black">{idx + 1}</div>;
    }
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors group">
      <td className="px-8 py-6">
        {getRankBadge(index)}
      </td>
      <td className="px-8 py-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0">
            <img
              className="w-full h-full object-cover"
              src={team.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=random`}
              alt={team.name}
            />
          </div>
          <div>
            <div className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">{team.name}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{team.memberCount} Members</div>
          </div>
        </div>
      </td>
      <td className="px-8 py-6">
        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
          {team.cause}
        </span>
      </td>
      <td className="px-8 py-6 text-center">
        <div className="inline-flex flex-col items-center">
          <span className="text-lg font-black text-slate-900">{team.hoursContributed || 0}</span>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">Hours</span>
        </div>
      </td>
      <td className="px-8 py-6 text-right">
        {isAlreadyMember ? (
          <span className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-xs font-black">Active</span>
        ) : (
          <button
            onClick={() => handleJoinTeam(teamId)}
            className="inline-flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black hover:bg-blue-600 transition-all active:scale-95"
          >
            Join <HiOutlineArrowCircleRight size={16} />
          </button>
        )}
      </td>
    </tr>
  );
};

export default LeaderboardTeamCard;
