import React, { useContext, useEffect, useState } from "react";
import { FaClock, FaMedal, FaSpinner, FaUsers } from "react-icons/fa";
import { Appcontext } from "../context/Appcontext";

const Profile = () => {
  const { userData, backendUrl, token, loadUserProfileData } =
    useContext(Appcontext);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    skills: [],
    causes: [],
    teamsCreated: 0,
    teamsJoined: 0,
    eventsCreated: 0,
    eventsJoined: 0,
    helpRequested: 0,
    helpOffered: 0,
    teams: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // Fetch user data on component mount and token changes
  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [token]);

  // Update profileData when userData changes
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || "",
        email: userData.email || "",
        skills: userData.skills || [],
        causes: userData.causes || [],
        teamsCreated: userData.teamsCreated || 0,
        teamsJoined: userData.teams?.length || 0,
        eventsCreated: userData.eventsCreated || 0,
        eventsJoined: userData.eventsJoined?.length || 0,
        helpRequested: userData.helpRequested || 0,
        helpOffered: userData.helpOffered || 0,
        volunteerHours: userData.volunteerHours || 0,
        points: userData.points || 0,
        teams: userData.teams || [],
      });
      setLoading(false);
    }
  }, [userData]);

  // Function to fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    setRefreshing(true);
    try {
      const response = await fetch(`${backendUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      console.log("User data from API:", data.user); // Debug log

      if (data.success && data.user) {
        // Process team data
        const teams = data.user.teams || [];

        setProfileData({
          name: data.user.name || "",
          email: data.user.email || "",
          skills: data.user.skills || [],
          causes: data.user.causes || [],
          teamsCreated: data.user.teamsCreated || 0,
          teamsJoined: teams.length || 0,
          eventsCreated: data.user.eventsCreated || 0,
          eventsJoined: data.user.eventsJoined?.length || 0,
          helpRequested: data.user.helpRequested || 0,
          helpOffered: data.user.helpOffered || 0,
          volunteerHours: data.user.volunteerHours || 0,
          points: data.user.points || 0,
          teams: teams,
        });

        // Reset error if successful
        setError("");

        // Also update context if needed
        loadUserProfileData();
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to fetch user data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-500 mr-2" />
        <span>Loading your profile...</span>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-red-600">
          Please login to view your profile
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {refreshing ? "Updating Profile..." : "Profile"}
          </h2>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              disabled={refreshing}
            >
              Edit Profile
            </button>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Stats Cards - Display team statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-600">
              {profileData.teamsCreated}
            </div>
            <div className="text-sm text-gray-600">Teams Created</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-600">
              {profileData.teamsJoined}
            </div>
            <div className="text-sm text-gray-600">Teams Joined</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-600">
              {profileData.eventsCreated}
            </div>
            <div className="text-sm text-gray-600">Events Created</div>
          </div>
          <div className="bg-amber-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-amber-600">
              {profileData.eventsJoined}
            </div>
            <div className="text-sm text-gray-600">Events Joined</div>
          </div>
        </div>

        {/* Display helpRequested and helpOffered */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-rose-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-rose-600">
              {profileData.helpRequested}
            </div>
            <div className="text-sm text-gray-600">Help Requested</div>
          </div>
          <div className="bg-cyan-50 p-4 rounded-lg text-center">
            <div className="text-3xl font-bold text-cyan-600">
              {profileData.helpOffered}
            </div>
            <div className="text-sm text-gray-600">Help Offered</div>
          </div>
        </div>

        {/* User Points and Hours */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-yellow-50 p-4 rounded-lg text-center flex flex-col items-center">
            <FaMedal className="text-2xl text-yellow-500 mb-1" />
            <div className="text-3xl font-bold text-yellow-600">
              {profileData.points}
            </div>
            <div className="text-sm text-gray-600">Points Earned</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded-lg text-center flex flex-col items-center">
            <FaClock className="text-2xl text-indigo-500 mb-1" />
            <div className="text-3xl font-bold text-indigo-600">
              {profileData.volunteerHours}
            </div>
            <div className="text-sm text-gray-600">Volunteer Hours</div>
          </div>
        </div>

        {/* User Info Display */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold mb-3">User Information</h3>
          <p>
            <strong>Name:</strong> {profileData.name}
          </p>
          <p>
            <strong>Email:</strong> {profileData.email}
          </p>
        </div>

        {/* Skills & Causes */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Skills</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.skills && profileData.skills.length > 0 ? (
                profileData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No skills added yet</p>
              )}
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Causes</h4>
            <div className="flex flex-wrap gap-2">
              {profileData.causes && profileData.causes.length > 0 ? (
                profileData.causes.map((cause, index) => (
                  <span
                    key={index}
                    className="bg-gray-200 px-3 py-1 rounded-full text-sm"
                  >
                    {cause}
                  </span>
                ))
              ) : (
                <p className="text-gray-500">No causes added yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Teams Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaUsers className="mr-2" /> Your Teams
          </h3>

          {profileData.teams && profileData.teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.teams.map((team) => (
                <div
                  key={team._id}
                  className="border rounded-lg p-4 flex items-center hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden mr-4">
                    {team.avatar ? (
                      <img
                        src={team.avatar}
                        alt={team.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-300">
                        <FaUsers className="text-gray-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{team.name}</h4>
                    <p className="text-sm text-gray-600">{team.cause}</p>
                    <p className="text-xs text-gray-500">
                      {team.memberCount || "?"} members
                    </p>
                  </div>
                  <a
                    href={`/teams/${team._id}`}
                    className="ml-auto text-sm text-blue-500 hover:underline"
                  >
                    View
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't joined any teams yet.</p>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-6 text-center">
          <button
            onClick={fetchUserData}
            disabled={refreshing}
            className={`
              px-4 py-2 rounded flex items-center justify-center mx-auto
              ${
                refreshing
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-800"
              }
            `}
          >
            {refreshing && <FaSpinner className="animate-spin mr-2" />}
            {refreshing ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
