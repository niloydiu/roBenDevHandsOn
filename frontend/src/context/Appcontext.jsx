import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const Appcontext = createContext();

const AppcontextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState(null);

  // Help requests state
  const [helpRequests, setHelpRequests] = useState([]);
  const [loadingHelpRequests, setLoadingHelpRequests] = useState(true);
  const [userHelpOffers, setUserHelpOffers] = useState({});

  const isLoggedIn = !!token; // Check if the token exists

  // Load user profile data when token is available
  const loadUserProfileData = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        if (
          data.message.includes("invalid") ||
          data.message.includes("expired")
        ) {
          localStorage.removeItem("token");
          setToken(false);
        }
      }
    } catch (error) {
      console.error("Profile loading error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(false);
      }
    }
  };

  // Fetch all events
  const fetchAllEvents = async () => {
    try {
      setLoadingEvents(true);
      const response = await axios.get(`${backendUrl}/api/event`);

      // Check if we received data in the response
      if (response && response.data) {
        // Handle different response structures
        if (Array.isArray(response.data)) {
          // If API returns array directly
          setEvents(response.data);
        } else if (
          response.data.events &&
          Array.isArray(response.data.events)
        ) {
          // If API returns { success: true, events: [...] }
          setEvents(response.data.events);
        } else if (response.data.success && Array.isArray(response.data.data)) {
          // Another common format { success: true, data: [...] }
          setEvents(response.data.data);
        } else {
          // Unexpected structure but has data, log it and try to use it
          console.warn("Unexpected event data structure:", response.data);
          setEvents(Array.isArray(response.data) ? response.data : []);
        }
      } else {
        console.error("Empty response when fetching events");
        setEvents([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error.message || "Unknown error");
      console.error("Full error:", error);
      setError(error.message || "Failed to load events");
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Fetch all help requests
  const fetchAllHelpRequests = async () => {
    try {
      setLoadingHelpRequests(true);
      const { data } = await axios.get(`${backendUrl}/api/help`);
      if (data.success) {
        setHelpRequests(data.helpRequests);

        // Update user help offers state
        if (isLoggedIn && userData) {
          const userOffers = {};
          data.helpRequests.forEach((request) => {
            const hasOffered = request.helpers?.some((helper) =>
              typeof helper === "object"
                ? helper._id === userData._id
                : helper === userData._id
            );
            userOffers[request._id] = hasOffered || false;
          });
          setUserHelpOffers(userOffers);
        }
      } else {
        console.error("Failed to fetch help requests:", data.message);
        setHelpRequests([]);
      }
    } catch (error) {
      console.error("Error fetching help requests:", error);
      setHelpRequests([]);
    } finally {
      setLoadingHelpRequests(false);
    }
  };

  // Create a new help request
  const createHelpRequest = async (newRequest) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/help/create`,
        newRequest,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Update the help requests list with the new request
        setHelpRequests((prev) => [data.helpRequest, ...prev]);
        return { success: true, message: "Help request created successfully!" };
      } else {
        return {
          success: false,
          message: data.message || "Failed to create help request",
        };
      }
    } catch (error) {
      console.error("Error creating help request:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while creating the help request",
      };
    }
  };

  // Offer or withdraw help for an existing request
  const offerHelp = async (requestId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/help/offer/${requestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Update the help requests list with the updated request
        const updatedRequests = helpRequests.map((request) =>
          request._id === requestId ? data.helpRequest : request
        );
        setHelpRequests(updatedRequests);

        // Update user's help offers state
        setUserHelpOffers((prev) => ({
          ...prev,
          [requestId]: data.hasOffered,
        }));

        return {
          success: true,
          message: data.message,
          hasOffered: data.hasOffered,
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to process help offer",
        };
      }
    } catch (error) {
      console.error("Error offering help:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while processing your help offer",
      };
    }
  };

  // Check if user has offered help for a request
  const hasUserOfferedHelp = (requestId) => {
    return !!userHelpOffers[requestId];
  };

  // Delete a help request
  const deleteHelpRequest = async (requestId) => {
    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/help/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Update the help requests list by removing the deleted request
        setHelpRequests((prev) =>
          prev.filter((request) => request._id !== requestId)
        );
        return {
          success: true,
          message: "Help request deleted successfully!",
        };
      } else {
        return {
          success: false,
          message: data.message || "Failed to delete help request",
        };
      }
    } catch (error) {
      console.error("Error deleting help request:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "An error occurred while deleting the help request",
      };
    }
  };

  // Load initial data when component mounts or token changes
  useEffect(() => {
    if (token) {
      loadUserProfileData();
    }
    fetchAllEvents();
    fetchAllHelpRequests();
  }, [token]);

  // Context value to be provided
  const value = {
    backendUrl,
    token,
    setToken,
    isLoggedIn,
    loadUserProfileData,
    userData,
    setUserData,
    events,
    fetchAllEvents,
    loadingEvents,
    error,
    // Help request related values
    helpRequests,
    loadingHelpRequests,
    fetchAllHelpRequests,
    createHelpRequest,
    offerHelp,
    deleteHelpRequest,
    hasUserOfferedHelp,
  };

  return (
    <Appcontext.Provider value={value}>{props.children}</Appcontext.Provider>
  );
};

export default AppcontextProvider;
