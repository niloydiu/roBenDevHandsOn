"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Appcontext } from "../../context/Appcontext";
import { motion } from "framer-motion";
import { MapPin, User, Clock, ChevronRight, Heart, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const CommunityRequests = () => {
  const router = useRouter();
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
      router.push("/signup");
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

  const displayRequests = (helpRequests || []).slice(0, 3);

  if (loadingHelpRequests) return (
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-28 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 animate-pulse rounded-xl" />
      ))}
    </div>
  );

  return (
    <div className="space-y-3">
      {displayRequests.length > 0 ? displayRequests.map((request, idx) => {
        const requestId = request._id || request.id;
        const isOffered = hasUserOfferedHelp(requestId);

        return (
          <motion.div
            key={requestId}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            onClick={() => router.push("/community-help")}
            className="group cursor-pointer card-saas flex flex-col justify-between gap-3 relative"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    request.urgencyLevel === 'urgent' 
                      ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/40' 
                      : request.urgencyLevel === 'medium' 
                        ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40' 
                        : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40'
                  }`}>
                    {request.urgencyLevel || "Normal"}
                  </span>
                  <span className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
                    <Clock size={11} /> {new Date(request.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {request.title}
                </h3>
              </div>

              <div className="shrink-0 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md border border-zinc-200/60 dark:border-zinc-700/60">
                {request.offers || 0} Offers
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
              <div className="flex items-center gap-4 text-zinc-500 truncate">
                <span className="flex items-center gap-1 truncate">
                  <MapPin size={12} className="text-emerald-500 shrink-0" />
                  <span className="truncate">{request.location}</span>
                </span>
                <span className="hidden sm:flex items-center gap-1 truncate">
                  <User size={12} className="text-zinc-400 shrink-0" />
                  <span className="truncate">{request.createdBy?.name || "Neighbor"}</span>
                </span>
              </div>

              <button
                onClick={(e) => handleOfferHelpClick(e, requestId)}
                disabled={processingRequest === requestId}
                className={`btn-saas !h-8 !px-3 text-xs shrink-0 ${
                  isOffered
                    ? "btn-outline border-emerald-500/40 text-emerald-600 dark:text-emerald-400"
                    : "btn-primary"
                }`}
              >
                {processingRequest === requestId ? "..." : isOffered ? "Offered ✓" : "Lend Hand"}
              </button>
            </div>
          </motion.div>
        );
      }) : (
        <div className="p-8 text-center bg-zinc-50 dark:bg-zinc-900/40 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500 text-xs font-medium">No active community help requests.</p>
        </div>
      )}

      {helpRequests.length > 3 && (
        <button
          onClick={() => router.push("/community-help")}
          className="w-full py-2 flex items-center justify-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
        >
          <span>View All Requests</span>
          <ChevronRight size={14} />
        </button>
      )}
    </div>
  );
};

export default CommunityRequests;
