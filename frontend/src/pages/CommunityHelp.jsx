import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  HiOutlinePlus, 
  HiOutlineFilter, 
  HiOutlineLocationMarker, 
  HiOutlineUser, 
  HiOutlinePhone, 
  HiOutlineClock, 
  HiOutlineTrash,
  HiOutlineHeart,
  HiOutlineGlobeAlt,
  HiX
} from "react-icons/hi";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";
import MapComponent from "../components/MapComponent";

function CommunityHelp() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("list");
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
  const [processingRequest, setProcessingRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Search and Drawer States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequestForDrawer, setSelectedRequestForDrawer] = useState(null);
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
      if (filters.showMyRequests && isLoggedIn && userData) filtered = filtered.filter(r => r.createdBy?._id === userData._id);
      
      // Parse search queries
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return navigate("/signup");

    try {
      const result = await createHelpRequest(newRequest);
      if (result.success) {
        setNewRequest({ title: "", description: "", location: "", urgencyLevel: "medium", category: "general", contactInfo: "" });
        setIsModalOpen(false);
        toast.success("Request published to community");
        fetchAllHelpRequests();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to broadcast request");
    }
  };

  const downloadIcsFile = (request) => {
    const title = request.title;
    const description = request.description || "Volunteer opportunity";
    const location = request.location || "Community Location";
    const now = new Date();
    const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
    
    const formatDate = (date) => {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    };
    
    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//HandsOn//Volunteer Platform//EN",
      "BEGIN:VEVENT",
      `UID:uid-${request._id}-${now.getTime()}@handson.org`,
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
    link.setAttribute("download", `handsOn-invite-${request._id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmDrawerSupport = async () => {
    if (!isLoggedIn) return navigate("/signup");
    if (!selectedRequestForDrawer) return;

    setProcessingRequest(selectedRequestForDrawer._id);
    try {
      const result = await offerHelp(selectedRequestForDrawer._id);
      toast.success(result.message);
      setDrawerSuccess(true);
      fetchAllHelpRequests();
    } catch (error) {
      toast.error("Process failed");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleOfferHelpClick = (request) => {
    if (!isLoggedIn) {
      navigate("/signup");
      return;
    }
    setSelectedRequestForDrawer(request);
    setDrawerSuccess(false);
  };

  const handleDelete = async (requestId) => {
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

  const UrgencyBadge = ({ level }) => {
    const colors = {
      urgent: "bg-rose-100 text-rose-600 border-rose-200",
      medium: "bg-amber-100 text-amber-600 border-amber-200",
      low: "bg-emerald-100 text-emerald-600 border-emerald-200"
    };
    return (
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${colors[level] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
        {level}
      </span>
    );
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-50/50 pb-20">
        {/* Header Section */}
        <div className="bg-slate-900 pt-20 pb-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[80px] -mr-20 -mt-20" />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h1 className="text-5xl font-black text-white mb-4 tracking-tight">Community Pulse</h1>
            <p className="text-blue-200/60 text-lg font-medium max-w-xl">
              Local requests for immediate help. From teaching basic needs to hardware fixes, the community is here to support you.
            </p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2"
          >
            <HiOutlinePlus size={20} /> New Support Request
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-12 relative z-20">
        {/* Universal Search Bar with Dynamic Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-[32px] p-6 shadow-xl border border-slate-100 dark:border-slate-800/40 mb-8">
          <div className="relative mb-4">
            <input 
              type="text" 
              placeholder="Search help opportunities naturally (e.g. 'groceries', 'tutoring', 'cleaning')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-12 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-800 dark:text-white focus:outline-none text-base"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <HiX size={20} />
              </button>
            )}
          </div>
          
          {/* Dynamic pill toggles */}
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest mr-2">Category:</span>
            
            {/* Category pills */}
            {["All", "General", "Education", "Health", "Environment", "Food"].map((cat) => {
              const value = cat === "All" ? "all" : cat.toLowerCase();
              const active = filters.category === value;
              return (
                <button
                  key={cat}
                  onClick={() => setFilters({...filters, category: value})}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer border ${
                    active 
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/25" 
                      : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
            
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest mr-2">Priority:</span>

            {/* Urgency pills */}
            {["All", "Urgent", "Medium", "Low"].map((urg) => {
              const value = urg === "All" ? "all" : urg.toLowerCase();
              const active = filters.urgency === value;
              return (
                <button
                  key={urg}
                  onClick={() => setFilters({...filters, urgency: value})}
                  className={`px-4 py-2 rounded-full text-xs font-black transition-all cursor-pointer border ${
                    active 
                      ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/25" 
                      : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                  }`}
                >
                  {urg}
                </button>
              );
            })}

            <button 
              onClick={() => setFilters({...filters, showMyRequests: !filters.showMyRequests})}
              className={`ml-auto px-6 py-2.5 rounded-full text-xs font-black transition-all border cursor-pointer ${filters.showMyRequests ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
            >
              My Requests Only
            </button>
          </div>
        </div>

        {/* Main Split-Screen Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20">
          
          {/* Scrollable list cards: 7 columns */}
          <div className="lg:col-span-7 space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
            {loadingHelpRequests ? (
              Array(3).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-200 dark:bg-slate-800 animate-pulse h-48 rounded-[32px]" />
              ))
            ) : filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={request._id}
                  className="bg-white dark:bg-slate-900 rounded-[32px] p-6 border border-slate-100 dark:border-slate-800/40 shadow-sm hover:shadow-xl dark:hover:shadow-none hover:border-blue-100 dark:hover:border-blue-900/50 transition-all group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex flex-wrap gap-2">
                      <UrgencyBadge level={request.urgencyLevel} />
                      {request.urgencyLevel === 'urgent' && (
                        <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30">
                          Immediate Need
                        </span>
                      )}
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30">
                        1-3 Hours
                      </span>
                      <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-100 dark:border-slate-700/50">
                        Category: {request.category || "General"}
                      </span>
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-1">
                      <HiOutlineClock /> {new Date(request.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {request.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-4 line-clamp-2 leading-relaxed">
                    {request.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800/40">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1">
                        <HiOutlineLocationMarker className="text-blue-500" /> {request.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <HiOutlineUser className="text-indigo-500" /> {request.createdBy?.name || "Anonymous"} 
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {isLoggedIn && userData && request.createdBy?._id === userData._id ? (
                        <button 
                          onClick={() => handleDelete(request._id)}
                          className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-600 dark:hover:bg-rose-700 hover:text-white transition-all cursor-pointer"
                          title="Delete Request"
                        >
                          <HiOutlineTrash size={18} />
                        </button>
                      ) : (
                        <>
                          <button 
                            onClick={() => navigate(`/chat`)}
                            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                          >
                            Chat
                          </button>
                          <button 
                            onClick={() => handleOfferHelpClick(request)}
                            disabled={processingRequest === request._id}
                            className={`px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all cursor-pointer ${
                              hasUserOfferedHelp(request._id) 
                                ? 'bg-emerald-600 text-white' 
                                : 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700'
                            }`}
                          >
                            {hasUserOfferedHelp(request._id) ? "Help Offered" : "Offer Support"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <HiOutlineGlobeAlt size={32} />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">Neighborhood is Quiet</h3>
                <p className="text-slate-550 dark:text-slate-450 font-medium text-sm">No active help requests match your search.</p>
              </div>
            )}
          </div>

          {/* Sticky Leaflet Map: 5 columns */}
          <div className="lg:col-span-5 h-[50vh] lg:h-[70vh] lg:sticky lg:top-24 rounded-[32px] overflow-hidden shadow-xl border border-slate-100 dark:border-slate-800/40">
            <MapComponent 
              items={filteredRequests} 
              onMarkerClick={(request) => {
                handleOfferHelpClick(request);
              }} 
            />
          </div>

        </div>
      </div>

      {/* New Request Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[48px] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] border border-transparent dark:border-slate-800"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
                <HiX size={24} className="text-slate-400" />
              </button>

              <div className="mb-10">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Need Support?</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Broadcast your request to the local community</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Request Title</label>
                    <input 
                      type="text" 
                      name="title" 
                      value={newRequest.title} 
                      onChange={handleInputChange}
                      placeholder="e.g. Need help with groceries"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Location</label>
                    <input 
                      type="text" 
                      name="location" 
                      value={newRequest.location} 
                      onChange={handleInputChange}
                      placeholder="Street, City"
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Category</label>
                    <select 
                      name="category" 
                      value={newRequest.category} 
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="general">General</option>
                      <option value="education">Education</option>
                      <option value="health">Healthcare</option>
                      <option value="environment">Environmental</option>
                      <option value="food">Food & Hunger</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Urgency</label>
                    <select 
                      name="urgencyLevel" 
                      value={newRequest.urgencyLevel} 
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none cursor-pointer"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Detailed Description</label>
                  <textarea 
                    name="description" 
                    value={newRequest.description} 
                    onChange={handleInputChange}
                    rows="4" 
                    placeholder="Describe exactly what kind of help you need..."
                    className="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none" 
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Contact Method</label>
                  <div className="relative">
                    <HiOutlinePhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      name="contactInfo" 
                      value={newRequest.contactInfo} 
                      onChange={handleInputChange}
                      placeholder="Email or Phone number"
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none" 
                      required
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-[0.98] cursor-pointer"
                >
                  Broadcast to Neighborhood
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Inline Commitment Drawer */}
      <AnimatePresence>
        {selectedRequestForDrawer && (
          <div className="fixed inset-0 z-[120] flex justify-end">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRequestForDrawer(null)}
              className="absolute inset-0 bg-slate-950"
            />
            {/* Drawer Content */}
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-slate-100 dark:border-slate-850 p-6 flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-900/30">
                    Shift Commitment
                  </span>
                  <button 
                    onClick={() => setSelectedRequestForDrawer(null)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer"
                  >
                    <HiX size={20} className="text-slate-400" />
                  </button>
                </div>

                {!drawerSuccess ? (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                        {selectedRequestForDrawer.title}
                      </h2>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">
                        {selectedRequestForDrawer.description}
                      </p>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40 space-y-3">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <HiOutlineLocationMarker className="text-blue-500" size={18} />
                        <span>{selectedRequestForDrawer.location}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <HiOutlineUser className="text-indigo-500" size={18} />
                        <span>Created by {selectedRequestForDrawer.createdBy?.name || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-700 dark:text-slate-200">
                        <HiOutlineClock className="text-emerald-500" size={18} />
                        <span>1-3 hours commitment</span>
                      </div>
                    </div>

                    {/* Safety Guidelines checklist */}
                    <div className="space-y-3">
                      <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Safety Guidelines</h3>
                      <div className="space-y-2">
                        {[
                          "Confirm coordination and schedules before meeting",
                          "Prioritize public meetup locations if applicable",
                          "Respect personal space and local community rules"
                        ].map((guideline, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <input 
                              type="checkbox" 
                              defaultChecked 
                              disabled 
                              className="mt-1 rounded text-blue-600 focus:ring-blue-500 dark:bg-slate-800 border-slate-200 dark:border-slate-700" 
                            />
                            <p className="text-xs text-slate-600 dark:text-slate-350 font-medium leading-relaxed">{guideline}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notification toggles */}
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-850">
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-white">Opt-in notifications</p>
                        <p className="text-[10px] text-slate-450 dark:text-slate-400 font-medium">Receive coordinate details via WhatsApp/SMS</p>
                      </div>
                      <input 
                        type="checkbox"
                        checked={optInWhatsapp}
                        onChange={() => setOptInWhatsapp(!optInWhatsapp)}
                        className="w-5 h-5 rounded-md text-blue-600 focus:ring-blue-500 dark:bg-slate-800 border-slate-200 dark:border-slate-700 cursor-pointer"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Committed Successfully!</h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium max-w-xs mx-auto leading-relaxed">
                        You have offered help. Add this shift to your calendar so you don't miss the details.
                      </p>
                    </div>

                    <button 
                      onClick={() => downloadIcsFile(selectedRequestForDrawer)}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      Download Calendar Invite (.ics)
                    </button>
                  </div>
                )}
              </div>

              {!drawerSuccess && (
                <button
                  onClick={handleConfirmDrawerSupport}
                  disabled={processingRequest === selectedRequestForDrawer._id}
                  className="w-full py-4 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-xl shadow-slate-900/10 dark:shadow-none cursor-pointer flex items-center justify-center gap-2 active:scale-95"
                >
                  {processingRequest === selectedRequestForDrawer._id ? "Processing..." : "Confirm & Support"}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      </div>
    </PageWrapper>
  );
}

export default CommunityHelp;
