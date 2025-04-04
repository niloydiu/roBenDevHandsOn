import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

function CommunityHelp() {
  const navigate = useNavigate();
  const {
    isLoggedIn,
    helpRequests,
    loadingHelpRequests,
    createHelpRequest,
    offerHelp,
    userData,
    deleteHelpRequest,
    hasUserOfferedHelp,
    fetchAllHelpRequests,
  } = useContext(Appcontext);

  const [filteredRequests, setFilteredRequests] = useState([]);
  // Add state to track processing requests
  const [processingRequest, setProcessingRequest] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [newRequest, setNewRequest] = useState({
    title: "",
    description: "",
    location: "",
    urgencyLevel: "medium",
    category: "general",
    contactInfo: "",
  });

  const [filters, setFilters] = useState({
    urgency: "all",
    category: "all",
    showMyRequests: false, // New filter for user's own requests
  });

  // Fetch help requests when component mounts or refreshTrigger changes
  useEffect(() => {
    console.log("Fetching help requests on mount or refresh trigger change");
    fetchAllHelpRequests();
  }, [refreshTrigger]); // Refresh when trigger changes

  // Update filtered requests whenever help requests change
  useEffect(() => {
    console.log("Filtering help requests...", helpRequests?.length || 0);
    if (helpRequests && helpRequests.length > 0) {
      filterRequests(filters);
    } else {
      setFilteredRequests([]);
    }
  }, [helpRequests, userData, filters]); // Added filters as dependency

  // Function to handle input changes for the new request form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle form submission for new help request
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isLoggedIn) {
      navigate("/signup"); // Redirect to signup if the user is not logged in
      return;
    }

    try {
      const result = await createHelpRequest(newRequest);

      if (result.success) {
        // Reset the form
        setNewRequest({
          title: "",
          description: "",
          location: "",
          urgencyLevel: "medium",
          category: "general",
          contactInfo: "",
        });

        alert(result.message);
        // Force refresh
        setRefreshTrigger((prev) => prev + 1);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error creating help request:", error);
      alert("Failed to create help request. Please try again.");
    }
  };

  // Function to handle offering help
  const handleOfferHelpClick = async (requestId) => {
    if (!isLoggedIn) {
      navigate("/signup"); // Redirect to signup if the user is not logged in
      return;
    }

    try {
      setProcessingRequest(requestId);
      const result = await offerHelp(requestId);
      alert(result.message);

      // Force refresh after operation completes
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error("Error with help offer:", error);
      alert("Failed to process your request. Please try again.");
    } finally {
      setProcessingRequest(null);
    }
  };

  // Function to handle deleting a help request
  const handleDeleteHelpRequest = async (requestId) => {
    if (confirm("Are you sure you want to delete this help request?")) {
      try {
        setProcessingRequest(requestId);
        const result = await deleteHelpRequest(requestId);
        alert(result.message);

        // Force refresh after deletion
        setRefreshTrigger((prev) => prev + 1);
      } catch (error) {
        console.error("Error deleting help request:", error);
        alert("Failed to delete the help request. Please try again.");
      } finally {
        setProcessingRequest(null);
      }
    }
  };

  // Function to handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    const newFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(newFilters);
    // We don't need to call filterRequests here since useEffect will handle it
  };

  // Function to toggle the "My Requests" filter
  const handleMyRequestsToggle = () => {
    // Toggle based on current state
    const newFilters = {
      ...filters,
      showMyRequests: !filters.showMyRequests,
    };
    setFilters(newFilters);
    // We don't need to call filterRequests here since useEffect will handle it
  };

  // Function to filter requests based on selected filters
  const filterRequests = (activeFilters) => {
    // Make sure helpRequests exists and is an array
    if (!helpRequests || !Array.isArray(helpRequests)) {
      console.log("No help requests to filter");
      setFilteredRequests([]);
      return;
    }

    let filtered = [...helpRequests];

    // Filter by urgency
    if (activeFilters.urgency !== "all") {
      filtered = filtered.filter(
        (request) => request.urgencyLevel === activeFilters.urgency
      );
    }

    // Filter by category
    if (activeFilters.category !== "all") {
      filtered = filtered.filter(
        (request) =>
          request.category &&
          request.category.toLowerCase() ===
            activeFilters.category.toLowerCase()
      );
    }

    // Filter by user's own requests
    if (activeFilters.showMyRequests && isLoggedIn && userData) {
      filtered = filtered.filter(
        (request) => request.createdBy && request.createdBy._id === userData._id
      );
    }

    console.log(
      `Filtered from ${helpRequests.length} to ${filtered.length} requests`
    );
    setFilteredRequests(filtered);
  };

  // Function to determine urgency badge class
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

  // Function to check if a request was created by the current user
  const isUserRequest = (request) => {
    return (
      isLoggedIn &&
      userData &&
      request.createdBy &&
      request.createdBy._id === userData._id
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Community Help Requests</h1>

      {/* Create New Help Request */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Create New Help Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Title</label>
              <input
                type="text"
                name="title"
                value={newRequest.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Help request title"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Location</label>
              <input
                type="text"
                name="location"
                value={newRequest.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Where is help needed?"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Category</label>
              <select
                name="category"
                value={newRequest.category}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="general">General</option>
                <option value="education">Education</option>
                <option value="health">Healthcare</option>
                <option value="environment">Environmental</option>
                <option value="food">Food & Hunger</option>
                <option value="homelessness">Homelessness</option>
                <option value="animals">Animal Welfare</option>
                <option value="elderly">Elderly Support</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                Urgency Level
              </label>
              <select
                name="urgencyLevel"
                value={newRequest.urgencyLevel}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium">
                Description
              </label>
              <textarea
                name="description"
                value={newRequest.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Describe what help is needed..."
                required
              ></textarea>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">
                Contact Information
              </label>
              <input
                type="text"
                name="contactInfo"
                value={newRequest.contactInfo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Email or phone number"
                required
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                {isLoggedIn ? "Submit Help Request" : "Sign Up to Submit"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Filter Controls */}
      <div className="mb-6 bg-gray-100 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-3">Filter Requests</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block mb-2 text-sm font-medium">Urgency</label>
            <select
              name="urgency"
              value={filters.urgency}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Urgencies</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="urgent">Urgent</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium">Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Categories</option>
              <option value="general">General</option>
              <option value="education">Education</option>
              <option value="health">Healthcare</option>
              <option value="environment">Environmental</option>
              <option value="food">Food & Hunger</option>
              <option value="homelessness">Homelessness</option>
              <option value="animals">Animal Welfare</option>
              <option value="elderly">Elderly Support</option>
              <option value="other">Other</option>
            </select>
          </div>
          {isLoggedIn && (
            <div>
              <label className="block mb-2 text-sm font-medium">
                Filter By
              </label>
              <div className="bg-white border border-gray-300 rounded-md px-4 py-2 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Show only my requests
                </span>
                <button
                  type="button"
                  onClick={handleMyRequestsToggle}
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  role="switch"
                  aria-checked={filters.showMyRequests}
                  style={{
                    backgroundColor: filters.showMyRequests
                      ? "#2563EB"
                      : "#E5E7EB",
                  }}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      filters.showMyRequests ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Debug button to manually refresh help requests */}
      <button
        onClick={() => {
          fetchAllHelpRequests();
          setRefreshTrigger((prev) => prev + 1);
        }}
        className="mb-4 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm"
      >
        🔄 Refresh Help Requests
      </button>

      {/* Help Requests */}
      <div id="help-requests" className="space-y-6">
        <h2 className="text-2xl font-semibold">Current Help Requests</h2>
        {loadingHelpRequests ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2">Loading requests...</p>
          </div>
        ) : !helpRequests || helpRequests.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 rounded-lg">
            <p>No help requests found. Be the first to create one!</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-8 bg-gray-100 rounded-lg">
            <p>
              No help requests match your filters. Try changing your filters or
              create a new request!
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-lg shadow-md p-6"
            >
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
              <div className="mb-3">
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Location:</span>{" "}
                  {request.location}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Category:</span>{" "}
                  {request.category}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Posted by:</span>{" "}
                  {request.createdBy?.name || "Anonymous"}
                  {isUserRequest(request) && " (You)"}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Contact:</span>{" "}
                  {request.contactInfo}
                </p>
                <p className="text-sm text-gray-500">
                  <span className="font-medium">Posted:</span>{" "}
                  {new Date(request.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  <strong>{request.offers}</strong> people have offered to help
                </span>
                {isUserRequest(request) ? (
                  <button
                    onClick={() => handleDeleteHelpRequest(request._id)}
                    disabled={processingRequest === request._id}
                    className={`bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm ${
                      processingRequest === request._id
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {processingRequest === request._id
                      ? "Processing..."
                      : "Delete Request"}
                  </button>
                ) : (
                  <button
                    onClick={() => handleOfferHelpClick(request._id)}
                    disabled={processingRequest === request._id}
                    className={`${
                      hasUserOfferedHelp(request._id)
                        ? "bg-orange-500 hover:bg-orange-600"
                        : "bg-green-600 hover:bg-green-700"
                    } text-white px-4 py-2 rounded-md text-sm ${
                      processingRequest === request._id
                        ? "opacity-70 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {processingRequest === request._id
                      ? "Processing..."
                      : isLoggedIn
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
      </div>
    </div>
  );
}

export default CommunityHelp;
