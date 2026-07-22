"use client";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import CreateTeamModal from "../../components/CreateTeamModal";
import DiscoverTeamCard from "../../components/DiscoverTeamCard";
import LeaderboardTeamCard from "../../components/LeaderboardTeamCard";
import TeamCard from "../../components/TeamCard";
import { Appcontext } from "../../context/Appcontext";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Globe, Trophy, Plus, Smile } from "lucide-react";
import { toast } from "react-toastify";
import PageWrapper from "../../components/PageWrapper";

function Teams() {
  const { backendUrl, token, isLoggedIn } = useContext(Appcontext);
  const [myTeams, setMyTeams] = useState<any[]>([]);
  const [publicTeams, setPublicTeams] = useState<any[]>([]);
  const [topTeams, setTopTeams] = useState<any[]>([]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setNewTeam(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleCreateTeam = (createdTeam: any) => {
    setMyTeams(prev => [createdTeam, ...prev]);
    if (createdTeam.isPublic) setPublicTeams(prev => [createdTeam, ...prev]);
    setActiveTab("myTeams");
    toast.success("Team created successfully!");
  };

  const resetNewTeam = () => {
    setNewTeam({ name: "", description: "", cause: "", isPublic: true, avatar: "" });
  };

  const handleJoinTeam = async (teamId: string) => {
    if (!isLoggedIn) return toast.info("Please login to join teams");
    try {
      await axios.post(`${backendUrl}/api/team/join/${teamId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Successfully joined the team!");
      fetchTeams();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to join team");
    }
  };

  const handleLeaveTeam = async (teamId: string) => {
    try {
      await axios.post(`${backendUrl}/api/team/leave/${teamId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Left the team");
      setMyTeams(prev => prev.filter(t => (t._id || t.id) !== teamId));
    } catch (err) {
      toast.error("Failed to leave team");
    }
  };

  const tabs = [
    { id: "myTeams", label: "My Teams", icon: Users, count: myTeams.length },
    { id: "discover", label: "Discover", icon: Globe, count: publicTeams.length },
    { id: "leaderboard", label: "Rankings", icon: Trophy },
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 pb-16 text-zinc-900 dark:text-zinc-100">
        
        {/* Header */}
        <div className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900/60 py-8">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
                Volunteer Teams & Hubs
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">
                Join forces with local organizations, build impact teams, and track group statistics.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-saas btn-primary !h-9 text-xs shrink-0"
            >
              <Plus size={14} />
              <span>Create Team</span>
            </button>
          </div>
        </div>

        <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl mt-6">
          
          {/* Navigation Tabs */}
          <div className="flex border-b border-zinc-200 dark:border-zinc-800 mb-6 gap-2">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    isActive 
                      ? "border-emerald-600 dark:border-emerald-400 text-emerald-600 dark:text-emerald-400" 
                      : "border-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-48 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/60 dark:border-zinc-800 animate-pulse" />
                ))}
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {activeTab === "myTeams" && (
                  <div>
                    {myTeams.length === 0 ? (
                      <div className="card-saas !p-12 text-center">
                        <Smile size={32} className="mx-auto mb-3 text-zinc-400" />
                        <h3 className="text-base font-semibold text-zinc-900 dark:text-white mb-1">You haven't joined any teams yet</h3>
                        <p className="text-zinc-500 text-xs mb-4">Discover public volunteer teams or create your own.</p>
                        <button 
                          onClick={() => setActiveTab("discover")}
                          className="btn-saas btn-primary text-xs"
                        >
                          Explore Public Teams
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {myTeams.map(team => (
                          <TeamCard key={team._id || team.id} team={team} handleLeaveTeam={handleLeaveTeam} />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "discover" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {publicTeams.length === 0 ? (
                      <div className="col-span-full card-saas !p-12 text-center text-zinc-500 text-xs">
                        No public teams registered yet.
                      </div>
                    ) : (
                      publicTeams.map(team => (
                        <DiscoverTeamCard key={team._id || team.id} team={team} handleJoinTeam={handleJoinTeam} myTeams={myTeams} />
                      ))
                    )}
                  </div>
                )}

                {activeTab === "leaderboard" && (
                  <div className="card-saas !p-0 overflow-hidden">
                    <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">Ranked by Hours Logged</h3>
                      <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-full text-[10px] font-semibold">
                        Global Community Standings
                      </span>
                    </div>
                    <div className="overflow-x-auto text-xs">
                      <table className="w-full text-left">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-500">
                          <tr>
                            <th className="px-4 py-3 font-medium">Rank</th>
                            <th className="px-4 py-3 font-medium">Team Name</th>
                            <th className="px-4 py-3 font-medium">Cause</th>
                            <th className="px-4 py-3 font-medium text-center">Hours</th>
                            <th className="px-4 py-3 font-medium text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
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
