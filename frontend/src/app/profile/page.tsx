"use client";
import React, { useContext, useState, useEffect, useMemo } from "react";
import { Appcontext } from "../../context/Appcontext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User as UserIcon, Mail, ShieldCheck, Star, Zap, Award, 
  Calendar, Clock, Users, Heart, LogOut, CheckCircle2, 
  Edit3, ArrowRight, Activity, Plus, Trash2, MapPin, 
  Sparkles, Layers
} from "lucide-react";
import PageWrapper from "../../components/PageWrapper";
import Pagination from "../../components/Pagination";
import DateDisplay from "../../components/DateDisplay";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { 
    userData, 
    token, 
    logout, 
    loadUserProfileData, 
    events, 
    teams, 
    helpRequests, 
    deleteEvent, 
    deleteTeam, 
    deleteHelpRequest, 
    leaveEvent, 
    leaveTeam,
    updateUserProfile,
    fetchAllEvents,
    fetchAllTeams,
    fetchAllHelpRequests
  } = useContext(Appcontext) || {};

  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  // Edit Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    avatar: "",
    skills: "",
    causes: "",
  });

  // Dashboard Tabs: 'created' | 'joined' | 'overview'
  const [activeTab, setActiveTab] = useState<"created" | "joined" | "overview">("created");
  // Section Filter: 'all' | 'events' | 'teams' | 'aids'
  const [subType, setSubType] = useState<"all" | "events" | "teams" | "aids">("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  useEffect(() => {
    setMounted(true);
    if (token && loadUserProfileData) {
      loadUserProfileData();
    }
    if (fetchAllEvents) fetchAllEvents();
    if (fetchAllTeams) fetchAllTeams();
    if (fetchAllHelpRequests) fetchAllHelpRequests();
  }, [token]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, subType]);

  if (!mounted) return null;

  if (!token) {
    return (
      <PageWrapper>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
          <div className="w-full max-w-sm card-saas !p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <UserIcon size={24} />
            </div>
            <h2 className="text-lg font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">Authentication Required</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Please sign in to access your volunteer profile dashboard and manage your activities.
            </p>
            <div className="space-y-2">
              <Link href="/login" className="btn-saas btn-primary w-full text-xs justify-center">
                Sign In
              </Link>
              <Link href="/signup" className="btn-saas btn-secondary w-full text-xs justify-center">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const userId = userData?._id || userData?.id;

  const user: any = userData || {
    name: "Volunteer Member",
    email: "volunteer@handson.org",
    avatar: "",
    bio: "Dedicated community volunteer.",
    verificationLevel: "Tier 3 Verified",
    avgRating: 4.9,
    reviewCount: 28,
    streak: 12,
    volunteerHours: 84,
    points: 1250,
    skills: ["Event Organization", "Community Outreach", "First Aid", "Disaster Relief"],
    causes: ["Environment", "Youth Education", "Food Security"],
    createdAt: "2024-01-15"
  };

  // --- Created Data Filters ---
  const myCreatedEvents = (events || []).filter(e => {
    const creatorId = typeof e.creator === 'object' ? (e.creator._id || e.creator.id) : e.creator || e.creatorId;
    return creatorId === userId;
  });

  const myCreatedTeams = (teams || []).filter(t => {
    const creatorId = typeof t.creator === 'object' ? (t.creator._id || t.creator.id) : t.creator || t.creatorId;
    return creatorId === userId;
  });

  const myCreatedAids = (helpRequests || []).filter(h => {
    const creatorId = typeof h.createdBy === 'object' ? (h.createdBy._id || h.createdBy.id) : h.createdBy || h.creatorId;
    return creatorId === userId;
  });

  // --- Joined Data Filters ---
  const myJoinedEvents = (events || []).filter(e => {
    const isJoined = e.participants?.some((p: any) => (typeof p === 'object' ? (p._id || p.id) : p) === userId);
    const isCreator = (typeof e.creator === 'object' ? (e.creator._id || e.creator.id) : e.creator || e.creatorId) === userId;
    return isJoined && !isCreator;
  });

  const myJoinedTeams = (teams || []).filter(t => {
    const isMember = t.members?.some((m: any) => (m.userId || (typeof m.user === 'object' ? m.user._id || m.user.id : m.user)) === userId);
    const isCreator = (typeof t.creator === 'object' ? (t.creator._id || t.creator.id) : t.creator || t.creatorId) === userId;
    return isMember && !isCreator;
  });

  const myOfferedAids = (helpRequests || []).filter(h => {
    const isHelper = h.helpers?.some((hp: any) => (typeof hp === 'object' ? (hp._id || hp.id) : hp) === userId);
    const isCreator = (typeof h.createdBy === 'object' ? (h.createdBy._id || h.createdBy.id) : h.createdBy || h.creatorId) === userId;
    return isHelper && !isCreator;
  });

  // Consolidate current active list based on subType
  const getActiveList = () => {
    if (activeTab === "created") {
      let items: any[] = [];
      if (subType === "all" || subType === "events") {
        items = items.concat(myCreatedEvents.map(item => ({ ...item, _type: 'event' })));
      }
      if (subType === "all" || subType === "teams") {
        items = items.concat(myCreatedTeams.map(item => ({ ...item, _type: 'team' })));
      }
      if (subType === "all" || subType === "aids") {
        items = items.concat(myCreatedAids.map(item => ({ ...item, _type: 'aid' })));
      }
      return items;
    } else if (activeTab === "joined") {
      let items: any[] = [];
      if (subType === "all" || subType === "events") {
        items = items.concat(myJoinedEvents.map(item => ({ ...item, _type: 'event' })));
      }
      if (subType === "all" || subType === "teams") {
        items = items.concat(myJoinedTeams.map(item => ({ ...item, _type: 'team' })));
      }
      if (subType === "all" || subType === "aids") {
        items = items.concat(myOfferedAids.map(item => ({ ...item, _type: 'aid' })));
      }
      return items;
    }
    return [];
  };

  const activeList = getActiveList();
  const totalPages = Math.ceil(activeList.length / pageSize);
  const paginatedList = activeList.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Deletion & Action Handlers
  const handleDeleteItem = async (item: any) => {
    const itemId = item._id || item.id;
    if (item._type === "event") {
      if (deleteEvent) {
        const res = await deleteEvent(itemId);
        if (res.success) toast.success("Event deleted successfully");
        else toast.error(res.message || "Failed to delete event");
      }
    } else if (item._type === "team") {
      if (deleteTeam) {
        const res = await deleteTeam(itemId);
        if (res.success) toast.success("Team deleted successfully");
        else toast.error(res.message || "Failed to delete team");
      }
    } else if (item._type === "aid") {
      if (deleteHelpRequest) {
        const res = await deleteHelpRequest(itemId);
        if (res.success) toast.success("Mutual aid request deleted");
        else toast.error(res.message || "Failed to delete request");
      }
    }
  };

  const handleLeaveItem = async (item: any) => {
    const itemId = item._id || item.id;
    if (item._type === "event" && leaveEvent) {
      const res = await leaveEvent(itemId);
      if (res.success) toast.success("Left event");
      else toast.error(res.message || "Failed to leave event");
    } else if (item._type === "team" && leaveTeam) {
      const res = await leaveTeam(itemId);
      if (res.success) toast.success("Left team");
      else toast.error(res.message || "Failed to leave team");
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* User Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-saas !p-6 relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xl flex items-center justify-center shadow-md ring-4 ring-emerald-500/10 shrink-0">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span>{user.name ? user.name.charAt(0).toUpperCase() : "V"}</span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{user.name}</h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck size={12} />
                      {user.verificationLevel || "Verified Volunteer"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
                    <Mail size={12} />
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => {
                    setProfileForm({
                      name: user.name || "",
                      email: user.email || "",
                      avatar: user.avatar || "",
                      skills: Array.isArray(user.skills) ? user.skills.join(", ") : "",
                      causes: Array.isArray(user.causes) ? user.causes.join(", ") : "",
                    });
                    setIsEditProfileOpen(true);
                  }}
                  className="btn-saas btn-secondary text-xs shrink-0"
                >
                  <Edit3 size={14} />
                  <span>Edit Profile</span>
                </button>
                <Link href="/create-event" className="btn-saas btn-primary text-xs shrink-0">
                  <Plus size={14} />
                  <span>New Event</span>
                </Link>
                <button
                  onClick={() => {
                    if (logout) logout();
                    router.push("/login");
                  }}
                  className="btn-saas btn-secondary text-xs flex-1 md:flex-initial justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/40"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card-saas !p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Volunteer Hours</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{user.volunteerHours || 84} hrs</p>
              </div>
            </div>

            <div className="card-saas !p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Impact Points</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{user.points || 1250} pts</p>
              </div>
            </div>

            <div className="card-saas !p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Created Items</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{myCreatedEvents.length + myCreatedTeams.length + myCreatedAids.length}</p>
              </div>
            </div>

            <div className="card-saas !p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Heart size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Joined / Supported</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{myJoinedEvents.length + myJoinedTeams.length + myOfferedAids.length}</p>
              </div>
            </div>
          </div>

          {/* Profile Navigation Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 gap-3">
            {[
              { id: "created", label: "My Created Initiatives", icon: Layers, count: myCreatedEvents.length + myCreatedTeams.length + myCreatedAids.length },
              { id: "joined", label: "Joined / Supported", icon: Users, count: myJoinedEvents.length + myJoinedTeams.length + myOfferedAids.length },
              { id: "overview", label: "Profile Overview", icon: Award }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    isActive 
                      ? "border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400" 
                      : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sub Type Filter for Created / Joined tabs */}
          {activeTab !== "overview" && (
            <div className="flex gap-2 text-xs">
              {[
                { id: "all", label: "All Items" },
                { id: "events", label: "Events" },
                { id: "teams", label: "Teams" },
                { id: "aids", label: "Mutual Aid Requests" }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setSubType(sub.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                    subType === sub.id
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>
          )}

          {/* Tab Content Display */}
          <AnimatePresence mode="wait">
            {activeTab === "overview" ? (
              <motion.div 
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-6"
              >
                <div className="card-saas !p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Award size={16} className="text-emerald-500" />
                    <span>Verification Badges</span>
                  </h3>
                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-100/50 dark:bg-zinc-900">
                      <span className="text-zinc-600 dark:text-zinc-400">Phone Verified</span>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-100/50 dark:bg-zinc-900">
                      <span className="text-zinc-600 dark:text-zinc-400">Email Verified</span>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                    <div className="flex items-center justify-between p-2 rounded bg-zinc-100/50 dark:bg-zinc-900">
                      <span className="text-zinc-600 dark:text-zinc-400">ID Credentials</span>
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 card-saas !p-6 space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                    <Heart size={16} className="text-emerald-500" />
                    <span>Skills & Supported Causes</span>
                  </h3>
                  
                  <div className="space-y-3 text-xs">
                    <div>
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-1.5">Verified Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(user.skills || ["Event Organization", "Community Outreach", "First Aid"]).map((skill: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2">
                      <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-1.5">Primary Causes</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(user.causes || ["Environment", "Youth Education", "Food Security"]).map((cause: string, i: number) => (
                          <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-500/20">
                            {cause}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`${activeTab}-${subType}-${currentPage}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                className="space-y-4"
              >
                {paginatedList.length === 0 ? (
                  <div className="card-saas !p-12 text-center">
                    <Sparkles size={32} className="mx-auto mb-3 text-zinc-400" />
                    <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                      No {activeTab === "created" ? "created" : "joined"} items found
                    </h3>
                    <p className="text-zinc-500 text-xs mb-4">
                      {activeTab === "created" 
                        ? "You haven't published any items in this category yet." 
                        : "You haven't joined or offered support to any items in this category yet."}
                    </p>
                    {activeTab === "created" ? (
                      <Link href="/create-event" className="btn-saas btn-primary text-xs">
                        Create New Event
                      </Link>
                    ) : (
                      <Link href="/events" className="btn-saas btn-primary text-xs">
                        Browse Initiatives
                      </Link>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                      {paginatedList.map(item => {
                        const itemId = item._id || item.id;
                        const isEvent = item._type === 'event' || item.maxParticipants !== undefined;
                        const isTeam = item._type === 'team' || item.cause !== undefined;

                        return (
                          <div key={itemId} className="card-saas flex flex-col justify-between">
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                                  isEvent 
                                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200/50' 
                                    : isTeam 
                                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50' 
                                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/50'
                                }`}>
                                  {isEvent ? "Event" : isTeam ? "Team" : "Mutual Aid"}
                                </span>
                                {item.category || item.cause ? (
                                  <span className="text-[10px] font-medium text-zinc-500">
                                    {item.category || item.cause}
                                  </span>
                                ) : null}
                              </div>

                              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1.5 line-clamp-1">
                                {item.title || item.name}
                              </h3>

                              <p className="text-zinc-600 dark:text-zinc-400 text-xs mb-3 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>

                              {item.location && (
                                <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-3">
                                  <MapPin size={12} className="text-emerald-500 shrink-0" />
                                  <span className="truncate">{item.location}</span>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                              {isEvent && (
                                <Link href={`/events/${itemId}`} className="btn-saas btn-secondary !h-8 text-xs flex-1 justify-center">
                                  Details
                                </Link>
                              )}
                              {isTeam && (
                                <Link href={`/teams/${itemId}`} className="btn-saas btn-secondary !h-8 text-xs flex-1 justify-center">
                                  View Hub
                                </Link>
                              )}
                              {!isEvent && !isTeam && (
                                <Link href={`/community-help`} className="btn-saas btn-secondary !h-8 text-xs flex-1 justify-center">
                                  View Request
                                </Link>
                              )}

                              {activeTab === "created" ? (
                                <>
                                  {isEvent && (
                                    <Link href={`/edit-event/${itemId}`} className="btn-saas btn-outline !h-8 !px-2.5" title="Edit Event">
                                      <Edit3 size={13} />
                                    </Link>
                                  )}
                                  {isTeam && (
                                    <Link href={`/edit-team/${itemId}`} className="btn-saas btn-outline !h-8 !px-2.5" title="Edit Team">
                                      <Edit3 size={13} />
                                    </Link>
                                  )}
                                  <button
                                    onClick={() => handleDeleteItem(item)}
                                    className="btn-saas text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 !h-8 !px-2.5 border-rose-200 dark:border-rose-900/40"
                                    title="Delete Item"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleLeaveItem(item)}
                                  className="btn-saas text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 !h-8 !px-3 text-xs"
                                >
                                  Leave
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {totalPages > 1 && (
                      <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                      />
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 w-full max-w-md shadow-xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Edit Profile Details</h3>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (updateUserProfile) {
                    const skillsArray = profileForm.skills.split(",").map(s => s.trim()).filter(Boolean);
                    const causesArray = profileForm.causes.split(",").map(c => c.trim()).filter(Boolean);

                    const res = await updateUserProfile({
                      name: profileForm.name,
                      email: profileForm.email,
                      avatar: profileForm.avatar,
                      skills: skillsArray,
                      causes: causesArray,
                    });

                    if (res.success) {
                      toast.success("Profile updated successfully!");
                      setIsEditProfileOpen(false);
                    } else {
                      toast.error(res.message || "Failed to update profile");
                    }
                  }
                }}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={profileForm.name}
                    onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="input-saas !h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={profileForm.email}
                    onChange={e => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="input-saas !h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Profile Image (Avatar URL or File)</label>
                  <input
                    type="text"
                    placeholder="https://example.com/avatar.jpg"
                    value={profileForm.avatar}
                    onChange={e => setProfileForm({ ...profileForm, avatar: e.target.value })}
                    className="input-saas !h-9 text-xs mb-2"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setProfileForm(prev => ({ ...prev, avatar: reader.result as string }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="text-xs text-zinc-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-emerald-950 dark:file:text-emerald-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Verified Skills (comma separated)</label>
                  <input
                    type="text"
                    placeholder="First Aid, Event Org, Disaster Relief"
                    value={profileForm.skills}
                    onChange={e => setProfileForm({ ...profileForm, skills: e.target.value })}
                    className="input-saas !h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-medium text-zinc-700 dark:text-zinc-300 mb-1">Supported Causes (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Environment, Education, Food Security"
                    value={profileForm.causes}
                    onChange={e => setProfileForm({ ...profileForm, causes: e.target.value })}
                    className="input-saas !h-9 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="btn-saas btn-secondary !h-9 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-saas btn-primary !h-9 text-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
}
