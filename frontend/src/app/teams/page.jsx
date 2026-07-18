"use client";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import CreateTeamModal from "../../components/CreateTeamModal";
import DiscoverTeamCard from "../../components/DiscoverTeamCard";
import LeaderboardTeamCard from "../../components/LeaderboardTeamCard";
import TeamCard from "../../components/TeamCard";
import { Appcontext } from "../../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineUserGroup, HiOutlineGlobeAlt, HiOutlineChartBar, HiOutlinePlus, HiOutlineEmojiHappy } from "react-icons/hi";
import { toast } from "react-toastify";
import PageWrapper from "../../components/PageWrapper";

function Teams() {
  const { backendUrl, token, isLoggedIn } = useContext(Appcontext);
  const [myTeams, setMyTeams] = useState([]);
  const [publicTeams, setPublicTeams] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    description: "",
    cause: "",
    isPublic: true,
    avatar: "",
  });

  const [activeTab, setActiveTab] = useState("myTeams");

  const fetchTeams = async () => {
    setLoading(true);
    try {
      const myPromise = isLoggedIn ? axios.get(`${backendUrl}/api/team/my-teams`, { headers: { Authorization: `Bearer ${token}` } }) : Promise.resolve({ data: [] });
      const [myRes, publicRes, topRes] = await Promise.all([
        myPromise,
        axios.get(`${backendUrl}/api/team/public`),
        axios.get(`${backendUrl}/api/team/leaderboard`)
      ]);
      setMyTeams(myRes.data || []);
      setPublicTeams(publicRes.data || []);
      setTopTeams(topRes.data || []);
    } catch (err) {
      toast.error("Failed to load teams");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeams();
  }, [token, backendUrl, isLoggedIn]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTeam(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCreateTeam = (createdTeam) => {
    setMyTeams(prev => [createdTeam, ...prev]);
    if (createdTeam.isPublic) setPublicTeams(prev => [createdTeam, ...prev]);
    setActiveTab("myTeams");
    toast.success("Team created successfully!");
  };

  const resetNewTeam = () => {
    setNewTeam({ name: "", description: "", cause: "", isPublic: true, avatar: "" });
  };

  const handleJoinTeam = async (teamId) => {
    if (!isLoggedIn) return toast.info("Please login to join teams");
    try {
      await axios.post(`${backendUrl}/api/team/join/${teamId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Successfully joined the team!");
      fetchTeams();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join team");
    }
  };

  const handleLeaveTeam = async (teamId) => {
    try {
      await axios.post(`${backendUrl}/api/team/leave/${teamId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Left the team");
      setMyTeams(prev => prev.filter(t => (t._id || t.id) !== teamId));
    } catch (err) {
      toast.error("Failed to leave team");
    }
  };

  const tabs = [
    { id: "myTeams", label: "My Teams", icon: HiOutlineUserGroup, count: myTeams.length },
    { id: "discover", label: "Discover", icon: HiOutlineGlobeAlt, count: publicTeams.length },
    { id: "leaderboard", label: "Rankings", icon: HiOutlineChartBar },
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen pb-20">
        {/* Header */}
      <div className="bg-white border-b border-slate-100 pt-12 pb-8 sticky top-16 z-30">
        <div className="container mx-auto px-4 lg:px-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">Communities</h1>
              <p className="text-slate-500 font-medium">Join teams to amplify your social impact</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-[24px] font-black shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
            >
              <HiOutlinePlus size={22} /> Create Team
            </button>
          </div>

          <div className="flex bg-slate-100/50 p-1.5 rounded-[28px] w-fit">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-sm transition-all ${
                  activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <tab.icon size={20} />
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                    {tab.count}
                  </span>
                )}
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-pill" className="absolute inset-0 bg-white rounded-2xl -z-10 shadow-md border border-slate-100" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-10 mt-12">
        <AnimatePresence mode="wait">
          {loading ? (
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
             >
                {[1,2,3,4,5,6].map(i => <div key={i} className="h-48 bg-slate-100 rounded-[32px] animate-pulse" />)}
             </motion.div>
          ) : (
            <motion.div
              key={activeTab}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "myTeams" && (
                <div className="space-y-6">
                  {myTeams.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-[40px] border-2 border-dashed border-slate-100">
                      <HiOutlineEmojiHappy className="mx-auto text-slate-200 mb-6" size={60} />
                      <h3 className="text-2xl font-black text-slate-900 mb-4">You haven't joined any teams yet</h3>
                      <button 
                        onClick={() => setActiveTab("discover")}
                        className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
                      >
                        Explore Teams
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {myTeams.map(team => (
                        <TeamCard key={team._id || team.id} team={team} handleLeaveTeam={handleLeaveTeam} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "discover" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {publicTeams.length === 0 ? (
                    <div className="col-span-full py-20 text-center text-slate-400 font-bold">No public teams found</div>
                  ) : (
                    publicTeams.map(team => (
                      <DiscoverTeamCard key={team._id || team.id} team={team} handleJoinTeam={handleJoinTeam} myTeams={myTeams} />
                    ))
                  )}
                </div>
              )}

              {activeTab === "leaderboard" && (
                <div className="max-w-5xl mx-auto bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                    <h3 className="text-xl font-black text-slate-900">Ranked by Total Hours</h3>
                    <span className="px-4 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest">Global Rankings</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rank</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Team Name</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cause</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Impact</th>
                          <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {topTeams.map((team, index) => (
                          <LeaderboardTeamCard
                            key={team._id || team.id}
                            team={team}
                            index={index}
                            handleJoinTeam={handleJoinTeam}
                            myTeams={myTeams}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CreateTeamModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        newTeam={newTeam}
        handleInputChange={handleInputChange}
        handleCreateTeam={handleCreateTeam}
        resetNewTeam={resetNewTeam}
      />
      </div>
    </PageWrapper>
  );
}

export default Teams;
