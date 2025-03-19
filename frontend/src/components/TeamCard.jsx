import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

const TeamCard = ({ team, handleLeaveTeam, onTeamDeleted }) => {
  const { token, backendUrl, userData } = useContext(Appcontext);
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  // Extract team ID
  const teamId = team._id;

  // Function to determine if the user is the creator of this team
  const isTeamCreator = () => {
    if (!userData || !team.creator) return false;

    if (typeof team.creator === "object") {
      return team.creator._id === userData._id;
    }

    return team.creator === userData._id;
  };

  // Handle team deletion
  const handleDeleteTeam = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsDeleting(true);
      await axios.delete(`${backendUrl}/api/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Call the callback to update the UI
      if (onTeamDeleted) {
        onTeamDeleted(teamId);
      }

      alert("Team deleted successfully");
    } catch (error) {
      console.error("Error deleting team:", error);
      alert(
        error.response?.data?.message ||
          "Failed to delete team. Please try again."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper for cause styling
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
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
            <span className="ml-2 text-xs text-gray-500">
              {team.isPublic ? "Public" : "Private"}
            </span>
            {team.isAdmin && (
              <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                Admin
              </span>
            )}
            {isTeamCreator() && (
              <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                Creator
              </span>
            )}
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4">{team.description}</p>

        <div className="grid grid-cols-3 gap-2 text-center mb-4">
          <div className="bg-gray-50 p-2 rounded">
            <span className="block text-lg font-semibold">
              {team.memberCount}
            </span>
            <span className="text-xs text-gray-500">Members</span>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="block text-lg font-semibold">
              {team.eventsCount || 0}
            </span>
            <span className="text-xs text-gray-500">Events</span>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <span className="block text-lg font-semibold">
              {team.hoursContributed || 0}
            </span>
            <span className="text-xs text-gray-500">Hours</span>
          </div>
        </div>

        {/* Improved Button Layout */}
        <div className="mt-5">
          <div className="grid grid-cols-2 gap-2">
            {/* View Details - Always visible */}
            <Link
              to={`/teams/${teamId}`}
              className="flex items-center justify-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors text-sm"
            >
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                ></path>
              </svg>
              View Details
            </Link>

            {isTeamCreator() ? (
              // Edit - Only for team creators
              <Link
                to={`/edit-team/${teamId}`}
                className="flex items-center justify-center px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  ></path>
                </svg>
                Edit Team
              </Link>
            ) : (
              // Join/Leave - For regular members
              <button
                onClick={() => handleLeaveTeam(teamId)}
                className="flex items-center justify-center px-3 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Leave Team
              </button>
            )}
          </div>

          {/* Additional row for creators */}
          {isTeamCreator() && (
            <div className="grid grid-cols-2 gap-2 mt-2">
              <button
                onClick={handleDeleteTeam}
                disabled={isDeleting}
                className="flex items-center justify-center px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors text-sm disabled:opacity-60 disabled:pointer-events-none"
              >
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  ></path>
                </svg>
                {isDeleting ? "Deleting..." : "Delete Team"}
              </button>

              <button
                onClick={() => handleLeaveTeam(teamId)}
                className="flex items-center justify-center px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition-colors text-sm"
              >
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  ></path>
                </svg>
                Leave Team
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamCard;
