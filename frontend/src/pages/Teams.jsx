import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import CreateTeamModal from "../components/CreateTeamModal";
import DiscoverTeamCard from "../components/DiscoverTeamCard";
import LeaderboardTeamCard from "../components/LeaderboardTeamCard";
import TeamCard from "../components/TeamCard";
import { Appcontext } from "../context/Appcontext";

function Teams() {
  const { backendUrl, token } = useContext(Appcontext);
  const [myTeams, setMyTeams] = useState([]);
  const [publicTeams, setPublicTeams] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    setError(null);
    try {
      // Fetch my teams
      const myTeamsResponse = await axios.get(
        `${backendUrl}/api/team/my-teams`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyTeams(myTeamsResponse.data || []);

      // Fetch public teams
      const publicTeamsResponse = await axios.get(
        `${backendUrl}/api/team/public`
      );
      setPublicTeams(publicTeamsResponse.data || []);

      // Fetch top teams
      const topTeamsResponse = await axios.get(
        `${backendUrl}/api/team/leaderboard`
      );
      setTopTeams(topTeamsResponse.data || []);
    } catch (err) {
      console.error("Error fetching teams:", err);
      setError("Failed to load teams. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTeams();
    } else {
      setLoading(false);
    }
  }, [token, backendUrl]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewTeam((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateTeam = (createdTeam) => {
    console.log("Team created successfully:", createdTeam);

    // Update the teams list with the newly created team
    setMyTeams((prev) => [createdTeam, ...prev]);

    if (createdTeam.isPublic) {
      setPublicTeams((prev) => [createdTeam, ...prev]);
    }

    // Navigate to my teams tab to show the new team
    setActiveTab("myTeams");
  };

  const resetNewTeam = () => {
    setNewTeam({
      name: "",
      description: "",
      cause: "",
      isPublic: true,
      avatar: "",
    });
  };

  const handleJoinTeam = async (teamId) => {
    try {
      console.log("Joining team with ID:", teamId);

      const response = await axios.post(
        `${backendUrl}/api/team/join/${teamId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Join team response:", response.data);

      // Show success message
      alert("Successfully joined the team!");

      // Refresh teams data after joining
      fetchTeams();
    } catch (err) {
      console.error("Error joining team:", err.response?.data || err.message);
      alert(
        err.response?.data?.message || "Failed to join team. Please try again."
      );
    }
  };

  const handleLeaveTeam = async (teamId) => {
    try {
      console.log("Leaving team with ID:", teamId);

      const response = await axios.post(
        `${backendUrl}/api/team/leave/${teamId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      console.log("Leave team response:", response.data);

      // Show success message
      alert("Successfully left the team!");

      // Remove team from my teams - use the correct ID field
      setMyTeams((prev) =>
        prev.filter((team) => (team._id || team.id) !== teamId)
      );
    } catch (err) {
      console.error("Error leaving team:", err.response?.data || err.message);
      alert(
        err.response?.data?.message || "Failed to leave team. Please try again."
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Teams</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Create Team
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
          <p>{error}</p>
        </div>
      )}

      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab("myTeams")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "myTeams"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            My Teams
          </button>
          <button
            onClick={() => setActiveTab("discover")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "discover"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Discover Teams
          </button>
          <button
            onClick={() => setActiveTab("leaderboard")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === "leaderboard"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Team Leaderboard
          </button>
        </nav>
      </div>

      {loading ? (
        <div className="text-center py-10">
          <p>Loading teams...</p>
        </div>
      ) : (
        <>
          {activeTab === "myTeams" && (
            <div>
              {myTeams.length === 0 ? (
                <p className=" text-red-700">
                  <span>
                    No teams found. Create or join a team to get started!
                  </span>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md ml-2"
                  >
                    Create Team
                  </button>
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myTeams.map((team) => (
                    <TeamCard
                      key={team._id || team.id}
                      team={team}
                      handleLeaveTeam={handleLeaveTeam}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "discover" && (
            <div>
              {publicTeams.length === 0 ? (
                <p>No public teams available to join</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publicTeams.map((team) => (
                    <DiscoverTeamCard
                      key={team._id || team.id}
                      team={team}
                      handleJoinTeam={handleJoinTeam}
                      myTeams={myTeams}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "leaderboard" && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Most Active Teams</h2>

              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Rank
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Team
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Cause
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Members
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total Hours
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
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
        </>
      )}

      <CreateTeamModal
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        newTeam={newTeam}
        handleInputChange={handleInputChange}
        handleCreateTeam={handleCreateTeam}
        resetNewTeam={resetNewTeam}
      />
    </div>
  );
}

export default Teams;
