import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Appcontext } from "../context/Appcontext";

const Profile = () => {
  const { userData, backendUrl, token, setUserData } = useContext(Appcontext);
  const [profileData, setProfileData] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    skills: userData?.skills || [],
    causes: userData?.causes || [],
  });
  const [editableData, setEditableData] = useState({
    name: "",
    email: "",
    skills: [],
    causes: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [causeInput, setCauseInput] = useState("");
  const [saving, setSaving] = useState(false);

  // Available causes to select from
  const availableCauses = [
    "environment",
    "education",
    "food",
    "healthcare",
    "animals",
    "elderly",
    "development",
    "community",
  ];

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
        const user = data.user;
        setProfileData({
          name: user.name || "",
          email: user.email || "",
          skills: user.skills || [],
          causes: user.causes || [],
          volunteerHours: user.volunteerHours || 0,
          points: user.points || 0,
          // Add new statistics
          teamsCreated: user.teamsCreated || 0,
          teamsJoined: user.teamsJoined || 0,
          helpOffered: user.helpOffered || 0,
          helpRequested: user.helpRequested || 0,
          eventsCreated: user.eventsCreated || 0,
          eventsJoined: user.eventsJoined?.length || 0,
        });
        setEditableData({
          name: user.name || "",
          email: user.email || "",
          skills: user.skills || [],
          causes: user.causes || [],
        });
        // Update context with latest user data
        setUserData(user);
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

  // Handle input change for form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  // Add skill to the list
  const handleAddSkill = () => {
    if (skillInput.trim() && !editableData.skills.includes(skillInput.trim())) {
      setEditableData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  // Remove skill from the list
  const handleRemoveSkill = (skillToRemove) => {
    setEditableData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  // Toggle cause selection
  const handleToggleCause = (cause) => {
    const updatedCauses = editableData.causes.includes(cause)
      ? editableData.causes.filter((c) => c !== cause)
      : [...editableData.causes, cause];
    
    setEditableData((prev) => ({
      ...prev,
      causes: updatedCauses,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/user/profile`,
        editableData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (data.success) {
        setProfileData({
          ...profileData,
          ...editableData,
        });
        setSuccess("Profile updated successfully!");
        setIsEditing(false);
        // Update context with latest user data
        setUserData(data.user);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditableData({
      name: profileData.name,
      email: profileData.email,
      skills: profileData.skills,
      causes: profileData.causes,
    });
    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg p-6 animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-12 px-3 sm:px-6">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-6 sm:px-8 sm:py-10 text-white relative">
          <h1 className="text-2xl sm:text-3xl font-bold">Your Profile</h1>
          <p className="mt-2 text-blue-100 text-sm sm:text-base">
            Manage your personal information and volunteer preferences
          </p>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white text-blue-600 hover:bg-blue-50 font-medium py-1.5 px-3 sm:py-2 sm:px-4 rounded-md transition-colors flex items-center text-sm sm:text-base"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="inline sm:hidden">Edit</span>
            </button>
          )}
        </div>
        
        {/* Status Messages */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mx-3 sm:mx-6 my-3 sm:my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border-l-4 border-green-500 p-3 sm:p-4 mx-3 sm:mx-6 my-3 sm:my-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-xs sm:text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="p-3 sm:p-6">
          {/* View Mode */}
          {!isEditing ? (
            <div className="space-y-6 sm:space-y-8">
              {/* Stats Section */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl font-bold text-blue-600">
                      {profileData.volunteerHours || 0}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm font-medium text-gray-600">
                      Volunteer Hours
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 sm:p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl font-bold text-purple-600">
                      {profileData.points || 0}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm font-medium text-gray-600">
                      Impact Points
                    </div>
                  </div>
                </div>
              </div>

              {/* New Statistics Section */}
              <div className="grid grid-cols-2 gap-3 sm:gap-6">
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3 sm:p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl font-bold text-yellow-600">
                      {profileData.teamsCreated || 0}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm font-medium text-gray-600">
                      Teams Created
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-3 sm:p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl font-bold text-green-600">
                      {profileData.teamsJoined || 0}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm font-medium text-gray-600">
                      Teams Joined
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-3 sm:p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl font-bold text-red-600">
                      {profileData.helpOffered || 0}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm font-medium text-gray-600">
                      Help Offered
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl font-bold text-blue-600">
                      {profileData.helpRequested || 0}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm font-medium text-gray-600">
                      Help Requested
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-3 sm:p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl font-bold text-purple-600">
                      {profileData.eventsCreated || 0}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm font-medium text-gray-600">
                      Events Created
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-3 sm:p-6 shadow-sm">
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl font-bold text-green-600">
                      {profileData.eventsJoined || 0}
                    </div>
                    <div className="mt-1 text-xs sm:text-sm font-medium text-gray-600">
                      Events Joined
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 mb-3 sm:mb-4">
                  Personal Information
                </h2>

                <div className="space-y-3 sm:space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <div className="mt-1 p-2 sm:p-3 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm">
                      {profileData.name}
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <div className="mt-1 p-2 sm:p-3 block w-full border border-gray-300 rounded-md shadow-sm bg-gray-50 text-sm break-all">
                      {profileData.email}
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills & Interests */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Skills */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 mb-3 sm:mb-4">
                    Skills
                  </h2>
                  
                  {profileData.skills && profileData.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                      {profileData.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-xs sm:text-sm">No skills added yet</p>
                  )}
                </div>

                {/* Interests/Causes */}
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold border-b pb-2 mb-3 sm:mb-4">
                    Volunteer Interests
                  </h2>
                  
                  {profileData.causes && profileData.causes.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                      {profileData.causes.map((cause, index) => (
                        <span
                          key={index}
                          className="bg-green-100 text-green-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full"
                        >
                          {cause}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-xs sm:text-sm">No interests added yet</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Edit Mode */
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 sm:space-y-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
                  Edit Your Profile
                </h2>

                {/* Personal Information */}
                <div className="space-y-3 sm:space-y-4">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-700">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={editableData.name}
                      onChange={handleInputChange}
                      className="mt-1 p-2 sm:p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={editableData.email}
                      onChange={handleInputChange}
                      className="mt-1 p-2 sm:p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm"
                      required
                    />
                  </div>
                </div>

                <hr className="my-4 sm:my-6" />

                {/* Skills Section */}
                <div>
                  <label className="block text-base sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">
                    Skills
                  </label>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Add skills that you can offer when volunteering
                  </p>

                  {/* Skill Input */}
                  <div className="flex gap-2 mb-3 sm:mb-4">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="Add a skill (e.g. Teaching)"
                      className="p-2 text-sm block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      className="bg-blue-600 hover:bg-blue-700 text-white py-1 sm:py-2 px-3 sm:px-4 text-sm rounded-md shadow-sm transition-colors whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>

                  {/* Skills List */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2">
                    {editableData.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full flex items-center"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    {editableData.skills.length === 0 && (
                      <p className="text-gray-500 italic text-xs sm:text-sm">No skills added yet</p>
                    )}
                  </div>
                </div>

                <hr className="my-4 sm:my-6" />

                {/* Causes/Interests Section */}
                <div>
                  <label className="block text-base sm:text-lg font-medium text-gray-800 mb-1 sm:mb-2">
                    Volunteer Interests
                  </label>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    Select causes you're interested in supporting
                  </p>

                  {/* Causes Selection */}
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 sm:gap-3">
                    {availableCauses.map((cause) => (
                      <div
                        key={cause}
                        onClick={() => handleToggleCause(cause)}
                        className={`cursor-pointer border rounded-lg p-2 sm:p-3 flex items-center transition-all ${
                          editableData.causes.includes(cause)
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-300 hover:border-green-400'
                        }`}
                      >
                        <div className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full mr-1.5 sm:mr-2 flex items-center justify-center ${
                          editableData.causes.includes(cause)
                            ? 'bg-green-500 text-white' 
                            : 'border border-gray-400'
                        }`}>
                          {editableData.causes.includes(cause) && (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-2.5 w-2.5 sm:h-3 sm:w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="capitalize text-xs sm:text-sm truncate">{cause}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-2 sm:space-x-3 pt-4 sm:pt-6">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-white py-1.5 sm:py-2 px-3 sm:px-4 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 py-1.5 sm:py-2 px-3 sm:px-4 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                  >
                    {saving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 sm:h-4 sm:w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span className="sm:inline hidden">Saving...</span>
                        <span className="inline sm:hidden">...</span>
                      </>
                    ) : "Save Changes"}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
