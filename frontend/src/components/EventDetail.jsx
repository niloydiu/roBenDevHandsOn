import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl, userData } = useContext(Appcontext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false); // State for delete confirmation

  // Get user object or ID depending on what's available
  const user = userData || {};
  const userId = user._id || user.id;

  // Check if current user is the creator of the event
  const isEventCreator = () => {
    if (!userData || !event || !event.createdBy) return false;

    if (typeof event.createdBy === "object") {
      return event.createdBy._id === userData._id;
    }

    return event.createdBy === userData._id;
  };

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/event/${id}`);
        console.log("Event data:", response.data);

        // FIX: Extract event object from response.data.event instead of using response.data directly
        const eventData = response.data.success
          ? response.data.event
          : response.data;
        setEvent(eventData);

        // Check if user is registered for this event
        if (userId && eventData.participants) {
          // Handle both array of IDs and array of objects
          const isUserRegistered = eventData.participants.some(
            (participant) => {
              if (typeof participant === "object") {
                if (participant.user) {
                  // Compare with different possible properties
                  const participantId =
                    participant.user._id ||
                    participant.user.id ||
                    participant.user;

                  return String(participantId) === String(userId);
                }
                // If the participant object has its own id
                return (
                  String(participant._id) === String(userId) ||
                  String(participant.id) === String(userId)
                );
              }
              // Direct comparison for simple ID strings
              return String(participant) === String(userId);
            }
          );

          setIsRegistered(isUserRegistered);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.response?.data?.message || "Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    if (id && backendUrl) {
      fetchEventDetail();
    }
  }, [id, backendUrl, userId]);

  const handleRegisterClick = async () => {
    if (!token) {
      alert("Please login to join this event");
      navigate("/login");
      return;
    }

    try {
      if (isRegistered) {
        // Leave event
        await axios.post(
          `${backendUrl}/api/event/leave/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsRegistered(false);
        alert("You have successfully left this event");
      } else {
        // Join event
        await axios.post(
          `${backendUrl}/api/event/join/${id}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsRegistered(true);
        alert("You have successfully joined this event");
      }

      // Refresh event data to update participant count
      const response = await axios.get(`${backendUrl}/api/event/${id}`);
      // FIX: Extract event object from response.data.event
      const eventData = response.data.success
        ? response.data.event
        : response.data;
      setEvent(eventData);
    } catch (err) {
      console.error("Error updating registration:", err);
      alert(
        err.response?.data?.message || "Failed to update registration status"
      );
    }
  };

  // Handle delete event
  const handleDeleteEvent = async () => {
    if (!token) {
      alert("You must be logged in to delete this event");
      return;
    }

    try {
      await axios.delete(`${backendUrl}/api/event/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Event deleted successfully");
      navigate("/events");
    } catch (err) {
      console.error("Error deleting event:", err);
      alert(err.response?.data?.message || "Failed to delete event");
    }
  };

  // Handle edit event
  const handleEditEvent = () => {
    navigate(`/edit-event/${id}`);
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
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
        role="alert"
      >
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  if (!event) return null;

  // Calculate percentage of spots filled
  const participantsCount = event.participants?.length || 0;
  // FIX: Make sure maxParticipants is treated as a number
  const maxParticipants = parseInt(event.maxParticipants) || 0;
  const participationPercentage =
    maxParticipants > 0 ? (participantsCount / maxParticipants) * 100 : 0;
  const spotsRemaining = maxParticipants - participantsCount;

  // Format date
  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <Link
          to="/events"
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
          Back to Events
        </Link>
      </nav>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Event Header Image - Gradient fallback if no image */}
        <div className="w-full h-64 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center relative">
          {event.image ? (
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-2xl font-semibold">
              {event.category || "Volunteer Event"}
            </span>
          )}

          {/* Event Creator Badge */}
          {isEventCreator() && (
            <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              You created this event
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start gap-2">
            <h1 className="text-3xl font-bold">{event.title}</h1>
            <span
              className={`${getCategoryColor(
                event.category
              )} text-sm font-medium px-2.5 py-0.5 rounded`}
            >
              {event.category}
            </span>
          </div>

          {/* Event Creator Management Controls */}
          {isEventCreator() && (
            <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <h3 className="font-medium text-gray-800 mb-3">
                Event Management
              </h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleEditEvent}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
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
                  Edit Event
                </button>

                {deleteConfirm ? (
                  <div className="flex items-center space-x-2">
                    <span className="text-red-600 font-medium text-sm">
                      Are you sure?
                    </span>
                    <button
                      onClick={handleDeleteEvent}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm"
                    >
                      Yes, Delete
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md flex items-center"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
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
                    Delete Event
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-3">Event Details</h2>
              <p className="text-gray-700 mb-4">{event.description}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <span>
                    <span className="font-medium">Date:</span> {formattedDate}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span>
                    <span className="font-medium">Time:</span> {event.startTime}{" "}
                    - {event.endTime}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    ></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    ></path>
                  </svg>
                  <span>
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </span>
                </div>

                <div className="flex items-center text-gray-700">
                  <svg
                    className="w-5 h-5 mr-2 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                  <span>
                    <span className="font-medium">Organizer:</span>{" "}
                    {event.organizer ||
                      (event.createdBy && typeof event.createdBy === "object"
                        ? event.createdBy.name
                        : null) ||
                      "Community Event"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-2">Requirements:</h3>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-gray-700">
                    {event.requirements || "No special requirements specified."}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <h3 className="font-semibold mb-4 text-lg">Participants</h3>
                <div className="flex items-center justify-between mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{
                        width: `${Math.min(participationPercentage, 100)}%`,
                      }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm font-medium">
                    {participantsCount}/{maxParticipants}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {spotsRemaining > 0 ? (
                    <span className="text-green-600">
                      {spotsRemaining} spots remaining
                    </span>
                  ) : (
                    <span className="text-red-600">Event is full</span>
                  )}
                </p>

                {event.participants && event.participants.length > 0 && (
                  <div className="mt-5">
                    <h4 className="text-sm font-medium mb-2">
                      Recent Volunteers:
                    </h4>
                    <div className="flex flex-wrap -space-x-2">
                      {event.participants
                        .slice(0, 5)
                        .map((participant, index) => {
                          // Get participant display name based on data structure
                          let displayName = "V";
                          let title = "Volunteer";

                          if (typeof participant === "object") {
                            // Check if participant has name directly
                            if (participant.name) {
                              displayName = participant.name.charAt(0);
                              title = participant.name;
                            }
                            // Check if participant has nested user object with name
                            else if (
                              participant.user &&
                              participant.user.name
                            ) {
                              displayName = participant.user.name.charAt(0);
                              title = participant.user.name;
                            }
                          }

                          return (
                            <div key={index} className="relative" title={title}>
                              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center border-2 border-white">
                                {displayName}
                              </div>
                            </div>
                          );
                        })}
                      {event.participants.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center border-2 border-white">
                          +{event.participants.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Only show join button if user is not the creator */}
              {!isEventCreator() && (
                <button
                  onClick={handleRegisterClick}
                  disabled={!isRegistered && spotsRemaining <= 0}
                  className={`w-full py-3 px-4 rounded-md font-medium text-white transition-colors duration-300 ${
                    isRegistered
                      ? "bg-red-600 hover:bg-red-700"
                      : spotsRemaining <= 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {isRegistered
                    ? "Leave Event"
                    : spotsRemaining <= 0
                    ? "Event Full"
                    : "Join Event"}
                </button>
              )}

              <div className="mt-5 bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2 text-blue-800">
                  What to Expect
                </h3>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-1.5 text-blue-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Coordination and orientation upon arrival
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-1.5 text-blue-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Opportunity to meet like-minded volunteers
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="w-5 h-5 mr-1.5 text-blue-500 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Certificate of participation for your volunteer hours
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function for category colors
function getCategoryColor(category) {
  switch (category?.toLowerCase()) {
    case "environment":
      return "bg-green-100 text-green-800";
    case "food & hunger":
    case "food":
      return "bg-yellow-100 text-yellow-800";
    case "education":
      return "bg-blue-100 text-blue-800";
    case "elderly support":
    case "elderly":
      return "bg-orange-100 text-orange-800";
    case "animal welfare":
    case "animals":
      return "bg-purple-100 text-purple-800";
    case "healthcare":
      return "bg-red-100 text-red-800";
    case "disaster relief":
    case "disaster":
      return "bg-teal-100 text-teal-800";
    case "community development":
    case "community":
      return "bg-indigo-100 text-indigo-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

export default EventDetail;
