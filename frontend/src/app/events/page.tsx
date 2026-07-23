"use client";
import axios from "axios";
import React, { useContext, useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Appcontext } from "../../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import Pagination from "../../components/Pagination";
import { Search, Filter, Calendar, MapPin, Plus, CheckCircle2, Clock, Users } from "lucide-react";
import { toast } from "react-toastify";
import PageWrapper from "../../components/PageWrapper";

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
  const router = useRouter();
  const [isJoining, setIsJoining] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    showMyEvents: false,
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9; // 3 cols x 3 rows

  // Reset page when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery]);

  const handleJoinEvent = async (eventId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.info("Please login first");
      router.push("/login");
      return;
    }

    try {
      setIsJoining(true);
      let response;
      try {
        response = await axios.post(
          `${backendUrl}/api/event/join/${eventId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        response = await axios.post(
          `/api/event/join/${eventId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      if (response.data.success) {
        toast.success("Joined event successfully!");
        fetchAllEvents();
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to join event");
    } finally {
      setIsJoining(false);
    }
  };

  const filteredEvents = useMemo(() => {
    if (!events) return [];
    const result = events.filter((event: any) => {
      const matchesSearch =
        event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        !filters.category || event.category === filters.category;

      const matchesLocation =
        !filters.location ||
        event.location?.toLowerCase().includes(filters.location.toLowerCase());

      const userId = userData?._id || userData?.id;

      const matchesMyEvents =
        !filters.showMyEvents ||
        event.participants?.some(
          (p: any) => (typeof p === "object" ? (p._id || p.id) : p) === userId
        ) ||
        (typeof event.creator === "object"
          ? (event.creator._id || event.creator.id)
          : event.creator) === userId;

      return (
        matchesSearch && matchesCategory && matchesLocation && matchesMyEvents
      );
    });
    return result;
  }, [events, searchQuery, filters, userData]);

  // Pagination slice
const totalPages = Math.ceil(filteredEvents.length / pageSize);
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredEvents.slice(start, start + pageSize);
  }, [filteredEvents, currentPage, pageSize]);

  return (
    <PageWrapper>
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pb-16 text-zinc-900 dark:text-zinc-100">
        
        {/* Header */}
        <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 py-8">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Volunteer Initiatives
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                Explore local community events, sign up for initiatives, or launch your own event.
              </p>
            </div>
            {mounted && isLoggedIn && (
                <Link
                  href="/create-event"
                  className="btn-saas btn-primary !h-9 text-xs shrink-0"
                >
                  <Plus size={14} />
                  <span>Host Initiative</span>
                </Link>
              )}
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-6">
          
          {/* Search & Filter Bar */}
          <div className="card-saas !p-4 mb-6 flex flex-col md:flex-row gap-3 items-center">
            <div className="relative w-full md:flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input
                type="text"
                placeholder="Search initiatives by title or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-saas !h-9 pl-8 text-xs"
              />
            </div>

            <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
              <select
                value={filters.category}
                onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                className="input-saas !h-9 text-xs w-auto cursor-pointer"
              >
                <option value="">All Categories</option>
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Food">Food</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Animals">Animals</option>
                <option value="Elderly">Elderly</option>
                <option value="Development">Development</option>
                <option value="Community">Community</option>
              </select>

              <input
                type="text"
                placeholder="City/Location"
                value={filters.location}
                onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                className="input-saas !h-9 text-xs w-32"
              />

              {mounted && isLoggedIn && (
                <button
                  onClick={() => setFilters({ ...filters, showMyEvents: !filters.showMyEvents })}
                  className={`btn-saas !h-9 text-xs ${
                    filters.showMyEvents 
                      ? "btn-primary" 
                      : "btn-secondary"
                  }`}
                >
                  My Schedule
                </button>
              )}
            </div>
          </div>

          {/* Loading / Empty States */}
          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 animate-pulse" />
              ))}
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="card-saas !p-12 text-center">
              <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3 text-zinc-400">
                <Filter size={18} />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">No initiatives match your filters</h3>
              <p className="text-zinc-500 text-xs mb-4">Try clearing your search query or selecting a different category.</p>
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setFilters({ category: "", location: "", showMyEvents: false });
                }}
                className="btn-saas btn-secondary !h-8 text-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            /* Events Grid */
            <div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                  {paginatedEvents.map((event: any) => {
                    const eventId = event._id || event.id;
                    const userId = userData?._id || userData?.id;
                    const isJoined = event.participants?.some(
                      (p: any) => (typeof p === "object" ? (p._id || p.id) : p) === userId
                    );
                    const isFull = event.participants?.length >= event.maxParticipants;

                    return (
                      <motion.div
                        key={eventId}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="card-saas flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 font-semibold text-[11px] rounded-full">
                              {event.category || "Community"}
                            </span>
                            {isJoined && (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                                <CheckCircle2 size={13} /> Attending
                              </span>
                            )}
                          </div>
                        </div>

                        <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-2 line-clamp-1">
                          {event.title}
                        </h3>

                        <p className="text-zinc-600 dark:text-zinc-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                          {event.description}
                        </p>

                        <div className="space-y-2 py-2.5 border-y border-zinc-100 dark:border-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={13} className="text-zinc-400 shrink-0" />
                            <span className="truncate">{new Date(event.date).toISOString().split('T')[0]}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={13} className="text-zinc-400 shrink-0" />
                            <span className="truncate">{event.startTime} - {event.endTime}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin size={13} className="text-zinc-400 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/events/${eventId}`} className="btn-saas btn-secondary !h-9 flex-1 text-center justify-center text-xs">
                            Details
                          </Link>
                          {!isJoined && (
                            <button
                              onClick={(e) => handleJoinEvent(eventId, e)}
                              disabled={isJoining || isFull}
                              className={`btn-saas !h-9 flex-1 text-center justify-center text-xs ${isFull ? "btn-outline cursor-not-allowed opacity-50" : "btn-primary"}`}
                            >
                              {isFull ? "Full" : "Join Now"}
                            </button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>
                      )}

  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />


        </div>
      </div>
    </PageWrapper>
  );
}

export default Events;
