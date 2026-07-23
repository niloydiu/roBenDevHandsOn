"use client";
import axios from "axios";
import React, { createContext, useEffect, useState, useContext } from "react";

// Interfaces for our types
export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  googleId?: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  idVerified: boolean;
  verificationLevel: string;
  avgRating: number;
  reviewCount: number;
  streak: number;
  lastActiveDate: string;
  skills: string[];
  causes: string[];
  volunteerHours: number;
  points: number;
  eventsCreatedCount: number;
  teamsCreatedCount: number;
  helpRequestedCount: number;
  helpOfferedCount: number;
  createdAt: string;
  eventsJoined?: Event[];
  teams?: Team[];
}

export interface Event {
  id: string;
  _id?: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  status: string;
  latitude: number;
  longitude: number;
  timeCommitment: string;
  recurring: boolean;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  maxParticipants: number;
  requirements: string;
  image: string;
  creatorId: string;
  creator: User;
  participants: User[];
  createdAt: string;
}

export interface HelpRequest {
  id: string;
  _id?: string;
  title: string;
  description: string;
  location: string;
  urgencyLevel: string;
  status: string;
  latitude: number;
  longitude: number;
  category: string;
  contactInfo: string;
  offers: number;
  creatorId: string;
  creator: User;
  createdBy?: User;
  helpers: User[];
  createdAt: string;
}

export interface Team {
  id: string;
  _id?: string;
  name: string;
  description: string;
  cause: string;
  avatar: string;
  isPublic: boolean;
  creatorId: string;
  creator: User;
  memberCount: number;
  eventsCount: number;
  hoursContributed: number;
  createdAt: string;
  members: Array<{
    id: string;
    userId: string;
    user: User;
    role: string;
    joinedAt: string;
  }>;
  events: Event[];
}

export interface Message {
  id: string;
  message: string;
  read: boolean;
  createdAt: string;
  senderId: string;
  sender: User;
  recipientId: string;
  recipient: User;
  helpId?: string;
  eventId?: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  link: string;
  createdAt: string;
}

export interface PendingHour {
  id: string;
  userId: string;
  user: User;
  eventId: string;
  event: Event;
  hours: number;
  date: string;
  status: string;
  verifications: string[];
  createdAt: string;
}

interface AppContextType {
  backendUrl: string;
  token: string | false;
  setToken: (token: string | false) => void;
  userData: User | null;
  setUserData: (user: User | null) => void;
  events: Event[];
  loadingEvents: boolean;
  error: string | null;
  helpRequests: HelpRequest[];
  loadingHelpRequests: boolean;
  userHelpOffers: Record<string, boolean>;
  isLoggedIn: boolean;
  loadUserProfileData: () => Promise<void>;
  fetchAllEvents: () => Promise<void>;
  fetchAllHelpRequests: () => Promise<void>;
  createHelpRequest: (newRequest: any) => Promise<{ success: boolean; message: string }>;
  offerHelp: (requestId: string) => Promise<{ success: boolean; message: string; hasOffered?: boolean }>;
  hasUserOfferedHelp: (requestId: string) => boolean;
  deleteHelpRequest: (requestId: string) => Promise<{ success: boolean; message: string }>;
  login: (credentials: any) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  joinEvent: (eventId: string) => Promise<{ success: boolean; message?: string }>;
  leaveEvent: (eventId: string) => Promise<{ success: boolean; message?: string }>;
  createEvent: (eventData: any) => Promise<{ success: boolean; message: string; event?: Event }>;
  updateEvent: (eventId: string, eventData: any) => Promise<{ success: boolean; message: string }>;
  deleteEvent: (eventId: string) => Promise<{ success: boolean; message: string }>;
  
  // Teams API
  teams: Team[];
  loadingTeams: boolean;
  fetchAllTeams: () => Promise<void>;
  createTeam: (teamData: any) => Promise<{ success: boolean; message: string; team?: Team }>;
  joinTeam: (teamId: string) => Promise<{ success: boolean; message: string }>;
  leaveTeam: (teamId: string) => Promise<{ success: boolean; message: string }>;
  deleteTeam: (teamId: string) => Promise<{ success: boolean; message: string }>;

  // Notifications API
  notifications: Notification[];
  loadingNotifications: boolean;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Messaging API
  messages: Message[];
  loadingMessages: boolean;
  fetchMessages: (contextType: "event" | "help", contextId: string, otherUserId: string) => Promise<void>;
  sendMessage: (recipientId: string, message: string, contextType: "event" | "help", contextId: string) => Promise<{ success: boolean; message?: string }>;
}

