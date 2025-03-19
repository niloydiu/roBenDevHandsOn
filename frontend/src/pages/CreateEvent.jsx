import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

function CreateEvent() {
  const navigate = useNavigate();
  const { isLoggedIn, token, fetchAllEvents } = useContext(Appcontext); // Use isLoggedIn and token from Appcontext

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    maxParticipants: "",
    requirements: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Redirect to /login if the user is not logged in
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login"); // Redirect to login if not logged in
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description)
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.startTime) newErrors.startTime = "Start time is required";
    if (!formData.location) newErrors.location = "Location is required";

    if (formData.maxParticipants) {
      const participants = parseInt(formData.maxParticipants);
      if (isNaN(participants) || participants < 1) {
        newErrors.maxParticipants = "Please enter a valid number";
      }
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    fetchAllEvents();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/event/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token for authentication
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Event created successfully!");
        navigate("/events");
      } else {
        alert(data.message || "Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      alert("An error occurred while creating the event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Volunteer Event</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Event Title */}
          <div className="col-span-2">
            <label htmlFor="title" className="block font-medium mb-1">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter a descriptive title for your event"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Event Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block font-medium mb-1">
              Event Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full p-2 border rounded ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe what volunteers will be doing and the impact they'll make"
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Event Category */}
          <div>
            <label htmlFor="category" className="block font-medium mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              <option value="Environmental">Environmental</option>
              <option value="Education">Education</option>
              <option value="Hunger Relief">Hunger Relief</option>
              <option value="Community Support">Community Support</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Animal Welfare">Animal Welfare</option>
              <option value="Crisis Response">Crisis Response</option>
              <option value="Arts & Culture">Arts & Culture</option>
              <option value="Other">Other</option>
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">{errors.category}</p>
            )}
          </div>

          {/* Event Date */}
          <div>
            <label htmlFor="date" className="block font-medium mb-1">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.date ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Event Time */}
          <div>
            <label htmlFor="startTime" className="block font-medium mb-1">
              Start Time *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.startTime ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startTime && (
              <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>
            )}
          </div>

          <div>
            <label htmlFor="endTime" className="block font-medium mb-1">
              End Time
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          {/* Event Location */}
          <div className="col-span-2">
            <label htmlFor="location" className="block font-medium mb-1">
              Location *
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full p-2 border rounded ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter the full address where the event will take place"
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Maximum Participants */}
          <div>
            <label htmlFor="maxParticipants" className="block font-medium mb-1">
              Maximum Participants
            </label>
            <input
              type="number"
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              min="1"
              className={`w-full p-2 border rounded ${
                errors.maxParticipants ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Leave blank for unlimited"
            />
            {errors.maxParticipants && (
              <p className="text-red-500 text-sm mt-1">
                {errors.maxParticipants}
              </p>
            )}
          </div>

          {/* Special Requirements */}
          <div className="col-span-2">
            <label htmlFor="requirements" className="block font-medium mb-1">
              Special Requirements
            </label>
            <textarea
              id="requirements"
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="List any items participants should bring or skills they should have"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="px-6 py-2 border border-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white bg-blue-500 rounded"
            disabled={submitting}
          >
            {submitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
