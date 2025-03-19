import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Appcontext } from "../context/Appcontext";

const Profile = () => {
  const { userData, backendUrl, token } = useContext(Appcontext);
  const [formData, setFormData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    skills: userData?.skills || [],
    causes: userData?.causes || [],
    volunteerHours: userData?.volunteerHours || 0,
    points: userData?.points || 0,
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data.success) {
          setFormData({
            name: data.user.name,
            email: data.user.email,
            skills: data.user.skills || [],
            causes: data.user.causes || [],
            volunteerHours: data.user.volunteerHours || 0,
            points: data.user.points || 0,
          });
        } else {
          console.error("Failed to fetch user data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [backendUrl, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    const values = e.target.value.split(",").map((item) => item.trim());
    setFormData({ ...formData, [field]: values });
  };

  // Separate function to enable editing
  const enableEditing = () => {
    setIsEditing(true);
  };

  // Separate function to cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    // Reset form data to original values
    setFormData({
      name: userData?.name || "",
      email: userData?.email || "",
      skills: userData?.skills || [],
      causes: userData?.causes || [],
      volunteerHours: userData?.volunteerHours || 0,
      points: userData?.points || 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission
    setLoading(true);
    setMessage("");

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setMessage("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setMessage(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

      {/* Edit/Save Buttons Outside Form */}
      <div className="flex justify-end mb-4">
        {!isEditing ? (
          <button
            type="button"
            onClick={enableEditing}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={cancelEditing}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}
      </div>

      {/* Form without submit button */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              isEditing ? "" : "bg-gray-100"
            }`}
            readOnly={!isEditing}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              isEditing ? "" : "bg-gray-100"
            }`}
            readOnly={!isEditing}
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Skills (comma-separated)
          </label>
          <input
            type="text"
            name="skills"
            value={formData.skills.join(", ")}
            onChange={(e) => handleArrayChange(e, "skills")}
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              isEditing ? "" : "bg-gray-100"
            }`}
            readOnly={!isEditing}
          />
        </div>

        {/* Causes */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Causes (comma-separated)
          </label>
          <input
            type="text"
            name="causes"
            value={formData.causes.join(", ")}
            onChange={(e) => handleArrayChange(e, "causes")}
            className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
              isEditing ? "" : "bg-gray-100"
            }`}
            readOnly={!isEditing}
          />
        </div>

        {/* Volunteer Hours */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Volunteer Hours
          </label>
          <input
            type="number"
            name="volunteerHours"
            value={formData.volunteerHours}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
            readOnly
          />
        </div>

        {/* Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Points
          </label>
          <input
            type="number"
            name="points"
            value={formData.points}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-100"
            readOnly
          />
        </div>
      </div>

      {/* Message */}
      {message && (
        <p className="mt-4 text-sm text-green-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default Profile;
