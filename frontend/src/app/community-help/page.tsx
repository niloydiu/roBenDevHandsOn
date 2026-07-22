"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Appcontext } from "../../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  MapPin, 
  User, 
  Clock, 
  Trash2, 
  Heart, 
  Globe, 
  X,
  Calendar,
  MessageSquare
} from "lucide-react";
import { toast } from "react-toastify";
import PageWrapper from "../../components/PageWrapper";
import MapComponent from "../../components/MapComponent";

function CommunityHelp() {
  const router = useRouter();
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

  const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestForDrawer, setSelectedRequestForDrawer] = useState<any | null>(null);
  const [drawerSuccess, setDrawerSuccess] = useState(false);
  const [optInWhatsapp, setOptInWhatsapp] = useState(true);

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
    showMyRequests: false,
  });

  useEffect(() => {
    fetchAllHelpRequests();
  }, []);

  useEffect(() => {
    if (helpRequests && Array.isArray(helpRequests)) {
      let filtered = [...helpRequests];
      if (filters.urgency !== "all") filtered = filtered.filter(r => r.urgencyLevel === filters.urgency);
      if (filters.category !== "all") filtered = filtered.filter(r => r.category?.toLowerCase() === filters.category.toLowerCase());
      
      const userId = userData?._id || userData?.id;
      if (filters.showMyRequests && isLoggedIn && userId) {
        filtered = filtered.filter(r => (r.createdBy?._id || r.createdBy?.id) === userId);
      }
      
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(r => {
          const matchText = (r.title + " " + r.description + " " + r.location + " " + (r.category || "")).toLowerCase();
          return matchText.includes(query);
        });
      }
      setFilteredRequests(filtered);
    }
  }, [helpRequests, userData, filters, isLoggedIn, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return router.push("/signup");

    try {
      const result = await createHelpRequest(newRequest);
      if (result.success) {
        setNewRequest({ title: "", description: "", location: "", urgencyLevel: "medium", category: "general", contactInfo: "" });
        setIsModalOpen(false);
        toast.success("Request published to community!");
        fetchAllHelpRequests();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to broadcast request");
    }
  };

  const downloadIcsFile = (request: any) => {
    const title = request.title;
    const description = request.description || "Volunteer opportunity";
    const location = request.location || "Community Location";
    const now = new Date();
    const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };
    
    const reqId = request._id || request.id;
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//HandsOn//Volunteer Platform//EN",
      "BEGIN:VEVENT",
      `UID:uid-${reqId}-${now.getTime()}@handson.org`,
      `DTSTAMP:${formatDate(now)}`,
      `DTSTART:${formatDate(start)}`,
      `DTEND:${formatDate(end)}`,
      `SUMMARY:${title}`,
      `DESCRIPTION:${description}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");
    
    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `handsOn-invite-${reqId}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmDrawerSupport = async () => {
    if (!isLoggedIn) return router.push("/signup");
    if (!selectedRequestForDrawer) return;

    const reqId = selectedRequestForDrawer._id || selectedRequestForDrawer.id;
    setProcessingRequest(reqId);
    try {
      const result = await offerHelp(reqId);
      toast.success(result.message);
      setDrawerSuccess(true);
      fetchAllHelpRequests();
    } catch (error) {
      toast.error("Process failed");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleOfferHelpClick = (request: any) => {
    if (!isLoggedIn) {
      router.push("/signup");
      return;
    }
    setSelectedRequestForDrawer(request);
    setDrawerSuccess(false);
  };

  const handleDelete = async (requestId: string) => {
    setProcessingRequest(requestId);
    try {
      const result = await deleteHelpRequest(requestId);
      toast.success(result.message);
      fetchAllHelpRequests();
    } catch (error) {
      toast.error("Deletion failed");
    } finally {
      setProcessingRequest(null);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pb-16 text-zinc-900 dark:text-zinc-100">
        
        {/* Header Section */}
        <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 py-8">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Mutual Aid & Community Help
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                Neighborhood requests for direct support. Lend a hand or request assistance.
              </p>
            </div>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-saas btn-primary !h-9 text-xs shrink-0"
            >
              <Plus size={14} />
              <span>New Support Request</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-6">
          
          {/* Universal Search & Filters Bar */}
          <div className="card-saas !p-4 mb-6 space-y-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
              <input 
                type="text" 
                placeholder="Search help opportunities (e.g. 'groceries', 'tutoring', 'cleaning')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-saas !h-9 pl-8 text-xs"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="text-zinc-400 font-medium mr-1">Category:</span>
              {["All", "General", "Education", "Health", "Environment", "Food"].map((cat) => {
                const value = cat === "All" ? "all" : cat.toLowerCase();
                const active = filters.category === value;
                return (
                  <button
                    key={cat}
                    onClick={() => setFilters({...filters, category: value})}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      active 
                        ? "bg-emerald-600 text-white font-semibold" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
              
              <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-1 hidden sm:block" />

              <span className="text-zinc-400 font-medium mr-1">Urgency:</span>
              {["All", "Urgent", "Medium", "Low"].map((urg) => {
                const value = urg === "All" ? "all" : urg.toLowerCase();
                const active = filters.urgency === value;
                return (
                  <button
                    key={urg}
                    onClick={() => setFilters({...filters, urgency: value})}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                      active 
                        ? "bg-amber-600 text-white font-semibold" 
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                    }`}
                  >
                    {urg}
                  </button>
                );
              })}

              {isLoggedIn && (
                <button 
                  onClick={() => setFilters({...filters, showMyRequests: !filters.showMyRequests})}
                  className={`ml-auto btn-saas !h-8 !px-3 text-xs ${filters.showMyRequests ? 'btn-primary' : 'btn-secondary'}`}
                >
                  My Requests Only
                </button>
              )}
            </div>
          </div>

          {/* Split Content: List + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Request Cards Column */}
            <div className="lg:col-span-7 space-y-3">
              {loadingHelpRequests ? (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="h-40 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 animate-pulse" />
                ))
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => {
                  const reqId = request._id || request.id;
                  const userId = userData?._id || userData?.id;
                  const isOwner = isLoggedIn && userId && (request.createdBy?._id || request.createdBy?.id) === userId;
                  const isOffered = hasUserOfferedHelp(reqId);

                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={reqId}
                      className="card-saas flex flex-col justify-between gap-3"
                    >
                      <div>
                        <div className="flex justify-between items-start mb-2 gap-2">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                              request.urgencyLevel === 'urgent' 
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/40' 
                                : request.urgencyLevel === 'medium' 
                                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40' 
                                  : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40'
                            }`}>
                              {request.urgencyLevel || "Normal"}
                            </span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              {request.category || "General"}
                            </span>
                          </div>
                          <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1 shrink-0">
                            <Clock size={11} /> {new Date(request.createdAt).toLocaleDateString()}
                          </div>
                        </div>

                        <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">
                          {request.title}
                        </h3>
                        <p className="text-zinc-600 dark:text-zinc-400 text-xs line-clamp-2 leading-relaxed mb-3">
                          {request.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
                        <div className="flex items-center gap-3 text-zinc-500 truncate">
                          <span className="flex items-center gap-1 truncate">
                            <MapPin size={12} className="text-emerald-500 shrink-0" />
                            <span className="truncate">{request.location}</span>
                          </span>
                          <span className="hidden sm:flex items-center gap-1 truncate">
                            <User size={12} className="text-zinc-400 shrink-0" />
                            <span className="truncate">{request.createdBy?.name || "Neighbor"}</span>
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {isOwner ? (
                            <button 
                              onClick={() => handleDelete(reqId)}
                              className="btn-saas text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 !h-8 !px-2.5"
                              title="Delete Request"
                            >
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <>
                              <button 
                                onClick={() => router.push(`/chat`)}
                                className="btn-saas btn-secondary !h-8 !px-3 text-xs"
                              >
                                <MessageSquare size={13} />
                                <span>Chat</span>
                              </button>
                              <button 
                                onClick={() => handleOfferHelpClick(request)}
                                disabled={processingRequest === reqId}
                                className={`btn-saas !h-8 !px-3 text-xs ${
                                  isOffered 
                                    ? 'btn-outline border-emerald-500/40 text-emerald-600 dark:text-emerald-400' 
                                    : 'btn-primary'
                                }`}
                              >
                                {isOffered ? "Help Offered ✓" : "Offer Support"}
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              ) : (
                <div className="card-saas !p-12 text-center">
                  <Globe size={24} className="mx-auto mb-2 text-zinc-400" />
                  <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">No requests found</h3>
                  <p className="text-zinc-500 text-xs">Try adjusting your filters or post a new support request.</p>
                </div>
              )}
            </div>

            {/* Sticky Map Column */}
            <div className="lg:col-span-5 h-[400px] lg:h-[600px] lg:sticky lg:top-20 rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <MapComponent 
                items={filteredRequests} 
                onMarkerClick={(request: any) => {
                  handleOfferHelpClick(request);
                }} 
              />
            </div>

          </div>
        </div>

        {/* Modal: New Request */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 12 }}
                className="relative w-full max-w-lg card-saas !p-6 shadow-xl z-10 space-y-4"
              >
                <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-white">Broadcast Support Request</h2>
                  <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white">
                    <X size={16} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="font-medium text-zinc-600 dark:text-zinc-400">Request Title</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={newRequest.title} 
                      onChange={handleInputChange}
                      placeholder="e.g. Grocery assistance for senior"
                      className="input-saas" 
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-medium text-zinc-600 dark:text-zinc-400">Category</label>
                      <select 
                        name="category" 
                        value={newRequest.category} 
                        onChange={handleInputChange}
                        className="input-saas cursor-pointer"
                      >
                        <option value="general">General</option>
                        <option value="education">Education</option>
                        <option value="health">Healthcare</option>
                        <option value="environment">Environmental</option>
                        <option value="food">Food & Hunger</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="font-medium text-zinc-600 dark:text-zinc-400">Urgency Level</label>
                      <select 
                        name="urgencyLevel" 
                        value={newRequest.urgencyLevel} 
                        onChange={handleInputChange}
                        className="input-saas cursor-pointer"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-zinc-600 dark:text-zinc-400">Location / Neighborhood</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={newRequest.location} 
                      onChange={handleInputChange}
                      placeholder="Street name, District, or City"
                      className="input-saas" 
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-zinc-600 dark:text-zinc-400">Detailed Description</label>
                    <textarea 
                      name="description" 
                      value={newRequest.description} 
                      onChange={handleInputChange}
                      rows={3} 
                      placeholder="Describe what help you need..."
                      className="input-saas !h-auto py-2" 
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-zinc-600 dark:text-zinc-400">Contact Info</label>
                    <input 
                      type="text" 
                      name="contactInfo" 
                      value={newRequest.contactInfo} 
                      onChange={handleInputChange}
                      placeholder="Phone number or preferred contact"
                      className="input-saas" 
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="btn-saas btn-primary w-full mt-2"
                  >
                    Broadcast to Community
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}

export default CommunityHelp;
