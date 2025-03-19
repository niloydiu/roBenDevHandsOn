import React from "react";

const DiscoverTeamCard = ({ team, handleJoinTeam, myTeams }) => {
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

  // Get the correct ID - MongoDB uses _id
  const teamId = team._id || team.id;

  // Check if user is already a member of this team
  const isAlreadyMember = myTeams.some(
    (myTeam) => (myTeam._id || myTeam.id) === teamId
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-4">
          <img
            src={team.avatar || "https://placehold.co/100x100?text=Team"}
            alt={team.name}
            className="w-12 h-12 rounded-full mr-4"
          />
          <div>
            <h3 className="text-lg font-semibold">{team.name}</h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCauseColor(
                team.cause
              )}`}
            >
              {team.cause}
            </span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{team.description}</p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <span className="text-sm text-gray-500">
              {team.memberCount} {team.memberCount === 1 ? "member" : "members"}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-500">
              {team.eventsCount || 0}{" "}
              {team.eventsCount === 1 ? "event" : "events"}
            </span>
          </div>
        </div>

        {isAlreadyMember ? (
          <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-md">
            Already a Member
          </button>
        ) : (
          <button
            onClick={() => {
              console.log("Joining team with ID:", teamId);
              handleJoinTeam(teamId);
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Join Team
          </button>
        )}
      </div>
    </div>
  );
};

export default DiscoverTeamCard;
