import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

// Making the context to share data between components
export const Appcontext = createContext();

// This is the main provider component that will wrap our app
const AppcontextProvider = ({ children }) => {
  // Getting backend URL from environment variables, or use localhost if not found
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // State for storing the JWT token - check localStorage first
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  // User data state - null by default until we fetch it
  const [userData, setUserData] = useState(null);
  // Events data - empty array by default
  const [events, setEvents] = useState([]);
  // Loading states for UI spinners
  const [loadingEvents, setLoadingEvents] = useState(true);
  // State for storing any error messages
  const [error, setError] = useState(null);

  // Help requests related states
  const [helpRequests, setHelpRequests] = useState([]);
  const [loadingHelpRequests, setLoadingHelpRequests] = useState(true);
  const [userHelpOffers, setUserHelpOffers] = useState({});

  // This boolean tells us if user is logged in or not
  // !! converts token to true/false
  const isLoggedIn = !!token;

  // This function loads the user profile data from the API
  const loadUserProfileData = async () => {
    // Don't try to load if no token exists
    if (!token) return;

    try {
      // Make the API call with the token in the header
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = response.data;

      // If success is true, update the userData state
      if (data.success) {
        // Update the state with user data
        setUserData(data.user);
      } else {
        // If the token is invalid or expired, remove it
        if (
          data.message?.includes("invalid") ||
          data.message?.includes("expired")
        ) {
          // Remove from localStorage
          localStorage.removeItem("token");
          // Update state
          setToken(false);
        }
      }
    } catch (error) {
      // Log the error
      console.error("Error loading user profile:", error);

      // If we get a 401 error (unauthorized), remove the token
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        setToken(false);
      }
    }
  };

  // This function gets all events from the API
  const fetchAllEvents = async () => {
    try {
      // Set loading to true so we show spinner
      setLoadingEvents(true);

      // Make API call to get events
      const response = await axios.get(`${backendUrl}/api/event`);

      // If we got data
      if (response && response.data) {
        // The API might return data in different formats
        // Handling different cases
        if (Array.isArray(response.data)) {
          // If it's already an array, use it directly
          setEvents(response.data);
        } else if (
          response.data.events &&
          Array.isArray(response.data.events)
        ) {
          // If there's an events property that's an array
          setEvents(response.data.events);
        } else if (response.data.success && Array.isArray(response.data.data)) {
          // If there's a success flag and data array
          setEvents(response.data.data);
        } else {
          // If we don't understand the format, log warning and try our best
          console.error("Unexpected data format for events:", response.data);
          // Use whatever array we can find or an empty array
          setEvents(Array.isArray(response.data) ? response.data : []);
        }
      } else {
        // If no data at all
        console.error("No data received when fetching events");
        setEvents([]);
      }
    } catch (error) {
      // Log error and update error state
      console.error("Failed to fetch events:", error);
      setError(error.message || "Failed to load events");
      setEvents([]);
    } finally {
      // Always set loading to false when done
      setLoadingEvents(false);
    }
  };

  // Function to get all help requests from API
  const fetchAllHelpRequests = async () => {
    try {
      // Set loading to true for spinner
      setLoadingHelpRequests(true);

      // Make API call
      const response = await axios.get(`${backendUrl}/api/help`);
      const data = response.data;

      if (data.success) {
        // Update help requests state with the data
        setHelpRequests(data.helpRequests);

        // Now we need to check which requests the user has offered help for
        if (isLoggedIn && userData) {
          // Create an object to track which requests user has offered help for
          const userOffers = {};

          // Loop through all help requests
          data.helpRequests.forEach((request) => {
            // Check if user is in the helpers array
            let hasOffered = false;

            // Sometimes helper can be an object and sometimes just an ID
            if (request.helpers && request.helpers.length > 0) {
              for (let i = 0; i < request.helpers.length; i++) {
                const helper = request.helpers[i];
                if (typeof helper === "object") {
                  // If helper is an object, compare _id
                  if (helper._id === userData._id) {
                    hasOffered = true;
                    break;
                  }
                } else {
                  // If helper is just an ID string
                  if (helper === userData._id) {
                    hasOffered = true;
                    break;
                  }
                }
              }
            }

            // Store whether user has offered help for this request
            userOffers[request._id] = hasOffered;
          });

          // Update state with user's help offers
          setUserHelpOffers(userOffers);
        }
      } else {
        // If not successful, log error and set empty array
        console.error("Failed to get help requests:", data.message);
        setHelpRequests([]);
      }
    } catch (error) {
      // Log error and set empty array
      console.error("Error getting help requests:", error);
      setHelpRequests([]);
    } finally {
      // Always turn off loading spinner
      setLoadingHelpRequests(false);
    }
  };

  // Function to create a new help request
  const createHelpRequest = async (newRequest) => {
    try {
      // Make API call to create help request
      const response = await axios.post(
        `${backendUrl}/api/help/create`,
        newRequest, // The data for the new request
        {
          headers: {
            Authorization: `Bearer ${token}`, // Need the token for auth
          },
        }
      );

      const data = response.data;

      // If successful
      if (data.success) {
        // Fetch all help requests to ensure data is fresh
        await fetchAllHelpRequests();

        // Return success
        return { success: true, message: "Help request created successfully!" };
      } else {
        // Return the error from API
        return {
          success: false,
          message: data.message || "Failed to create help request",
        };
      }
    } catch (error) {
      // Log error and return error message
      console.error("Error creating help request:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Something went wrong when creating the help request",
      };
    }
  };

  // Function to offer or withdraw help for a request
  const offerHelp = async (requestId) => {
    try {
      // Make API call to offer help
      const response = await axios.post(
        `${backendUrl}/api/help/offer/${requestId}`,
        {}, // Empty object since we're not sending any data
        {
          headers: {
            Authorization: `Bearer ${token}`, // Need the token for auth
          },
        }
      );

      const data = response.data;

      // If successful
      if (data.success) {
        // Update the userHelpOffers state immediately for UI feedback
        const newUserHelpOffers = { ...userHelpOffers };
        newUserHelpOffers[requestId] = data.hasOffered;
        setUserHelpOffers(newUserHelpOffers);

        // Then fetch fresh data from the server to ensure consistency
        await fetchAllHelpRequests();

        // Also refresh user profile data since help stats may have changed
        await loadUserProfileData();

        // Return success
        return {
          success: true,
          message: data.message,
          hasOffered: data.hasOffered,
        };
      } else {
        // Return error from API
        return {
          success: false,
          message: data.message || "Failed to process help offer",
        };
      }
    } catch (error) {
      // Log error and return error message
      console.error("Error offering help:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Something went wrong when offering help",
      };
    }
  };

  // Function to check if user has offered help for a specific request
  const hasUserOfferedHelp = (requestId) => {
    // If userHelpOffers[requestId] is true, return true, otherwise return false
    return !!userHelpOffers[requestId];
  };

  // Function to delete a help request
  const deleteHelpRequest = async (requestId) => {
    try {
      // Make API call to delete the request
      const response = await axios.delete(
        `${backendUrl}/api/help/${requestId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Need the token for auth
          },
        }
      );

      const data = response.data;

      // If successful
      if (data.success) {
        // Fetch all help requests to ensure data is fresh
        await fetchAllHelpRequests();

        // Also refresh user profile data since help stats may have changed
        await loadUserProfileData();

        // Return success
        return {
          success: true,
          message: "Help request deleted successfully!",
        };
      } else {
        // Return error from API
        return {
          success: false,
          message: data.message || "Failed to delete help request",
        };
      }
    } catch (error) {
      // Log error and return error message
      console.error("Error deleting help request:", error);
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Something went wrong when deleting the help request",
      };
    }
  };

  // Function to log in a user
  const login = async (credentials) => {
    try {
      // Make API call to login
      const response = await axios.post(
        `${backendUrl}/api/user/login`,
        credentials // Email and password
      );

      const data = response.data;

      // If successful
      if (data.success) {
        // Save token to localStorage
        localStorage.setItem("token", data.token);
        // Update token state
        setToken(data.token);
        // Load user data now that we're logged in
        await loadUserProfileData();
        // Return success
        return { success: true };
      } else {
        // Return error from API
        return { success: false, message: data.message };
      }
    } catch (error) {
      // Log error and return error message
      console.error("Login failed:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  // Function to log out a user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem("token");
    // Update state
    setToken(false);
    // Clear user data
    setUserData(null);
  };

  // Function to join an event
  const joinEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/event/join/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Refresh events and user data
        await fetchAllEvents();
        await loadUserProfileData();
        return {
          success: true,
          message: "Successfully joined the event",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to join event",
        };
      }
    } catch (error) {
      console.error("Error joining event:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error joining event",
      };
    }
  };

  // Function to leave an event
  const leaveEvent = async (eventId) => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/event/leave/${eventId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        // Refresh events and user data
        await fetchAllEvents();
        await loadUserProfileData();
        return {
          success: true,
          message: "Successfully left the event",
        };
      } else {
        return {
          success: false,
          message: response.data.message || "Failed to leave event",
        };
      }
    } catch (error) {
      console.error("Error leaving event:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Error leaving event",
      };
    }
  };

  // Set up periodic refresh for data
  useEffect(() => {
    if (isLoggedIn) {
      // Refresh data every 60 seconds if user is logged in
      const interval = setInterval(() => {
        fetchAllEvents();
        fetchAllHelpRequests();
        loadUserProfileData();
      }, 60000);

      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // This useEffect runs when the component mounts or when token changes
  useEffect(() => {
    // Load user data if we have a token
    if (token) {
      loadUserProfileData();
    }
    // Always load events and help requests
    fetchAllEvents();
    fetchAllHelpRequests();
  }, [token]); // This runs again if token changes

  // All the values we want to provide to components using this context
  const value = {
    backendUrl, // URL for API calls
    token, // JWT token
    setToken, // Function to update token
    isLoggedIn, // Boolean whether user is logged in
    loadUserProfileData, // Function to load user data
    userData, // User data object
    setUserData, // Function to update user data
    events, // Array of events
    fetchAllEvents, // Function to get events
    loadingEvents, // Boolean whether events are loading
    error, // Error message
    login, // Function to log in
    logout, // Function to log out
    joinEvent, // Function to join an event
    leaveEvent, // Function to leave an event

    // Help request related values
    helpRequests, // Array of help requests
    loadingHelpRequests, // Boolean whether help requests are loading
    fetchAllHelpRequests, // Function to get help requests
    createHelpRequest, // Function to create a help request
    offerHelp, // Function to offer help for a request
    deleteHelpRequest, // Function to delete a help request
    hasUserOfferedHelp, // Function to check if user has offered help
  };

  // Return the provider with all children wrapped inside
  return <Appcontext.Provider value={value}>{children}</Appcontext.Provider>;
};

// Export the provider component
export default AppcontextProvider;
