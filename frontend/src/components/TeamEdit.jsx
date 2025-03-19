import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

function TeamEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(Appcontext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    cause: "",
    isPublic: true,
    avatar: "",
  });

  // Load the team data when component mounts
  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        // Fixed API endpoint: 'teams' → 'team' (singular)
        const response = await axios.get(`${backendUrl}/api/team/${id}`);
        setTeamData({
          name: response.data.name || "",
          description: response.data.description || "",
          cause: response.data.cause || "",
          isPublic: response.data.isPublic !== false, // default to true if undefined
          avatar: response.data.avatar || "",
        });
      } catch (err) {
        console.error("Error fetching team details:", err);
        setError("Failed to load team details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id && backendUrl && token) {
      fetchTeamData();
    } else {
      navigate("/teams");
    }
  }, [id, backendUrl, token, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTeamData({
      ...teamData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to update a team");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);

      // Fixed API endpoint: 'teams' → 'team' (singular)
      await axios.put(`${backendUrl}/api/team/${id}`, teamData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Team updated successfully!");
      navigate(`/teams/${id}`);
    } catch (err) {
      console.error("Error updating team:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update team. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Edit Team</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 gap-6">
          {/* Team Name */}
          <div>
            <label className="block text-sm font-medium mb-2">Team Name</label>
            <input
              type="text"
              name="name"
              value={teamData.name}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Cause/Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Team Cause</label>
            <select
              name="cause"
              value={teamData.cause}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a cause</option>
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

          {/* Avatar URL */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Avatar URL (optional)
            </label>
            <input
              type="text"
              name="avatar"
              value={teamData.avatar}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="https://example.com/image.jpg"
            />
            {teamData.avatar && (
              <div className="mt-2">
                <p className="text-sm mb-1">Preview:</p>
                <img
                  src={teamData.avatar}
                  alt="Avatar preview"
                  className="h-16 w-16 rounded-full object-cover border border-gray-300"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/100x100?text=Team";
                  }}
                />
              </div>
            )}
          </div>

          {/* Public/Private Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              name="isPublic"
              id="isPublic"
              checked={teamData.isPublic}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="isPublic"
              className="ml-2 block text-sm text-gray-900"
            >
              Make this team public (Anyone can join)
            </label>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={teamData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate(`/teams/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? "Updating..." : "Update Team"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TeamEdit;
