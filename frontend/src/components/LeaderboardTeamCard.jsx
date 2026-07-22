import React from "react";
import { ArrowRight, Check } from "lucide-react";

const LeaderboardTeamCard = ({ team, index, handleJoinTeam, myTeams }) => {
  const teamId = team._id || team.id;
  const isAlreadyMember = (myTeams || []).some(
    (myTeam) => (myTeam._id || myTeam.id) === teamId
  );

  const getRankBadge = (idx) => {
    switch (idx) {
      case 0: return <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">1</div>;
      case 1: return <div className="w-6 h-6 rounded-md bg-zinc-300 dark:bg-zinc-700 text-zinc-900 dark:text-white flex items-center justify-center font-bold text-xs">2</div>;
      case 2: return <div className="w-6 h-6 rounded-md bg-amber-700 text-white flex items-center justify-center font-bold text-xs">3</div>;
      default: return <div className="w-6 h-6 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center justify-center font-bold text-xs">{idx + 1}</div>;
    }
  };

  return (
    <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors text-xs">
      <td className="px-4 py-3">
        {getRankBadge(index)}
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-zinc-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-zinc-200/60 dark:border-zinc-800">
            <img
              className="w-full h-full object-cover"
              src={team.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(team.name)}&background=random`}
              alt={team.name}
            />
          </div>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-white">{team.name}</div>
            <div className="text-[10px] text-zinc-400 font-medium">{team.memberCount || 0} Members</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-medium rounded-full">
          {team.cause || "General"}
        </span>
      </td>
      <td className="px-4 py-3 text-center font-semibold text-zinc-900 dark:text-white">
        {team.hoursContributed || 0} hrs
      </td>
      <td className="px-4 py-3 text-right">
        {isAlreadyMember ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-md text-[11px] font-medium">
            <Check size={12} /> Member
          </span>
        ) : (
          <button
            onClick={() => handleJoinTeam(teamId)}
            className="btn-saas btn-primary !h-7 !px-3 text-xs"
          >
            <span>Join</span>
            <ArrowRight size={12} />
          </button>
        )}
      </td>
    </tr>
  );
};

export default LeaderboardTeamCard;
