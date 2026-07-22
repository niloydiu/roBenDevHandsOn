import React, { useContext, useState } from "react";
import axios from "axios";
import { Clock, Plus, Minus, Star } from "lucide-react";
import { Appcontext } from "../context/Appcontext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface EventCompletionProps {
  eventId: string;
  eventTitle: string;
  onSuccess?: (data: any) => void;
  organizerName?: string;
}

const EventCompletion: React.FC<EventCompletionProps> = ({ eventId, eventTitle, onSuccess, organizerName }) => {
  const [hours, setHours] = useState(1);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { backendUrl, token, loadUserProfileData } = useContext(Appcontext) as any;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return toast.error("Authentication required");
    
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${backendUrl}/api/event/complete`, {
        eventId,
        hoursContributed: hours,
        rating,
        review
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success("Hours logged and review submitted!");
        setHours(1);
        setRating(0);
        setReview("");
        loadUserProfileData?.();
        if (onSuccess) onSuccess(response.data);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Logging failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-gray-200 rounded-md p-6 mt-8 text-gray-900 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-4 text-gray-800">
        <Clock size={16} />
        <h3 className="text-[14px] font-semibold">Claim Your Impact</h3>
      </div>

      <p className="text-gray-500 text-[14px] mb-6">
        Contributed to <strong className="text-gray-900 font-medium">{eventTitle}</strong>? Log your hours and review the experience.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-gray-600">Total Hours</label>
          <div className="flex items-center border border-gray-200 rounded-md h-9 w-32 overflow-hidden">
            <button 
              type="button"
              onClick={() => setHours(Math.max(0.5, hours - 0.5))}
              className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors border-r border-gray-200"
            >
              <Minus size={14} />
            </button>
            <input
              type="number"
              value={hours}
              onChange={(e) => setHours(Math.max(0.5, Number(e.target.value)))}
              className="flex-1 w-full bg-transparent border-none text-center text-[14px] text-gray-900 focus:ring-0 p-0"
              step="0.5"
            />
            <button 
              type="button"
              onClick={() => setHours(hours + 0.5)}
              className="w-8 h-full flex items-center justify-center hover:bg-gray-50 text-gray-500 transition-colors border-l border-gray-200"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-gray-600">Rate {organizerName || 'Organizer'}</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`p-1 rounded-sm transition-colors ${rating >= star ? 'text-yellow-500' : 'text-gray-300 hover:text-gray-400'}`}
              >
                <Star size={16} fill={rating >= star ? 'currentColor' : 'none'} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-medium text-gray-600">Review</label>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            className="w-full text-[14px] px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
            placeholder="Share your experience..."
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-9 px-4 bg-black hover:bg-gray-800 text-white rounded-md text-[14px] font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 self-start"
        >
          {isSubmitting ? (
             <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          ) : (
            <>Log Experience</>
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default EventCompletion;
