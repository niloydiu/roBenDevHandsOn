import axios from "axios";
import React, { useContext, useState } from "react";
import { Appcontext } from "../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineX, HiOutlineGlobe, HiOutlineLockClosed, HiOutlinePhotograph, HiOutlineChatAlt2 } from "react-icons/hi";
import { toast } from "react-toastify";

const CreateTeamModal = ({
  showCreateModal,
  setShowCreateModal,
  newTeam,
  handleInputChange,
  handleCreateTeam,
  resetNewTeam,
}) => {
  const { backendUrl, token } = useContext(Appcontext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${backendUrl}/api/team/create`, newTeam, {
        headers: { Authorization: `Bearer ${token}` }
      });
      handleCreateTeam(response.data);
      resetNewTeam();
      setShowCreateModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create team");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => { resetNewTeam(); setShowCreateModal(false); }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-xl rounded-[40px] shadow-2xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-3xl font-black text-slate-900 mb-2">New Community</h3>
                  <p className="text-slate-500 font-medium text-sm">Create a space for collective impact</p>
                </div>
                <button
                  onClick={() => { resetNewTeam(); setShowCreateModal(false); }}
                  className="w-12 h-12 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                >
                  <HiOutlineX size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Team Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newTeam.name}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900"
                      placeholder="e.g. Eco Warriors"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Main Cause</label>
                    <select
                      name="cause"
                      value={newTeam.cause}
                      onChange={handleInputChange}
                      className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 appearance-none"
                      required
                    >
                      <option value="">Select a cause</option>
                      <option value="environment">Environment</option>
                      <option value="education">Education</option>
                      <option value="food">Food & Hunger</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="animals">Animal Welfare</option>
                      <option value="elderly">Elderly Support</option>
                      <option value="development">Community Development</option>
                      <option value="community">General Community</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
                  <textarea
                    name="description"
                    value={newTeam.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900 resize-none"
                    placeholder="Tell us about your team's mission..."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Avatar URL</label>
                  <div className="relative">
                    <HiOutlinePhotograph className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      name="avatar"
                      value={newTeam.avatar}
                      onChange={handleInputChange}
                      className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-slate-900"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${newTeam.isPublic ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                      {newTeam.isPublic ? <HiOutlineGlobe size={24} /> : <HiOutlineLockClosed size={24} />}
                    </div>
                    <div>
                      <div className="font-black text-slate-900">{newTeam.isPublic ? 'Public Team' : 'Private Team'}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {newTeam.isPublic ? 'Anyone can find and join' : 'Requires invitation to join'}
                      </div>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="isPublic"
                      checked={newTeam.isPublic}
                      onChange={handleInputChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => { resetNewTeam(); setShowCreateModal(false); }}
                    className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-sm hover:bg-slate-200 transition-all"
                    disabled={isSubmitting}
                  >
                    Discard
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Launch Team"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateTeamModal;
