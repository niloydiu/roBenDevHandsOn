import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { 
  HiOutlineUser, 
  HiOutlineMail, 
  HiOutlineBriefcase, 
  HiOutlineHeart, 
  HiOutlineTrendingUp, 
  HiOutlineClock, 
  HiOutlineStar,
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlinePencil,
  HiOutlineRefresh,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiChevronRight
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Appcontext } from "../context/Appcontext";
import { toast } from "react-toastify";

const Profile = () => {
  const { userData, backendUrl, token, loadUserProfileData } = useContext(Appcontext);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    skills: [],
    causes: [],
    teamsCreated: 0,
    teamsJoined: 0,
    eventsCreated: 0,
    eventsJoined: 0,
    helpRequested: 0,
    helpOffered: 0,
    volunteerHours: 0,
    points: 0,
    teams: [],
    events: [],
    pendingHours: [],
  });

  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    skills: "",
    causes: "",
  });

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserDataInitial();
    } else {
      setIsInitialLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (userData) {
      updateProfileFromUserData(userData);
      setIsInitialLoading(false);
    }
  }, [userData]);

  useEffect(() => {
    if (isEditing) {
      setEditFormData({
        name: profileData.name || "",
        email: profileData.email || "",
        skills: profileData.skills ? profileData.skills.join(", ") : "",
        causes: profileData.causes ? profileData.causes.join(", ") : "",
      });
    }
  }, [isEditing, profileData]);

  const updateProfileFromUserData = (data) => {
    let eventsData = data.eventsJoined || [];
    if (!Array.isArray(eventsData)) eventsData = [];

    setProfileData({
      name: data.name || "",
      email: data.email || "",
      skills: data.skills || [],
      causes: data.causes || [],
      teamsCreated: data.teamsCreated || 0,
      teamsJoined: data.teams?.length || 0,
      eventsCreated: data.eventsCreated || 0,
      eventsJoined: eventsData.length || 0,
      helpRequested: data.helpRequested || 0,
      helpOffered: data.helpOffered || 0,
      volunteerHours: data.volunteerHours || 0,
      points: data.points || 0,
      teams: data.teams || [],
      events: eventsData,
      pendingHours: data.pendingHours || [],
    });
  };

  const fetchUserDataInitial = async () => {
    setIsInitialLoading(true);
    await fetchUserData();
    setIsInitialLoading(false);
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserData();
    setIsRefreshing(false);
    toast.success("Profile updated");
  };

  const fetchUserData = async (updateGlobalContext = true) => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success && response.data.user) {
        const user = response.data.user;
        if (user.eventsJoined && user.eventsJoined.length > 0) {
          try {
            const eventsResponse = await axios.get(`${backendUrl}/api/event`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            if (eventsResponse.data?.success && Array.isArray(eventsResponse.data.events)) {
              const joinedEventIds = user.eventsJoined.map(e => typeof e === 'object' ? e._id : e);
              user.eventsJoinedDetails = eventsResponse.data.events.filter(e => joinedEventIds.includes(e._id));
            }
          } catch (err) { console.error(err); }
        }
        updateProfileFromUserData(user);
        if (updateGlobalContext) loadUserProfileData();
      }
    } catch (err) {
      toast.error("Failed to sync profile");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const skills = editFormData.skills.split(",").map(s => s.trim()).filter(s => s !== "");
      const causes = editFormData.causes.split(",").map(s => s.trim()).filter(s => s !== "");
      
      const response = await axios.put(`${backendUrl}/api/user/profile`, {
        name: editFormData.name,
        email: editFormData.email,
        skills,
        causes,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        await fetchUserData(true);
        setIsEditing(false);
        toast.success("Changes saved!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isInitialLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
        <p className="font-black text-slate-900 uppercase tracking-widest text-xs">Loading Experience</p>
      </div>
    </div>
  );

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-12 bg-white rounded-[40px] shadow-xl">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiOutlineExclamationCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">Access Denied</h2>
        <p className="text-slate-500 font-medium mb-8">Please sign in to view your profile</p>
        <a href="/login" className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black">Go to Login</a>
      </motion.div>
    </div>
  );

  const StatItem = ({ icon: Icon, value, label, color }) => (
    <div className={`p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all`}>
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <div className="text-3xl font-black text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-bold text-slate-400 uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Profile Header */}
      <div className="bg-slate-900 pt-20 pb-40 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -ml-20 -mb-20" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex items-center gap-8">
              <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-2xl">
                <div className="w-full h-full rounded-[40px] bg-white flex items-center justify-center text-4xl font-black text-blue-600 tracking-tighter">
                  {profileData.name.charAt(0)}
                </div>
              </div>
              <div>
                <motion.h1 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-5xl font-black text-white mb-2 tracking-tight"
                >
                  {profileData.name}
                </motion.h1>
                <p className="text-blue-200/60 font-medium text-lg flex items-center gap-2">
                  <HiOutlineMail /> {profileData.email}
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button 
                onClick={handleManualRefresh}
                className="p-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl transition-all border border-white/10 group"
              >
                <HiOutlineRefresh size={24} className={isRefreshing ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"} />
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-500/25 flex items-center gap-2"
              >
                <HiOutlinePencil size={20} /> Edit Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Dashboard Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatItem icon={HiOutlineUsers} value={profileData.teamsJoined} label="Teams" color="bg-blue-50 text-blue-600" />
              <StatItem icon={HiOutlineCalendar} value={profileData.eventsJoined} label="Events" color="bg-indigo-50 text-indigo-600" />
              <StatItem icon={HiOutlineStar} value={profileData.points} label="Points" color="bg-amber-50 text-amber-600" />
              <StatItem icon={HiOutlineClock} value={profileData.volunteerHours} label="Hours" color="bg-emerald-50 text-emerald-600" />
            </div>

            {/* Content Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Skills */}
              <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center">
                    <HiOutlineBriefcase size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Professional Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.length > 0 ? profileData.skills.map((skill, i) => (
                    <span key={i} className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm border border-slate-100 italic transition-all hover:bg-white hover:border-violet-200">
                      {skill}
                    </span>
                  )) : (
                    <p className="text-slate-400 font-medium">No skills showcased yet.</p>
                  )}
                </div>
              </div>

              {/* Causes */}
              <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
                    <HiOutlineHeart size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Passionate Causes</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.causes.length > 0 ? profileData.causes.map((cause, i) => (
                    <span key={i} className="px-5 py-2.5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm border border-slate-100 transition-all hover:bg-white hover:border-pink-200">
                      # {cause}
                    </span>
                  )) : (
                    <p className="text-slate-400 font-medium">No causes listed yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Activity History */}
            <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <HiOutlineTrendingUp className="text-blue-600" /> Recent Impact
              </h3>
              
              <div className="space-y-6">
                {profileData.events.length > 0 ? profileData.events.slice(0, 3).map((event, i) => (
                  <div key={i} className="group flex items-center justify-between p-6 rounded-3xl bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 font-black">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                          {typeof event === 'object' ? event.title : "Volunteer Initiative"}
                        </h4>
                        <p className="text-slate-500 font-bold text-sm">
                          {typeof event === 'object' && event.date ? new Date(event.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' }) : "Recently Activity"}
                        </p>
                      </div>
                    </div>
                    <a href={`/events/${typeof event === 'object' ? event._id : event}`} className="p-3 bg-white text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                      <HiChevronRight size={20} />
                    </a>
                  </div>
                )) : (
                  <div className="text-center py-12">
                    <p className="text-slate-400 font-bold mb-4">You haven't made your first impact yet.</p>
                    <a href="/events" className="text-blue-600 font-black hover:underline">Explore Opportunities</a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Requests & Teams */}
          <div className="space-y-8">
            {/* Status Section */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16" />
              <h3 className="text-xl font-black text-slate-900 mb-6 relative">Verification Center</h3>
              
              {profileData.pendingHours.length > 0 ? (
                <div className="space-y-4">
                  {profileData.pendingHours.map((pending, i) => (
                    <div key={i} className={`p-4 rounded-3xl border ${
                      pending.status === 'approved' ? 'bg-emerald-50/50 border-emerald-100' : 
                      pending.status === 'rejected' ? 'bg-rose-50/50 border-rose-100' : 'bg-amber-50/50 border-amber-100'
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          pending.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                          pending.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {pending.status}
                        </span>
                        <span className="text-xs font-bold text-slate-400">{new Date(pending.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-black text-slate-800">{pending.hours} Hours requested</p>
                      <p className="text-xs font-bold text-slate-500 truncate">{pending.event?.title || 'Unknown Event'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <HiOutlineCheckCircle className="mx-auto text-slate-200 mb-2" size={32} />
                  <p className="text-slate-400 font-bold text-sm">All entries verified.</p>
                </div>
              )}
            </div>

            {/* Contribution Stats */}
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-500/20">
              <h3 className="text-xl font-black mb-6">Social Influence</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <HiOutlineUsers size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-black">{profileData.helpOffered}</div>
                    <div className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Help Offered</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <HiOutlineUsers size={24} />
                  </div>
                  <div>
                    <div className="text-2xl font-black">{profileData.helpRequested}</div>
                    <div className="text-xs font-bold text-indigo-100 uppercase tracking-widest">Requests Sent</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal Overlay */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditing(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
               initial={{ opacity: 0, scale: 0.95, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.95, y: 20 }}
               className="relative w-full max-w-xl bg-white rounded-[48px] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-black text-slate-900 mb-2">Update Identity</h2>
                <p className="text-slate-500 font-medium">Customize your professional profile</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      name="name" 
                      value={editFormData.name} 
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="email" 
                      name="email" 
                      value={editFormData.email} 
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expertise (Comma separated)</label>
                  <div className="relative">
                    <HiOutlineBriefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      name="skills" 
                      value={editFormData.skills} 
                      placeholder="UI Design, Writing, Gardening"
                      onChange={(e) => setEditFormData({...editFormData, skills: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Causes (Comma separated)</label>
                  <div className="relative">
                    <HiOutlineHeart className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      name="causes" 
                      value={editFormData.causes} 
                      placeholder="Climate, Education, Health"
                      onChange={(e) => setEditFormData({...editFormData, causes: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900" 
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 py-5 bg-blue-600 text-white rounded-3xl font-black shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSaving ? "Synchronizing..." : "Save Changes"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-5 bg-slate-100 text-slate-600 rounded-3xl font-black hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
