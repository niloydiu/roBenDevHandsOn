import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Appcontext } from "../../context/Appcontext";

const FeaturedEvents = () => {
  const { events, loadingEvents, user, token, backendUrl } =
    useContext(Appcontext);

  // Limit the number of events displayed to 3
  const featuredEvents = events.slice(0, 3);

  // Function to handle joining an event
  const handleJoinEvent = async (eventId) => {
    if (!token) {
      alert("Please login to join this event");
      return;
    }

    try {
      // Add your join event API call here
      alert("You've joined this event successfully!");
    } catch (error) {
      alert("Failed to join event. Please try again.");
    }
  };

  // Function to get category badge color
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case "environment":
        return "bg-green-100 text-green-800";
      case "food & hunger":
        return "bg-yellow-100 text-yellow-800";
      case "education":
        return "bg-blue-100 text-blue-800";
      case "elderly support":
        return "bg-orange-100 text-orange-800";
      case "animal welfare":
        return "bg-purple-100 text-purple-800";
      case "healthcare":
        return "bg-red-100 text-red-800";
      case "disaster relief":
        return "bg-teal-100 text-teal-800";
      case "community development":
        return "bg-indigo-100 text-indigo-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {loadingEvents ? (
        <div className="col-span-3 flex justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-blue-200 mb-3"></div>
            <div className="text-center text-gray-500">Loading events...</div>
          </div>
        </div>
      ) : featuredEvents.length === 0 ? (
        <div className="col-span-3 text-center py-12">
          <svg
            className="w-12 h-12 mx-auto text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <p className="mt-3 text-gray-500 text-lg">
            No upcoming events found.
          </p>
        </div>
      ) : (
        featuredEvents.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-40 bg-gradient-to-r from-blue-500 to-indigo-600 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-lg font-semibold">
                  {event.category || "Volunteer Opportunity"}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Category Badge */}
              <div className="mb-3">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                    event.category
                  )}`}
                >
                  {event.category}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold mb-3 text-gray-800">
                {event.title}
              </h2>

              {/* Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-3 mb-6">
                {/* Date */}
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
                    {new Date(event.date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* Time */}
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
                    {event.startTime} - {event.endTime}
                  </span>
                </div>

                {/* Location */}
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
                  <span className="truncate">{event.location}</span>
                </div>

                {/* Participants */}
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
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    ></path>
                  </svg>
                  <span>
                    {event.participants?.length || 0} / {event.maxParticipants}{" "}
                    participants
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => handleJoinEvent(event._id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-300"
                >
                  Join Event
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
        ))
      )}
    </div>
  );
};

export default FeaturedEvents;
