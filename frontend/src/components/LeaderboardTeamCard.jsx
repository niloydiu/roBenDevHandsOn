import React from "react";

const LeaderboardTeamCard = ({ team, index, handleJoinTeam, myTeams }) => {
  const getCauseColor = (cause) => {
    switch (cause?.toLowerCase()) {
      case "environment":
        return "bg-green-100 text-green-800";
      case "education":
        return "bg-blue-100 text-blue-800";
      case "food":
        return "bg-yellow-100 text-yellow-800";
      case "healthcare":
        return "bg-red-100 text-red-800";
      case "animals":
        return "bg-purple-100 text-purple-800";
      case "elderly":
        return "bg-orange-100 text-orange-800";
      case "development":
        return "bg-teal-100 text-teal-800";
      case "community":
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get the correct ID
  const teamId = team._id || team.id;

  // Check if user is already a member of this team
  const isAlreadyMember = myTeams.some(
    (myTeam) => (myTeam._id || myTeam.id) === teamId
  );

  return (
    <tr className={index < 3 ? "bg-yellow-50" : ""}>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">
          {index === 0 && <span className="inline-block mr-2">🏆</span>}
          {index === 1 && <span className="inline-block mr-2">🥈</span>}
          {index === 2 && <span className="inline-block mr-2">🥉</span>}
          {index + 1}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10">
            <img
              className="h-10 w-10 rounded-full"
              src={team.avatar || "https://placehold.co/100x100?text=Team"}
              alt={team.name}
            />
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{team.name}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getCauseColor(
            team.cause
          )}`}
        >
          {team.cause}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {team.memberCount}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900 font-semibold">
          {team.hoursContributed || 0}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        {isAlreadyMember ? (
          <span className="text-green-600 font-medium">Member</span>
        ) : (
          <button
            onClick={() => {
              console.log("Joining leaderboard team with ID:", teamId);
              handleJoinTeam(teamId);
            }}
            className="text-blue-600 hover:text-blue-900 font-medium"
          >
            Join
          </button>
        )}
      </td>
    </tr>
  );
};

export default LeaderboardTeamCard;
