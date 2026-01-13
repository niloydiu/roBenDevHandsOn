import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { motion } from "framer-motion";
import { HiOutlineArrowLeft, HiOutlineCheckCircle, HiOutlineGlobeAlt, HiOutlineShieldCheck, HiOutlineCamera } from "react-icons/hi";
import { toast } from "react-toastify";

function TeamEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(Appcontext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    cause: "",
    isPublic: true,
    avatar: "",
  });

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/team/${id}`);
        setTeamData({
          name: response.data.name || "",
          description: response.data.description || "",
          cause: response.data.cause || "",
          isPublic: response.data.isPublic !== false,
          avatar: response.data.avatar || "",
        });
      } catch (err) {
        toast.error("Failed to load team details");
        navigate("/teams");
      } finally {
        setLoading(false);
      }
    };

    if (id && backendUrl && token) fetchTeamData();
    else if (!token) navigate("/login");
  }, [id, backendUrl, token]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTeamData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`${backendUrl}/api/team/${id}`, teamData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Team settings synchronized");
      navigate(`/teams/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link 
          to={`/teams/${id}`} 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors font-black text-[10px] uppercase tracking-widest"
        >
          <HiOutlineArrowLeft size={16} /> Discard Changes
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[50px] p-8 md:p-16 shadow-2xl shadow-slate-200/50 border border-slate-100"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black text-slate-900 mb-2">Team Settings</h1>
            <p className="text-slate-500 font-medium tracking-tight">Optimize your community's identity and reach.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Avatar Section */}
            <div className="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[40px] border-2 border-dashed border-slate-200 group transition-all hover:border-blue-400">
               <div className="relative mb-6">
                  <div className="w-32 h-32 bg-white rounded-[40px] shadow-xl flex items-center justify-center overflow-hidden border-4 border-white">
                    {teamData.avatar ? (
                      <img src={teamData.avatar} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <HiOutlineCamera size={40} className="text-slate-300" />
                    )}
                  </div>
               </div>
               <div className="w-full max-w-sm">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Branding URL</label>
                  <input
                    type="text"
                    name="avatar"
                    value={teamData.avatar}
                    onChange={handleInputChange}
                    className="w-full bg-white border-none rounded-2xl px-5 py-4 text-sm font-medium focus:ring-2 focus:ring-blue-500 shadow-sm"
                    placeholder="https://image-url.com/logo.png"
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Name</label>
                <input
                  type="text"
                  name="name"
                  value={teamData.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border-none rounded-[20px] px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Social Cause</label>
                <select
                  name="cause"
                  value={teamData.cause}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border-none rounded-[20px] px-6 py-4 font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                  required
                >
                  <option value="Environment">Environment</option>
                  <option value="Education">Education</option>
                  <option value="Food">Food</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Animals">Animals</option>
                  <option value="Elderly">Elderly</option>
                  <option value="Development">Development</option>
                  <option value="Community">Community</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Global Visibility</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setTeamData(prev => ({ ...prev, isPublic: true }))}
                  className={`flex items-center gap-4 p-6 rounded-[28px] border-2 transition-all ${teamData.isPublic ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${teamData.isPublic ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <HiOutlineGlobeAlt size={22} />
                  </div>
                  <div className="text-left">
                    <div className={`font-black text-sm ${teamData.isPublic ? 'text-blue-600' : 'text-slate-900'}`}>Public Discovery</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Visible to all users</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setTeamData(prev => ({ ...prev, isPublic: false }))}
                  className={`flex items-center gap-4 p-6 rounded-[28px] border-2 transition-all ${!teamData.isPublic ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100'}`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${!teamData.isPublic ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                    <HiOutlineShieldCheck size={22} />
                  </div>
                  <div className="text-left">
                    <div className={`font-black text-sm ${!teamData.isPublic ? 'text-indigo-600' : 'text-slate-900'}`}>Private Access</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Invitation only</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mission Statement</label>
              <textarea
                name="description"
                value={teamData.description}
                onChange={handleInputChange}
                rows="5"
                className="w-full bg-slate-50 border-none rounded-[30px] px-8 py-6 font-medium text-slate-600 focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                required
              />
            </div>

            <div className="pt-8 flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-5 bg-slate-900 text-white rounded-[24px] font-black text-base shadow-2xl shadow-slate-400/20 hover:bg-blue-600 transition-all active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Save All Changes <HiOutlineCheckCircle size={20} /></>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default TeamEdit;
