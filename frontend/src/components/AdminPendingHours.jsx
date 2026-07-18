"use client";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { 
  HiOutlineCheck, 
  HiOutlineX, 
  HiOutlineClock, 
  HiOutlineUser, 
  HiOutlineCalendar,
  HiOutlineInbox
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Appcontext } from "../context/Appcontext";
import { toast } from "react-toastify";

const AdminPendingHours = () => {
  const { backendUrl, token } = useContext(Appcontext);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(null);

  useEffect(() => {
    fetchPendingHours();
  }, [backendUrl, token]);

  const fetchPendingHours = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/user/pending-hours`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setPendingUsers(response.data.pendingHours);
      }
    } catch (error) {
      toast.error("Failed to sync approval queue");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId, pendingHourId, action) => {
    const actionKey = `${action}-${userId}-${pendingHourId}`;
    setProcessingAction(actionKey);
    try {
      const endpoint = action === 'approve' ? 'approve-hours' : 'reject-hours';
      await axios.put(
        `${backendUrl}/api/user/${endpoint}/${userId}/${pendingHourId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(action === 'approve' ? "Hours verified" : "Hours dismissed");
      fetchPendingHours();
    } catch (error) {
      toast.error(`Action failed: ${error.message}`);
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-slate-100 shadow-sm">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4" />
      <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">Syncing Records</p>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Impact Verification</h2>
          <p className="text-slate-500 font-medium">Review and validate community contribution hours</p>
        </div>
        <div className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/25">
          {pendingUsers.length} Users Pending
        </div>
      </div>

      <AnimatePresence>
        {pendingUsers.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[48px] p-20 text-center border-2 border-dashed border-slate-100"
          >
            <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineInbox size={40} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Queue Empty</h3>
            <p className="text-slate-500 font-medium">All volunteer contributions have been processed.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {pendingUsers.map((user) => (
              <motion.div
                layout
                key={user._id}
                className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-slate-50 pb-8">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center text-2xl font-black">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 mb-1">{user.name}</h3>
                      <p className="text-slate-400 font-bold text-sm flex items-center gap-2">
                        <HiOutlineUser /> {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="bg-slate-50 text-slate-900 px-5 py-2 rounded-2xl text-xs font-black uppercase tracking-widest">
                      {user.pendingHours?.filter(e => e.status === 'pending').length} Submissions
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {user.pendingHours
                    .filter((entry) => entry.status === "pending")
                    .map((entry) => (
                      <div
                        key={entry._id}
                        className="group flex flex-col md:flex-row items-center justify-between p-6 rounded-[32px] bg-slate-50/50 hover:bg-white border border-transparent hover:border-slate-100 transition-all"
                      >
                        <div className="flex items-center gap-6 mb-4 md:mb-0">
                          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-blue-600">
                             <HiOutlineClock size={24} />
                          </div>
                          <div>
                            <p className="font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                              {entry.event?.title || "Community Event"}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                                <HiOutlineCalendar /> {new Date(entry.date).toLocaleDateString()}
                              </span>
                              <span className="text-xs font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">
                                {entry.hours} Hours
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAction(user._id, entry._id, 'approve')}
                            disabled={processingAction === `approve-${user._id}-${entry._id}`}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-black text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50"
                          >
                            {processingAction === `approve-${user._id}-${entry._id}` 
                              ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                              : <HiOutlineCheck size={18} />
                            }
                            Approve
                          </button>

                          <button
                            onClick={() => handleAction(user._id, entry._id, 'reject')}
                            disabled={processingAction === `reject-${user._id}-${entry._id}`}
                            className="bg-white text-rose-600 border-2 border-rose-50 px-8 py-3 rounded-2xl font-black text-sm hover:bg-rose-50 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                          >
                            {processingAction === `reject-${user._id}-${entry._id}`
                              ? <div className="w-4 h-4 border-2 border-rose-600/20 border-t-rose-600 rounded-full animate-spin" />
                              : <HiOutlineX size={18} />
                            }
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPendingHours;
