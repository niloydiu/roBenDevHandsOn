import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontext } from "../../context/Appcontext";
import { motion } from "framer-motion";
import { HiOutlineLocationMarker, HiOutlineUser, HiOutlineChevronRight, HiOutlineClock } from "react-icons/hi";
import { toast } from "react-toastify";

const CommunityRequests = () => {
  const navigate = useNavigate();
  const {
    helpRequests,
    loadingHelpRequests,
    isLoggedIn,
    offerHelp,
    hasUserOfferedHelp,
    fetchAllHelpRequests,
  } = useContext(Appcontext);

  const [processingRequest, setProcessingRequest] = useState(null);

  useEffect(() => {
    fetchAllHelpRequests();
    const interval = setInterval(() => fetchAllHelpRequests(), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOfferHelpClick = async (e, requestId) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      navigate("/signup");
      return;
    }
    try {
      setProcessingRequest(requestId);
      const result = await offerHelp(requestId);
      toast.success(result.message);
      fetchAllHelpRequests();
    } catch (error) {
      toast.error("Process failed");
    } finally {
      setProcessingRequest(null);
    }
  };

  const displayRequests = helpRequests.slice(0, 3);

  if (loadingHelpRequests) return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-[32px]" />
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {displayRequests.length > 0 ? displayRequests.map((request, idx) => (
        <motion.div
          key={request._id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: idx * 0.1 }}
          onClick={() => navigate("/community-help")}
          className="group cursor-pointer bg-white rounded-[32px] p-6 border border-slate-100 hover:border-blue-100 hover:shadow-xl hover:shadow-blue-500/5 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                request.urgencyLevel === 'urgent' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                request.urgencyLevel === 'medium' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                'bg-emerald-50 text-emerald-600 border-emerald-100'
              }`}>
                {request.urgencyLevel}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <HiOutlineClock /> {new Date(request.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 bg-slate-50 px-3 py-1 rounded-full">
               {request.offers} <span className="text-slate-400 font-bold uppercase text-[9px]">Offers</span>
            </div>
          </div>

          <h3 className="text-lg font-black text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
            {request.title}
          </h3>

          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <HiOutlineLocationMarker className="text-blue-500" />
                {request.location}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                <HiOutlineUser className="text-indigo-500" />
                {request.createdBy?.name || "Anonymous"}
              </div>
            </div>

            <button
              onClick={(e) => handleOfferHelpClick(e, request._id)}
              disabled={processingRequest === request._id}
              className={`px-6 py-2.5 rounded-2xl text-xs font-black transition-all ${
                hasUserOfferedHelp(request._id)
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                  : "bg-slate-900 text-white hover:bg-blue-600 shadow-xl shadow-slate-900/10 active:scale-95"
              }`}
            >
              {processingRequest === request._id ? "..." : hasUserOfferedHelp(request._id) ? "Help Offered" : "Lend Hand"}
            </button>
          </div>
        </motion.div>
      )) : (
        <div className="py-12 text-center bg-slate-50 rounded-[32px] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">Quiet Neighborhood</p>
        </div>
      )}

      {helpRequests.length > 3 && (
        <motion.button
          whileHover={{ x: 5 }}
          onClick={() => navigate("/community-help")}
          className="w-full py-4 flex items-center justify-center gap-2 text-sm font-black text-slate-400 hover:text-blue-600 transition-all uppercase tracking-widest"
        >
          View All Requests <HiOutlineChevronRight size={18} />
        </motion.button>
      )}
    </div>
  );
};

export default CommunityRequests;
