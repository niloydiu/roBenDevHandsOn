import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Appcontext } from "../context/Appcontext";

const Profile = () => {
  const { userData, backendUrl, token } = useContext(Appcontext);
  const [profileData, setProfileData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, [backendUrl, token]);

  // Function to fetch user data
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setProfileData({
          name: data.user.name,
          email: data.user.email,
        });
      } else {
        console.error("Failed to fetch user data:", data.message);
        setError("Failed to load profile data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("An error occurred while loading your profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
        <p className="text-center text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>

      {/* Profile Information */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold border-b pb-2">
          Personal Information
        </h2>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100">
            {profileData.name}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <p className="mt-1 p-2 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-100">
            {profileData.email}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <p className="mt-4 text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default Profile;
