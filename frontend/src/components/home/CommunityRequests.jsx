import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontext } from "../../context/Appcontext";

const CommunityRequests = () => {
  const navigate = useNavigate();
  const {
    helpRequests,
    loadingHelpRequests,
    isLoggedIn,
    offerHelp,
    userData,
    deleteHelpRequest,
    hasUserOfferedHelp,
  } = useContext(Appcontext);

  // Get urgency level badge class
  const getUrgencyBadgeClass = (level) => {
    switch (level) {
      case "urgent":
        return "bg-red-600 text-white";
      case "medium":
        return "bg-yellow-500 text-white";
      case "low":
        return "bg-blue-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Check if a request was created by the current user
  const isUserRequest = (request) => {
    return isLoggedIn && userData && request.createdBy?._id === userData._id;
  };

  // Handle offer help button click
  const handleOfferHelpClick = async (requestId) => {
    if (!isLoggedIn) {
      navigate("/signup"); // Redirect to signup if the user is not logged in
      return;
    }

    const result = await offerHelp(requestId);
    alert(result.message);
  };

  // Handle delete help request button click
  const handleDeleteHelpRequest = async (requestId) => {
    if (confirm("Are you sure you want to delete this help request?")) {
      const result = await deleteHelpRequest(requestId);
      alert(result.message);
    }
  };

  // Display only the first 3 help requests for the homepage
  const displayRequests = helpRequests.slice(0, 3);

  return (
    <div className="space-y-6">
      {loadingHelpRequests ? (
        <div className="text-center py-8">
          <p>Loading requests...</p>
        </div>
      ) : displayRequests.length === 0 ? (
        <div className="text-center py-8 bg-gray-100 rounded-lg">
          <p>No help requests found. Be the first to create one!</p>
        </div>
      ) : (
        displayRequests.map((request) => (
          <div key={request._id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold mb-2">{request.title}</h3>
              <span
                className={`px-3 py-1 text-sm rounded-full ${getUrgencyBadgeClass(
                  request.urgencyLevel
                )}`}
              >
                {request.urgencyLevel.charAt(0).toUpperCase() +
                  request.urgencyLevel.slice(1)}
              </span>
            </div>
            <p className="mb-3 text-gray-600">{request.description}</p>
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{request.location}</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span>{request.category}</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                <span>
                  {request.createdBy?.name || "Anonymous"}
                  {isUserRequest(request) && " (You)"}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">
                <strong>{request.offers}</strong> people have offered to help
              </span>
              {isUserRequest(request) ? (
                <button
                  onClick={() => handleDeleteHelpRequest(request._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
                >
                  Delete Request
                </button>
              ) : (
                <button
                  onClick={() => handleOfferHelpClick(request._id)}
                  className={`${
                    hasUserOfferedHelp(request._id)
                      ? "bg-orange-500 hover:bg-orange-600"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-4 py-2 rounded-md text-sm`}
                >
                  {isLoggedIn
                    ? hasUserOfferedHelp(request._id)
                      ? "Withdraw Offer"
                      : "Offer Help"
                    : "Sign Up to Help"}
                </button>
              )}
            </div>
          </div>
        ))
      )}
      {helpRequests.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/community-help")}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            View All Help Requests
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunityRequests;
