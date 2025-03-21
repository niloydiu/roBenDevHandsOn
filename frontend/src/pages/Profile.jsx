import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaMedal,
  FaSpinner,
  FaUsers,
} from "react-icons/fa";
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
    events: [], // Added to store event data
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

  // Set up a periodic refresh to keep data in sync
  useEffect(() => {
    if (!token) return;

    // Refresh every 30 seconds silently
    const interval = setInterval(() => {
      fetchUserData(true); // silent refresh
    }, 30000);

    return () => clearInterval(interval); // Clean up on unmount
  }, [token]);

  // Update profileData when userData changes
  useEffect(() => {
    if (userData) {
      updateProfileFromUserData(userData);
      setLoading(false);
    }
  }, [userData]);

  // Helper function to update profile data from user data
  const updateProfileFromUserData = (data) => {
    // Handle events data which might be array of objects or array of IDs
    let eventsData = data.eventsJoined || [];

    // Make sure eventsJoined is an array
    if (!Array.isArray(eventsData)) {
      eventsData = [];
    }

    setProfileData({
      name: data.name || "",
      email: data.email || "",
      skills: data.skills || [],
      causes: data.causes || [],
      teamsCreated: data.teamsCreated || 0,
      teamsJoined: data.teams?.length || 0,
      eventsCreated: data.eventsCreated || 0,
      eventsJoined: eventsData.length || 0,
      helpRequested: data.helpRequested || 0,
      helpOffered: data.helpOffered || 0,
      volunteerHours: data.volunteerHours || 0,
      points: data.points || 0,
      teams: data.teams || [],
      events: eventsData,
    });
  };

  // Function to fetch user data
  const fetchUserData = async (silent = false) => {
    if (!silent) {
      setLoading(true);
      setRefreshing(true);
    }

    try {
      // Use axios instead of fetch for consistency
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data;

      if (data.success && data.user) {
        console.log("User profile data:", data.user);

        // Also fetch event details if user has joined events
        // This helps get more details like title and date
        if (data.user.eventsJoined && data.user.eventsJoined.length > 0) {
          try {
            // Fetch all events and filter for the ones the user joined
            const eventsResponse = await axios.get(`${backendUrl}/api/event`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (
              eventsResponse.data &&
              eventsResponse.data.success &&
              Array.isArray(eventsResponse.data.events)
            ) {
              // Filter events to only include ones the user joined
              const joinedEventIds = data.user.eventsJoined.map((event) =>
                typeof event === "object" ? event._id : event
              );

              // Enhance user data with full event details
              const userJoinedEvents = eventsResponse.data.events.filter(
                (event) => joinedEventIds.includes(event._id)
              );

              // Add full event data to user data
              data.user.eventsJoinedDetails = userJoinedEvents;
            }
          } catch (err) {
            console.error("Error fetching event details:", err);
          }
        }

        // Update profile with potentially enhanced user data
        updateProfileFromUserData(data.user);

        // Reset error if successful
        setError("");

        // Update global context
        if (!silent) {
          loadUserProfileData();
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      if (!silent) {
        setError("Failed to fetch user data. Please try again.");
      }
    } finally {
      if (!silent) {
        setLoading(false);
        setRefreshing(false);
      }
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

        {/* Stats Cards */}
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

        {/* Help stats */}
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

        {/* Events Section - NEW! */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaCalendarAlt className="mr-2 text-blue-500" /> Your Events
          </h3>

          {profileData.events && profileData.events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.events.map((event, index) => (
                <div
                  key={typeof event === "object" ? event._id : `event-${index}`}
                  className="border rounded-lg p-4 hover:bg-gray-50 hover:shadow transition-all"
                >
                  <h4 className="font-medium text-blue-700">
                    {typeof event === "object" && event.title
                      ? event.title
                      : "Event Details"}
                  </h4>
                  {typeof event === "object" && event.date ? (
                    <>
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Date:</strong>{" "}
                        {new Date(event.date).toLocaleDateString()}
                      </p>
                      {event.location && (
                        <p className="text-sm text-gray-600">
                          <strong>Location:</strong> {event.location}
                        </p>
                      )}
                    </>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      View event details on the Events page
                    </p>
                  )}
                  <a
                    href={`/events/${
                      typeof event === "object" ? event._id : event
                    }`}
                    className="mt-2 inline-block text-sm text-blue-500 hover:underline"
                  >
                    View Event Details
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <FaCalendarAlt className="mx-auto text-gray-400 text-3xl mb-3" />
              <p className="text-gray-500">
                You haven't joined any events yet.
              </p>
              <a
                href="/events"
                className="mt-3 inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Browse Events
              </a>
            </div>
          )}
        </div>

        {/* Teams Section */}
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <FaUsers className="mr-2 text-green-500" /> Your Teams
          </h3>

          {profileData.teams && profileData.teams.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profileData.teams.map((team) => (
                <div
                  key={team._id}
                  className="border rounded-lg p-4 flex items-center hover:bg-gray-50 hover:shadow transition-all"
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
                    <h4 className="font-medium text-green-700">{team.name}</h4>
                    <p className="text-sm text-gray-600">{team.cause}</p>
                    <p className="text-xs text-gray-500">
                      {team.memberCount || team.members?.length || "?"} members
                    </p>
                  </div>
                  <a
                    href={`/teams/${team._id}`}
                    className="ml-auto text-sm text-green-500 hover:underline"
                  >
                    View Team
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <FaUsers className="mx-auto text-gray-400 text-3xl mb-3" />
              <p className="text-gray-500">You haven't joined any teams yet.</p>
              <a
                href="/teams"
                className="mt-3 inline-block px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Browse Teams
              </a>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center border-t pt-6">
          <button
            onClick={() => fetchUserData()}
            disabled={refreshing}
            className={`
              px-6 py-2 rounded flex items-center justify-center mx-auto
              ${
                refreshing
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }
            `}
          >
            {refreshing && <FaSpinner className="animate-spin mr-2" />}
            {refreshing ? "Refreshing Profile..." : "Refresh Profile Data"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