export const Appcontext = createContext<AppContextType | undefined>(undefined);

export const AppcontextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const [token, setTokenState] = useState<string | false>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token") || false;
    }
    return false;
  });

  const setToken = (newToken: string | false) => {
    if (typeof window !== "undefined") {
      if (newToken) {
        localStorage.setItem("token", newToken);
      } else {
        localStorage.removeItem("token");
      }
    }
    setTokenState(newToken);
  };

  const [userData, setUserData] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
  const [loadingHelpRequests, setLoadingHelpRequests] = useState(true);
  const [userHelpOffers, setUserHelpOffers] = useState<Record<string, boolean>>({});

  const [teams, setTeams] = useState<Team[]>([]);
  const [loadingTeams, setLoadingTeams] = useState(true);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const isLoggedIn = !!token;

  const loadUserProfileData = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUserData(response.data.user);
      } else {
        setToken(false);
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      setToken(false);
    }
  };

  const fetchAllEvents = async () => {
    try {
      setLoadingEvents(true);
      let res;
      try {
        res = await axios.get(`${backendUrl}/api/event/get-all-events`);
      } catch (err) {
        res = await axios.get(`/api/event/get-all-events`);
      }
      
      if (res && res.data && res.data.success && Array.isArray(res.data.events) && res.data.events.length > 0) {
        setEvents(res.data.events);
      } else {
        const localRes = await axios.get(`/api/event/get-all-events`);
        setEvents(localRes.data.events || []);
      }
    } catch (error: any) {
      console.error("Failed to fetch events:", error);
      setError(error.message || "Failed to load events");
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchAllHelpRequests = async () => {
    try {
      setLoadingHelpRequests(true);
      let res;
      try {
        res = await axios.get(`${backendUrl}/api/help/get-all-help`);
      } catch (err) {
        res = await axios.get(`/api/help/get-all-help`);
      }
      
      const reqs = res?.data?.helpRequests || res?.data?.data || [];
      if (Array.isArray(reqs) && reqs.length > 0) {
        setHelpRequests(reqs);
      } else {
        const localRes = await axios.get(`/api/help/get-all-help`);
        setHelpRequests(localRes.data.helpRequests || []);
      }
    } catch (error) {
      console.error("Error getting help requests:", error);
      setHelpRequests([]);
    } finally {
      setLoadingHelpRequests(false);
    }
  };

  const createHelpRequest = async (newRequest: any) => {
    try {
      const response = await axios.post(`${backendUrl}/api/help/create`, newRequest, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllHelpRequests();
        return { success: true, message: "Help request created successfully!" };
      }
      return { success: false, message: response.data.message || "Failed to create help request" };
    } catch (error: any) {
      console.error("Error creating help request:", error);
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const offerHelp = async (requestId: string) => {
    try {
      const response = await axios.post(`${backendUrl}/api/help/offer/${requestId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        const newUserHelpOffers = { ...userHelpOffers, [requestId]: response.data.hasOffered };
        setUserHelpOffers(newUserHelpOffers);
        await fetchAllHelpRequests();
        await loadUserProfileData();
        return { success: true, message: response.data.message, hasOffered: response.data.hasOffered };
      }
      return { success: false, message: response.data.message || "Failed to process help offer" };
    } catch (error: any) {
      console.error("Error offering help:", error);
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const hasUserOfferedHelp = (requestId: string) => !!userHelpOffers[requestId];

  const deleteHelpRequest = async (requestId: string) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/help/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllHelpRequests();
        await loadUserProfileData();
        return { success: true, message: "Help request deleted successfully!" };
      }
      return { success: false, message: response.data.message || "Failed to delete help request" };
    } catch (error: any) {
      console.error("Error deleting help request:", error);
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const login = async (credentials: any) => {
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, credentials);
      if (response.data.success) {
        setToken(response.data.token);
        await loadUserProfileData();
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      console.error("Login failed:", error);
      return { success: false, message: error.response?.data?.message || "Login failed" };
    }
  };

  const logout = () => {
    setToken(false);
    setUserData(null);
  };

  const joinEvent = async (eventId: string) => {
    try {
      const response = await axios.post(`${backendUrl}/api/event/join/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllEvents();
        await loadUserProfileData();
        return { success: true, message: "Joined event successfully!" };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const leaveEvent = async (eventId: string) => {
    try {
      const response = await axios.post(`${backendUrl}/api/event/leave/${eventId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllEvents();
        await loadUserProfileData();
        return { success: true, message: "Left event successfully!" };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const createEvent = async (eventData: any) => {
    try {
      const response = await axios.post(`${backendUrl}/api/event/create`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllEvents();
        return { success: true, message: "Event created!", event: response.data.event };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const updateEvent = async (eventId: string, eventData: any) => {
    try {
      const response = await axios.put(`${backendUrl}/api/event/${eventId}`, eventData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllEvents();
        return { success: true, message: "Event updated!" };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/event/${eventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllEvents();
        return { success: true, message: "Event deleted!" };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const fetchAllTeams = async () => {
    try {
      setLoadingTeams(true);
      let res;
      try {
        res = await axios.get(`${backendUrl}/api/team/get-all-teams`);
      } catch (err) {
        res = await axios.get(`/api/team/get-all-teams`);
      }
      const teamsData = Array.isArray(res?.data) ? res.data : (res?.data?.teams || []);
      if (teamsData.length > 0) {
        setTeams(teamsData);
      } else {
        const localRes = await axios.get(`/api/team/get-all-teams`);
        setTeams(localRes.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    } finally {
      setLoadingTeams(false);
    }
  };

  const createTeam = async (teamData: any) => {
    try {
      const response = await axios.post(`${backendUrl}/api/team/create`, teamData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllTeams();
        return { success: true, message: "Team created!", team: response.data.team };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const joinTeam = async (teamId: string) => {
    try {
      const response = await axios.post(`${backendUrl}/api/team/join/${teamId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllTeams();
        await loadUserProfileData();
        return { success: true, message: "Joined team!" };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const leaveTeam = async (teamId: string) => {
    try {
      const response = await axios.post(`${backendUrl}/api/team/leave/${teamId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllTeams();
        await loadUserProfileData();
        return { success: true, message: "Left team!" };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const deleteTeam = async (teamId: string) => {
    try {
      const response = await axios.delete(`${backendUrl}/api/team/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        await fetchAllTeams();
        await loadUserProfileData();
        return { success: true, message: "Team deleted!" };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Something went wrong" };
    }
  };

  const fetchNotifications = async () => {
    if (!token) return;
    try {
      setLoadingNotifications(true);
      const response = await axios.get(`${backendUrl}/api/user/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const markNotificationRead = async (id: string) => {
    if (!token) return;
    try {
      const response = await axios.put(`${backendUrl}/api/user/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }
    } catch (error) {
      console.error("Failed to mark notification read:", error);
    }
  };

  const markAllNotificationsRead = async () => {
    if (!token) return;
    try {
      const response = await axios.put(`${backendUrl}/api/user/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (error) {
      console.error("Failed to mark all notifications read:", error);
    }
  };

  const fetchMessages = async (contextType: "event" | "help", contextId: string, otherUserId: string) => {
    if (!token) return;
    try {
      setLoadingMessages(true);
      const response = await axios.get(`${backendUrl}/api/chat/messages`, {
        params: { contextType, contextId, otherUserId },
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setMessages(response.data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async (recipientId: string, message: string, contextType: "event" | "help", contextId: string) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const response = await axios.post(`${backendUrl}/api/chat/send`, {
        recipientId,
        message,
        contextType,
        contextId
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setMessages(prev => [...prev, response.data.chatMessage]);
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error: any) {
      return { success: false, message: error.response?.data?.message || "Failed to send message" };
    }
  };

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(null);
    }
  }, [token]);

  useEffect(() => {
    fetchAllEvents();
    fetchAllHelpRequests();
    fetchAllTeams();
  }, []);

  return (
    <Appcontext.Provider value={{
      backendUrl, token, setToken, userData, setUserData, events, loadingEvents, error,
      helpRequests, loadingHelpRequests, userHelpOffers, isLoggedIn,
      loadUserProfileData, fetchAllEvents, fetchAllHelpRequests, createHelpRequest,
      offerHelp, hasUserOfferedHelp, deleteHelpRequest, login, logout, joinEvent, leaveEvent,
      createEvent, updateEvent, deleteEvent,
      teams, loadingTeams, fetchAllTeams, createTeam, joinTeam, leaveTeam, deleteTeam,
      notifications, loadingNotifications, fetchNotifications, markNotificationRead, markAllNotificationsRead,
      messages, loadingMessages, fetchMessages, sendMessage
    }}>
      {children}
    </Appcontext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(Appcontext);
  if (!context) throw new Error("useApp must be used within an AppcontextProvider");
  return context;
};

export default AppcontextProvider;

