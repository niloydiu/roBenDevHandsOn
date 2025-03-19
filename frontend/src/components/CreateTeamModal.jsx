import axios from "axios";
import React, { useContext, useState } from "react";
import { Appcontext } from "../context/Appcontext";

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
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      console.log("Submitting team:", newTeam);
      console.log("Using token:", token);

      const response = await axios.post(
        `${backendUrl}/api/team/create`,
        newTeam,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response received:", response.data);

      // Call the handler function to update state in the parent component
      handleCreateTeam(response.data);

      // Reset the form and close modal
      resetNewTeam();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating team:", error);
      setError(
        error.response?.data?.message ||
          "Failed to create team. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    showCreateModal && (
      <div className="fixed inset-0 bg-gray-50 bg-opacity-100 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
        <div className="relative top-20 mx-auto p-5 border border-gray-100 w-full max-w-md shadow-lg rounded-md bg-white">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Create a New Team</h3>
            <button
              onClick={() => {
                resetNewTeam();
                setShowCreateModal(false);
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Team Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={newTeam.name}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter team name"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description*
              </label>
              <textarea
                id="description"
                name="description"
                value={newTeam.description}
                onChange={handleInputChange}
                rows="3"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="What does your team do?"
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="cause"
              >
                Main Cause*
              </label>
              <select
                id="cause"
                name="cause"
                value={newTeam.cause}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="avatar"
              >
                Avatar URL (optional)
              </label>
              <input
                type="text"
                id="avatar"
                name="avatar"
                value={newTeam.avatar}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  name="isPublic"
                  checked={newTeam.isPublic}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="isPublic"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Make this team public (anyone can join)
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  resetNewTeam();
                  setShowCreateModal(false);
                }}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Team"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default CreateTeamModal;
