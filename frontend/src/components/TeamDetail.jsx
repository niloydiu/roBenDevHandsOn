import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl, userData, isLoggedIn } = useContext(Appcontext);
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchTeamDetail = async () => {
      try {
        setLoading(true);
        // Note the singular "team" not "teams" in the API endpoint
        const response = await axios.get(`${backendUrl}/api/team/${id}`);
        setTeam(response.data);
      } catch (err) {
        console.error("Error fetching team details:", err);
        setError("Failed to load team details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id && backendUrl) {
      fetchTeamDetail();
    }
  }, [id, backendUrl]);

  // Check if user is the creator of the team
  const isTeamCreator = () => {
    if (!userData || !team || !team.creator) return false;

    if (typeof team.creator === "object") {
      return team.creator._id === userData._id;
    }
    return team.creator === userData._id;
  };

  // Check if user is a member of the team
  const isTeamMember = () => {
    if (!userData || !team || !team.members) return false;

    return team.members.some((member) => {
      if (typeof member === "object" && member.user) {
        if (typeof member.user === "object") {
          return member.user._id === userData._id;
        }
        return member.user === userData._id;
      }
      return false;
    });
  };

  // Handle joining a team
  const handleJoinTeam = async () => {
    if (!token) {
      alert("Please login to join this team");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/team/join/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("You've joined this team successfully!");

      // Refresh team data
      const response = await axios.get(`${backendUrl}/api/team/${id}`);
      setTeam(response.data);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to join team. Please try again.";
      alert(errorMsg);
    }
  };

  // Handle leaving a team
  const handleLeaveTeam = async () => {
    if (!token) {
      alert("Please login to leave this team");
      return;
    }

    try {
      await axios.post(
        `${backendUrl}/api/team/leave/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("You've left the team successfully");

      if (isTeamCreator()) {
        // If creator leaves (deletes), go back to teams list
        navigate("/teams");
      } else {
        // Otherwise refresh team data
        const response = await axios.get(`${backendUrl}/api/team/${id}`);
        setTeam(response.data);
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to leave team. Please try again.";
      alert(errorMsg);
    }
  };

  // Handle deleting a team
  const handleDeleteTeam = async () => {
    if (!token) {
      alert("You must be logged in to delete this team");
      return;
    }

    try {
      await axios.delete(`${backendUrl}/api/team/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Team deleted successfully");
      navigate("/teams");
    } catch (err) {
      console.error("Error deleting team:", err);
      alert(err.response?.data?.message || "Failed to delete team");
    }
  };

  // Handle edit team
  const handleEditTeam = () => {
    navigate(`/edit-team/${id}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <p className="mt-2">
            <button
              onClick={() => navigate("/teams")}
              className="text-blue-600 hover:underline"
            >
              Return to teams
            </button>
          </p>
        </div>
      </div>
    );
  }

  if (!team) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <Link
          to="/teams"
          className="text-blue-500 hover:underline flex items-center"
        >
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Back to Teams
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Team Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 py-6 px-8 text-white relative">
          <div className="flex items-center">
            {team.avatar ? (
              <img
                src={team.avatar}
                alt={team.name}
                className="w-20 h-20 rounded-full border-4 border-white object-cover mr-4"
                onError={(e) => {
                  e.target.src = "https://placehold.co/100x100?text=Team";
                }}
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-white text-blue-600 flex items-center justify-center text-2xl font-bold mr-4">
                {team.name.charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold">{team.name}</h1>
              <div className="flex items-center mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getCauseColor(
                    team.cause
                  )}`}
                >
                  {team.cause}
                </span>
                <span className="ml-3 text-sm opacity-80">
                  {team.isPublic ? "Public Team" : "Private Team"}
                </span>
                {isTeamCreator() && (
                  <span className="ml-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Your Team
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Team Management Controls */}
          {isTeamCreator() && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={handleEditTeam}
                className="bg-white text-blue-600 px-3 py-1 rounded-md text-sm flex items-center hover:bg-blue-50"
              >
                <svg
                  className="w-4 h-4 mr-1"
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
                Edit
              </button>

              {!deleteConfirm ? (
                <button
                  onClick={() => setDeleteConfirm(true)}
                  className="bg-white text-red-600 px-3 py-1 rounded-md text-sm flex items-center hover:bg-red-50"
                >
                  <svg
                    className="w-4 h-4 mr-1"
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
                  Delete
                </button>
              ) : (
                <div className="bg-white px-2 py-1 rounded-md flex items-center">
                  <span className="text-red-600 text-xs mr-2">Confirm:</span>
                  <button
                    onClick={handleDeleteTeam}
                    className="bg-red-600 text-white px-2 py-0.5 rounded text-xs hover:bg-red-700 mr-1"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(false)}
                    className="bg-gray-300 text-gray-700 px-2 py-0.5 rounded text-xs hover:bg-gray-400"
                  >
                    No
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Team Info */}
            <div className="md:col-span-2">
              <h2 className="text-xl font-semibold mb-4">About This Team</h2>
              <p className="text-gray-700 mb-6">{team.description}</p>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold mb-3">Team Stats</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {team.memberCount || team.members?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Members</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {team.eventsCount || team.events?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Events</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-600">
                      {team.hoursContributed || 0}
                    </div>
                    <div className="text-sm text-gray-500">Volunteer Hours</div>
                  </div>
                </div>
              </div>

              {team.events && team.events.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Team Events</h3>
                  <div className="space-y-4">
                    {team.events.slice(0, 3).map((event) => (
                      <div
                        key={event._id}
                        className="bg-gray-50 p-4 rounded-lg"
                      >
                        <h4 className="font-medium">{event.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {new Date(event.date).toLocaleDateString()} •{" "}
                          {event.location}
                        </p>
                        <Link
                          to={`/events/${event._id}`}
                          className="text-blue-600 text-sm hover:underline"
                        >
                          View details
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Team Members */}
            <div>
              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <h3 className="font-semibold mb-4">Team Members</h3>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {team.members?.map((member, index) => {
                    // Get the member name based on data structure
                    const memberData =
                      typeof member.user === "object" ? member.user : member;
                    const memberName = memberData.name || "Team Member";
                    const isCreator =
                      team.creator._id === memberData._id ||
                      team.creator === memberData._id;
                    const role =
                      member.role || (isCreator ? "admin" : "member");

                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                            {memberName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-medium">{memberName}</div>
                            <div className="text-xs text-gray-500">
                              {role === "admin" ? "Admin" : "Member"}{" "}
                              {isCreator && "• Creator"}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!isTeamMember() && isLoggedIn && team.isPublic && (
                  <button
                    onClick={handleJoinTeam}
                    className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
                  >
                    Join Team
                  </button>
                )}

                {isTeamMember() && !isTeamCreator() && (
                  <button
                    onClick={handleLeaveTeam}
                    className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                  >
                    Leave Team
                  </button>
                )}

                {isTeamCreator() && (
                  <button
                    onClick={handleLeaveTeam}
                    className="w-full py-2 px-4 bg-red-500 hover:scale-105 rounded-md transition-colors text-white"
                  >
                    Leave Team
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for cause colors
function getCauseColor(cause) {
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
}

export default TeamDetail;
