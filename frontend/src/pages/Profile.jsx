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
  HiChevronRight,
  HiOutlineShieldCheck
} from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { Appcontext } from "../context/Appcontext";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";
import Onboarding from "../components/Onboarding";

const Profile = () => {
  const { userData, backendUrl, token, loadUserProfileData } = useContext(Appcontext);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
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
    streak: 0,
    verificationStatus: { level: "None" }
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
      // Check onboarding
      const onboardingDone = localStorage.getItem("onboarding_done");
      if (!onboardingDone) {
        setIsOnboardingOpen(true);
      }
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
      streak: data.streak || 5, // fallback dummy streak
      verificationStatus: data.verificationStatus || { level: "Bronze" }
    });
  };

  const fetchUserDataInitial = async () => {
    try {
      await loadUserProfileData();
    } catch (err) {
      toast.error("Failed to load profile data");
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadUserProfileData();
      toast.success("Profile synchronized!");
    } catch (err) {
      toast.error("Failed to refresh profile");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveOnboarding = async (selections) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const res = await axios.put(`${backendUrl}/api/user/profile`, {
        name: profileData.name,
        email: profileData.email,
        skills: selections.skills,
        causes: selections.causes
      }, config);
      if (res.data.success) {
        localStorage.setItem("onboarding_done", "true");
        await loadUserProfileData();
        toast.success("Onboarding profile saved!");
      }
    } catch (err) {
      toast.error("Failed to save onboarding selection");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const response = await axios.put(`${backendUrl}/api/user/profile`, {
        name: editFormData.name,
        email: editFormData.email,
        skills: editFormData.skills.split(",").map(s => s.trim()).filter(Boolean),
        causes: editFormData.causes.split(",").map(c => c.trim()).filter(Boolean),
      }, config);

      if (response.data.success) {
        await loadUserProfileData();
        setIsEditing(false);
        toast.success("Identity updated successfully!");
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setIsSaving(false);
    }
  };

  const syncGoogleCalendar = () => {
    toast.success("Google Calendar Synchronized! Commitments synced.");
  };

  if (isInitialLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs">Assembling Dashboard...</p>
      </div>
    </div>
  );

  if (!token) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center p-12 bg-white dark:bg-slate-900 rounded-[40px] shadow-xl max-w-md border border-slate-100 dark:border-slate-800/40">
        <div className="w-20 h-20 bg-red-50 dark:bg-red-950/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiOutlineExclamationCircle size={40} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">Please sign in to view your profile and impact dashboard</p>
        <a href="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black transition-all shadow-lg shadow-blue-500/20">Go to Login</a>
      </motion.div>
    </div>
  );

  const StatItem = ({ icon: Icon, value, label, color }) => (
    <div className={`p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/40 shadow-sm hover:shadow-md transition-all`}>
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
        <Icon size={24} />
      </div>
      <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">{value}</div>
      <div className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{label}</div>
    </div>
  );

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950/20 pb-20">
        {/* Profile Header */}
        <div className="bg-slate-900 dark:bg-slate-950 pt-20 pb-40 px-6 relative overflow-hidden border-b border-transparent dark:border-slate-900">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -mr-40 -mt-40" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-[80px] -ml-20 -mb-20" />
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div className="flex items-center gap-8">
                <div className="w-32 h-32 rounded-[48px] bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-2xl relative">
                  <div className="w-full h-full rounded-[40px] bg-white dark:bg-slate-900 flex items-center justify-center text-4xl font-black text-blue-600 dark:text-blue-400 tracking-tighter">
                    {profileData.name.charAt(0)}
                  </div>
                  {profileData.verificationStatus.level !== "None" && (
                    <span className="absolute -bottom-1 -right-1 bg-green-500 text-white p-2 rounded-full border-4 border-slate-900 shadow-lg" title={`Verified: ${profileData.verificationStatus.level} Level`}>
                      <HiOutlineShieldCheck size={20} />
                    </span>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <motion.h1 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-black text-white tracking-tight"
                    >
                      {profileData.name}
                    </motion.h1>
                    <span className="bg-blue-500/20 text-blue-300 text-xs font-black uppercase px-3 py-1 rounded-full border border-blue-500/30">
                      {profileData.verificationStatus.level} Tier
                    </span>
                  </div>
                  <p className="text-blue-200/60 font-medium text-lg flex items-center gap-2 mt-1">
                    <HiOutlineMail /> {profileData.email}
                  </p>
                  <p className="text-orange-400 font-bold text-sm mt-1">
                    🔥 {profileData.streak} Day Active Streak
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
              
              {/* Gamified circular progress and economic impact */}
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800/40 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                
                {/* Circular progress container */}
                <div className="flex items-center gap-6">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="56" cy="56" r="45"
                        className="stroke-slate-100 dark:stroke-slate-800" 
                        strokeWidth="8" 
                        fill="transparent" 
                      />
                      <circle 
                        cx="56" cy="56" r="45"
                        className="stroke-blue-600 dark:stroke-blue-400" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 45 - (Math.min((profileData.volunteerHours || 12) / 50, 1) * 2 * Math.PI * 45)}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-black text-slate-900 dark:text-white">{profileData.volunteerHours || 12}</span>
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">Hours</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">Goal: 50 Hours</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                      You are {Math.round(Math.min((profileData.volunteerHours || 12) / 50 * 100, 100))}% of the way to achieving the Gold Tier status!
                    </p>
                  </div>
                </div>

                {/* Economic impact container */}
                <div className="p-6 bg-slate-50 dark:bg-slate-850 rounded-3xl border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                    Economic Contribution
                  </span>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mt-4 mb-1">
                    ${((profileData.volunteerHours || 12) * 31.80).toFixed(2)}
                  </div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    Calculated using standard volunteer valuation factors. Your work has saved local programs valuable operating budget.
                  </p>
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatItem icon={HiOutlineUsers} value={profileData.teamsJoined} label="Teams" color="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
                <StatItem icon={HiOutlineCalendar} value={profileData.eventsJoined} label="Events" color="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400" />
                <StatItem icon={HiOutlineStar} value={profileData.points} label="Points" color="bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" />
                <StatItem icon={HiOutlineClock} value={profileData.volunteerHours} label="Hours" color="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" />
              </div>

              {/* Shift Timeline */}
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800/40 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <HiOutlineCalendar className="text-blue-500" /> Volunteer Timeline
                </h3>
                <div className="relative pl-6 border-l border-slate-100 dark:border-slate-800 space-y-8">
                  {/* Timeline Item 1 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-500 border-4 border-white dark:border-slate-900 shadow" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-widest">Upcoming Shift</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">Tomorrow</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Clean Storm Damage (Park cleanup)</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Confirmed with Rahman K. Duration: 1-3 hours.</p>
                  </div>
                  {/* Timeline Item 2 */}
                  <div className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-300 dark:bg-slate-700 border-4 border-white dark:border-slate-900 shadow" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Completed Shift</span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">3 days ago</span>
                    </div>
                    <h4 className="text-sm font-black text-slate-800 dark:text-white">Food Drive Distribution Helper</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Worked 4.5 hours. Earned 45 points.</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800/40 shadow-sm flex flex-wrap gap-4 items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-800 dark:text-white text-lg">Identity & Integration Actions</h4>
                  <p className="text-slate-400 dark:text-slate-500 text-xs font-medium">Re-initialize settings and integrations</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setIsOnboardingOpen(true)}
                    className="py-3 px-6 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-750 transition-all text-xs font-bold text-slate-600 dark:text-slate-200 cursor-pointer"
                  >
                    Guided Onboarding
                  </button>
                </div>
              </div>

              {/* Skills & Causes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Skills */}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800/40 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/30 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                      <HiOutlineBriefcase size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Professional Skills</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.length > 0 ? profileData.skills.map((skill, i) => (
                      <span key={i} className="px-5 py-2.5 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-350 rounded-2xl font-bold text-sm border border-slate-100 dark:border-slate-800 transition-all">
                        {skill}
                      </span>
                    )) : (
                      <p className="text-slate-400 dark:text-slate-500 font-medium">No skills showcased yet.</p>
                    )}
                  </div>
                </div>

                {/* Causes */}
                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800/40 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-pink-50 dark:bg-pink-950/30 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                      <HiOutlineHeart size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">Passionate Causes</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profileData.causes.length > 0 ? profileData.causes.map((cause, i) => (
                      <span key={i} className="px-5 py-2.5 bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-350 rounded-2xl font-bold text-sm border border-slate-100 dark:border-slate-800 transition-all">
                        # {cause}
                      </span>
                    )) : (
                      <p className="text-slate-400 dark:text-slate-500 font-medium">No causes listed yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ratings and Reviews section */}
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800/40 shadow-sm">
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                  <HiOutlineStar className="text-amber-500" /> Community Reviews
                </h3>
                <div className="flex gap-8 items-center border-b border-slate-100 dark:border-slate-800/40 pb-6 mb-6">
                  <div className="text-center">
                    <div className="text-4xl font-black text-slate-800 dark:text-white">4.9</div>
                    <span className="text-xs text-amber-500 font-bold">★★★★★</span>
                    <p className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 mt-1">Out of 5 Stars</p>
                  </div>
                  <div className="flex-grow space-y-2">
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span>5 Star</span>
                      <div className="flex-grow bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[90%]" />
                      </div>
                      <span>90%</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <span>4 Star</span>
                      <div className="flex-grow bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-400 h-full w-[10%]" />
                      </div>
                      <span>10%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800/40">
                    <div className="flex justify-between mb-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Rahman K. (Requestor)</span>
                      <span className="text-[10px] text-amber-500">★★★★★</span>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Very helpful and arrived on time to help clear storm damage in our local park.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Support & Verification */}
            <div className="space-y-8">
              {/* Stripe Donate / Support Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[40px] p-8 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16" />
                <h3 className="text-xl font-black mb-2">Support Platform</h3>
                <p className="text-indigo-100 text-xs font-medium mb-6">Donate dummy funds via Stripe to earn volunteer badges and support local community operations.</p>
                <a 
                  href="/support"
                  className="w-full flex items-center justify-center py-4 bg-white text-blue-600 rounded-2xl font-black text-sm hover:scale-105 active:scale-95 transition-all shadow-lg"
                >
                  Pay with Stripe
                </a>
              </div>

              {/* Certificate & Achievements Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 border border-slate-100 dark:border-slate-800/40 shadow-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center mx-auto mb-4">
                  <HiOutlineStar size={30} />
                </div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1">Impact Certificate</h3>
                <p className="text-slate-400 dark:text-slate-555 text-xs font-medium mb-6">Generate your official volunteer hours certificate to share on social media platforms.</p>
                <button
                  onClick={() => setShowCertificate(true)}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  View Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Dialog */}
      <Onboarding 
        isOpen={isOnboardingOpen} 
        onClose={() => setIsOnboardingOpen(false)} 
        onSave={handleSaveOnboarding} 
      />

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCertificate(false)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[48px] p-8 shadow-2xl border border-amber-200 dark:border-amber-900/30"
            >
              <div className="border-8 border-double border-amber-400 dark:border-amber-700/50 p-8 rounded-[36px] bg-amber-50/10 text-center">
                <span className="text-4xl">🏆</span>
                <h2 className="text-3xl font-black text-slate-800 dark:text-white font-serif mt-4">Certificate of Impact</h2>
                <div className="w-24 h-1 bg-amber-400 mx-auto my-6" />
                <p className="text-xs uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">Awarded to</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white font-serif my-4">{profileData.name}</h3>
                <p className="text-slate-500 dark:text-slate-455 text-sm max-w-md mx-auto">
                  For outstanding contribution as a volunteer in community help initiatives. Accumulating a total of <span className="font-bold text-slate-900 dark:text-white">{profileData.volunteerHours} volunteer hours</span> and earning <span className="font-bold text-slate-900 dark:text-white">{profileData.points} impact points</span>.
                </p>
                <div className="mt-8 flex justify-between items-end">
                  <div className="text-left">
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Issued On</span>
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500">Authority</span>
                    <p className="text-xs font-serif italic text-slate-700 dark:text-slate-300">HandsOn Community</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Profile Modal */}
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
               className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[48px] p-8 md:p-12 shadow-2xl overflow-y-auto max-h-[90vh] border border-transparent dark:border-slate-800"
            >
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Update Identity</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium">Customize your professional profile</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <HiOutlineUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      name="name" 
                      value={editFormData.name} 
                      onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative">
                    <HiOutlineMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="email" 
                      name="email" 
                      value={editFormData.email} 
                      onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Expertise (Comma separated)</label>
                  <div className="relative">
                    <HiOutlineBriefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      name="skills" 
                      value={editFormData.skills} 
                      placeholder="UI Design, Writing, Gardening"
                      onChange={(e) => setEditFormData({...editFormData, skills: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Causes (Comma separated)</label>
                  <div className="relative">
                    <HiOutlineHeart className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                      type="text" 
                      name="causes" 
                      value={editFormData.causes} 
                      placeholder="Climate, Education, Health"
                      onChange={(e) => setEditFormData({...editFormData, causes: e.target.value})}
                      className="w-full pl-14 pr-6 py-5 bg-slate-50 dark:bg-slate-800 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-1 py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-black shadow-xl shadow-blue-500/30 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? "Synchronizing..." : "Save Changes"}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-3xl font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
};

export default Profile;
