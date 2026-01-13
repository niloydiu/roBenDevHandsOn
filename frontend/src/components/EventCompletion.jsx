import axios from "axios";
import React, { useContext, useState } from "react";
import { HiOutlineClock, HiOutlinePlus, HiOutlineMinus } from "react-icons/hi";
import { Appcontext } from "../context/Appcontext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

const EventCompletion = ({ eventId, eventTitle, onSuccess }) => {
  const [hours, setHours] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { backendUrl, token, loadUserProfileData } = useContext(Appcontext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Authentication required");
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${backendUrl}/api/event/complete`, {
        eventId,
        hoursContributed: hours,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Hours logged! Awaiting verification.");
        setHours(1);
        loadUserProfileData();
        if (onSuccess) onSuccess(response.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Logging failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900 rounded-[40px] p-8 mt-12 text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all duration-700" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400">
          <HiOutlineClock size={22} />
        </div>
        <h3 className="text-xl font-black tracking-tight">Claim Your Impact</h3>
      </div>

      <p className="text-blue-100/60 font-medium text-sm mb-8 leading-relaxed">
        Contributed to <strong className="text-white">{eventTitle}</strong>? Log your hours below to earn achievement points.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-stretch md:items-end gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-[10px] font-black text-blue-300/40 uppercase tracking-[0.2em] ml-1">Total Hours</label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 h-[64px]">
            <button 
              type="button"
              onClick={() => setHours(Math.max(0.5, hours - 0.5))}
              className="w-12 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-blue-400"
            >
              <HiOutlineMinus size={20} />
            </button>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(Math.max(0.5, Number(e.target.value)))}
              className="flex-1 bg-transparent border-none text-center font-black text-xl text-white focus:ring-0"
              step="0.5"
            />
            <button 
              type="button"
              onClick={() => setHours(hours + 0.5)}
              className="w-12 h-full flex items-center justify-center hover:bg-white/10 rounded-xl transition-all text-blue-400"
            >
              <HiOutlinePlus size={20} />
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-[64px] px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black tracking-tight transition-all active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-blue-500/10 flex items-center justify-center gap-3 whitespace-nowrap"
        >
          {isSubmitting ? (
             <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>Log Experience</>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default EventCompletion;
