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
      setFilteredRequests(filtered);
    }
  }, [helpRequests, userData, filters, isLoggedIn]);

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

  const handleOfferHelpClick = async (requestId) => {
    if (!isLoggedIn) return navigate("/signup");
    setProcessingRequest(requestId);
    try {
      const result = await offerHelp(requestId);
      toast.success(result.message);
      fetchAllHelpRequests();
    } catch (error) {
      toast.error("Process failed");
    } finally {
      setProcessingRequest(null);
    }
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

      <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
        {/* Filters */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800/40 mb-12 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <HiOutlineFilter className="text-slate-400" />
            <select 
              className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer"
              value={filters.urgency}
              onChange={(e) => setFilters({...filters, urgency: e.target.value})}
            >
              <option value="all">All Priority</option>
              <option value="urgent">Urgent Only</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
          </div>

          <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <HiOutlineGlobeAlt className="text-slate-400" />
            <select 
              className="bg-transparent border-none text-sm font-bold text-slate-700 dark:text-slate-200 focus:ring-0 cursor-pointer"
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
            >
              <option value="all">Every Category</option>
              <option value="general">General</option>
              <option value="education">Education</option>
              <option value="health">Healthcare</option>
              <option value="environment">Environmental</option>
              <option value="food">Food & Hunger</option>
            </select>
          </div>

          <button 
            onClick={() => setFilters({...filters, showMyRequests: !filters.showMyRequests})}
            className={`px-6 py-2 rounded-2xl text-sm font-black transition-all border cursor-pointer ${filters.showMyRequests ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/25' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
          >
            My Requests Only
          </button>

          <div className="ml-auto flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-100 dark:border-slate-700/50">
            <button 
              onClick={() => setViewMode("list")} 
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${viewMode === "list" ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              List
            </button>
            <button 
              onClick={() => setViewMode("map")} 
              className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${viewMode === "map" ? "bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-md" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"}`}
            >
              Map
            </button>
          </div>
        </div>

        {/* Requests Grid or Map View */}
        {viewMode === "map" ? (
          <div className="mb-20 h-[500px]">
            <MapComponent 
              items={filteredRequests} 
              onMarkerClick={(request) => {
                toast.info(`Request selected: ${request.title}`);
              }} 
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
            {loadingHelpRequests ? (
              Array(6).fill(0).map((_, i) => (
                <div key={i} className="bg-slate-200 dark:bg-slate-900 animate-pulse h-64 rounded-[40px]" />
              ))
            ) : filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={request._id}
                className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800/40 shadow-sm hover:shadow-xl dark:hover:shadow-none hover:border-blue-100 dark:hover:border-blue-900/50 transition-all group"
              >
                <div className="flex justify-between items-start mb-6">
                  <UrgencyBadge level={request.urgencyLevel} />
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                    <HiOutlineClock /> {new Date(request.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {request.title}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-6 line-clamp-3">
                  {request.description}
                </p>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-2xl">
                    <HiOutlineLocationMarker className="text-blue-500" /> {request.location}
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-slate-600 dark:text-slate-300">
                    <HiOutlineUser className="text-indigo-500" /> {request.createdBy?.name || "Anonymous"} 
                    {isLoggedIn && userData && request.createdBy?._id === userData._id && (
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest">You</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-800/40">
                  <div className="flex items-center gap-2 text-slate-400">
                    <HiOutlineHeart className="text-rose-500" />
                    <span className="text-xs font-black text-slate-900 dark:text-white">{request.offers} Helpers</span>
                  </div>
                  
                  <div className="flex gap-2">
                    {isLoggedIn && userData && request.createdBy?._id === userData._id ? (
                      <button 
                        onClick={() => handleDelete(request._id)}
                        className="p-3 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 rounded-2xl hover:bg-rose-600 dark:hover:bg-rose-700 hover:text-white transition-all shadow-sm shadow-rose-200 dark:shadow-none"
                        title="Delete Request"
                      >
                        <HiOutlineTrash size={20} />
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate(`/chat`)}
                          className="px-4 py-3 bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-200 rounded-2xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                        >
                          Chat
                        </button>
                        <button 
                          onClick={() => handleOfferHelpClick(request._id)}
                          disabled={processingRequest === request._id}
                          className={`px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 transition-all cursor-pointer ${
                            hasUserOfferedHelp(request._id) 
                              ? 'bg-emerald-600 text-white shadow-emerald-500/25' 
                              : 'bg-slate-900 dark:bg-blue-600 text-white hover:bg-blue-600 dark:hover:bg-blue-700 shadow-slate-500/25 shadow-lg dark:shadow-none'
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
            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900 rounded-[48px] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <HiOutlineGlobeAlt size={40} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Neighborhood is Quiet</h3>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No active help requests match your search criteria.</p>
            </div>
          )}
        </div>
      )}
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
      </div>
    </PageWrapper>
  );
}

export default CommunityHelp;
