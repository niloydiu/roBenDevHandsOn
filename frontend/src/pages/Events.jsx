import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

function Events() {
  const {
    events,
    loadingEvents,
    token,
    backendUrl,
    userData,
    fetchAllEvents,
    isLoggedIn,
  } = useContext(Appcontext);
  const navigate = useNavigate();
  const [isJoining, setIsJoining] = useState(false);
  const [joinedEventIds, setJoinedEventIds] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    date: "",
    showMyEvents: false,
  });

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Toggle function for "Show My Events"
  const handleMyEventsToggle = () => {
    setFilters({
      ...filters,
      showMyEvents: !filters.showMyEvents,
    });
  };

  // Function to check if an event was created by the current user
  const isUserEvent = (event) => {
    if (!userData || !event.createdBy) return false;

    // Handle different data structures for createdBy
    if (typeof event.createdBy === "object") {
      return event.createdBy._id === userData._id;
    }
    return event.createdBy === userData._id;
  };

  // Function to handle joining an event
  const handleJoinEvent = async (eventId, e) => {
    // Stop event propagation so it doesn't trigger any parent elements' click events
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      alert("Please login to join this event");
      navigate("/login");
      return;
    }

    try {
      setIsJoining(true);
      await axios.post(
        `${backendUrl}/api/event/join/${eventId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Add the joined event ID to our state
      setJoinedEventIds((prev) => [...prev, eventId]);

      // Refresh events to get updated participant counts
      await fetchAllEvents();

      alert("You've joined this event successfully!");
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        "Failed to join event. Please try again.";
      alert(errorMsg);
    } finally {
      setIsJoining(false);
    }
  };

  const isUserParticipant = (event) => {
    // Check if event is in our locally joined events
    if (joinedEventIds.includes(event._id)) return true;

    // Check if user is already a participant
    if (!userData || !event.participants) return false;

    return event.participants.some((participant) => {
      if (typeof participant === "object") {
        return (
          participant._id === userData._id || participant.user === userData._id
        );
      }
      return participant === userData._id;
    });
  };

  const isEventFull = (event) => {
    const participantsCount = event.participants?.length || 0;
    return participantsCount >= event.maxParticipants;
  };

  // Filter events based on user filters
  const filteredEvents = events
    .filter((event) => {
      // Category filter
      const matchesCategory =
        !filters.category || event.category === filters.category;

      // Location filter
      const matchesLocation =
        !filters.location ||
        event.location.toLowerCase().includes(filters.location.toLowerCase());

      // Date filter - Fix by normalizing date formats
      let matchesDate = true;
      if (filters.date) {
        // Get just the date part in YYYY-MM-DD format from the event date
        const eventDate = new Date(event.date).toISOString().split("T")[0];
        // Compare with the filter date which is already in YYYY-MM-DD format
        matchesDate = eventDate === filters.date;
      }

      // Creator filter - only apply if showMyEvents is true
      const matchesCreator = !filters.showMyEvents || isUserEvent(event);

      return (
        matchesCategory && matchesLocation && matchesDate && matchesCreator
      );
    })
    // Sort events by date (closest dates first)
    .sort((a, b) => {
      // Convert string dates to Date objects for proper comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Filter out past events
      const now = new Date();
      const isPastA = dateA < now;
      const isPastB = dateB < now;

      // If one is past and one is future, future comes first
      if (isPastA && !isPastB) return 1;
      if (!isPastA && isPastB) return -1;

      // Otherwise sort by closest date
      return dateA - dateB;
    });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Volunteer Events</h1>
        <Link
          to="/create-event"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow transition duration-300"
        >
          Create Event
        </Link>
      </div>
      {/* Filter Section  */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First row */}
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Environmental">Environmental</option>
              <option value="Education">Education</option>
              <option value="Hunger Relief">Hunger Relief</option>
              <option value="Community Support">Community Support</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Animal Welfare">Animal Welfare</option>
              <option value="Crisis Response">Crisis Response</option>
              <option value="Arts & Culture">Arts & Culture</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              placeholder="Enter location"
              className="w-full p-2 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Second row */}
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 bg-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Add My Events toggle filter */}
          {isLoggedIn ? (
            <div>
              <label className="block text-sm font-medium mb-1">Creator</label>
              <div className="bg-white border border-gray-300 rounded-md px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Show only my events
                </span>
                <button
                  type="button"
                  onClick={handleMyEventsToggle}
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  role="switch"
                  aria-checked={filters.showMyEvents}
                  style={{
                    backgroundColor: filters.showMyEvents
                      ? "#2563EB"
                      : "#E5E7EB",
                  }}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      filters.showMyEvents ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          ) : (
            // Empty placeholder div when not logged in to maintain grid layout
            <div className="hidden md:block"></div>
          )}
        </div>
      </div>
      {/* Event Listings */}
      {loadingEvents ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="mt-4 text-xl text-gray-500">
            No events found matching your filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event._id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white"
            >
              <div className="h-36 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-medium relative">
                {event.category}
                {isUserEvent(event) && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    Your Event
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-800 line-clamp-1">
                    {event.title}
                  </h2>
                  {/* Date badge that shows how soon the event is */}
                  {(() => {
                    const eventDate = new Date(event.date);
                    const today = new Date();
                    const diffTime = eventDate - today;
                    const diffDays = Math.ceil(
                      diffTime / (1000 * 60 * 60 * 24)
                    );

                    if (diffDays < 0) {
                      return (
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600 whitespace-nowrap">
                          Past event
                        </span>
                      );
                    } else if (diffDays === 0) {
                      return (
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 whitespace-nowrap">
                          Today
                        </span>
                      );
                    } else if (diffDays === 1) {
                      return (
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 whitespace-nowrap">
                          Tomorrow
                        </span>
                      );
                    } else if (diffDays <= 7) {
                      return (
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 whitespace-nowrap">
                          This week
                        </span>
                      );
                    } else {
                      return (
                        <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 whitespace-nowrap">
                          {`In ${diffDays} days`}
                        </span>
                      );
                    }
                  })()}
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                <div className="text-sm text-gray-500 space-y-2">
                  <p className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
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
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <p className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
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
                    <span className="font-medium">Time:</span> {event.startTime}{" "}
                    - {event.endTime}
                  </p>
                  <p className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 text-blue-600"
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
                    <span className="font-medium">Location:</span>{" "}
                    {event.location}
                  </p>
                </div>

                {/* Participants Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Participants</span>
                    <span className="font-medium">
                      {event.participants?.length || 0}/{event.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          ((event.participants?.length || 0) /
                            event.maxParticipants) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="mt-5 flex space-x-3 pt-3 border-t border-gray-100">
                  <button
                    onClick={(e) => handleJoinEvent(event._id, e)}
                    disabled={
                      isJoining ||
                      isUserParticipant(event) ||
                      isEventFull(event)
                    }
                    className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors duration-300 ${
                      isUserParticipant(event)
                        ? "bg-green-500 text-white cursor-default"
                        : isEventFull(event)
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                    }`}
                  >
                    {isUserParticipant(event)
                      ? "Joined"
                      : isEventFull(event)
                      ? "Full"
                      : "Join Event"}
                  </button>
                  <Link
                    to={`/events/${event._id}`}
                    className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded-md font-medium text-center transition-colors duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
