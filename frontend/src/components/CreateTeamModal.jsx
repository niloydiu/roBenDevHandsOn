import axios from "axios";
import React, { useContext, useState } from "react";
import { Appcontext } from "../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe, Lock, Image } from "lucide-react";
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
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
          />
          
          <motion.div 
            initial={{ scale: 0.98, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.98, opacity: 0, y: 12 }}
            className="relative card-saas w-full max-w-md !p-6 shadow-xl z-10 space-y-4"
          >
            <div className="flex justify-between items-center pb-3 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <h3 className="text-base font-semibold text-zinc-900 dark:text-white">Create New Volunteer Team</h3>
                <p className="text-zinc-500 text-xs">Organize a dedicated team for community action</p>
              </div>
              <button
                onClick={() => { resetNewTeam(); setShowCreateModal(false); }}
                className="text-zinc-400 hover:text-zinc-600 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-zinc-600 dark:text-zinc-400">Team Name</label>
                <input
                  type="text"
                  name="name"
                  value={newTeam.name}
                  onChange={handleInputChange}
                  className="input-saas"
                  placeholder="e.g. Neighborhood Cleaners"
                  required
                />
              </div>
              
              <div className="space-y-1">
                <label className="font-medium text-zinc-600 dark:text-zinc-400">Primary Cause</label>
                <select
                  name="cause"
                  value={newTeam.cause}
                  onChange={handleInputChange}
                  className="input-saas cursor-pointer"
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

              <div className="space-y-1">
                <label className="font-medium text-zinc-600 dark:text-zinc-400">Description</label>
                <textarea
                  name="description"
                  value={newTeam.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="input-saas !h-auto py-2"
                  placeholder="Describe your team's mission and goals..."
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-zinc-600 dark:text-zinc-400">Avatar Image URL (Optional)</label>
                <div className="relative">
                  <Image className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                  <input
                    type="text"
                    name="avatar"
                    value={newTeam.avatar}
                    onChange={handleInputChange}
                    className="input-saas pl-8"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-200/60 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-md ${newTeam.isPublic ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600' : 'bg-zinc-200 text-zinc-600'}`}>
                    {newTeam.isPublic ? <Globe size={16} /> : <Lock size={16} />}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-white">{newTeam.isPublic ? 'Public Team' : 'Private Team'}</div>
                    <div className="text-[10px] text-zinc-400">
                      {newTeam.isPublic ? 'Anyone can find and join' : 'Invitation only'}
                    </div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  name="isPublic"
                  checked={newTeam.isPublic}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer" 
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => { resetNewTeam(); setShowCreateModal(false); }}
                  className="btn-saas btn-secondary flex-1 text-xs"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-saas btn-primary flex-1 text-xs"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Launch Team"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateTeamModal;
