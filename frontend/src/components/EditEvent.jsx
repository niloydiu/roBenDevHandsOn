import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl } = useContext(Appcontext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Form state
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    category: "",
    maxParticipants: 10,
    requirements: "",
    organizer: "",
  });

  // Load the event data when component mounts
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/event/${id}`);

        // Format the date for the input field with proper validation
        let formattedDate = "";
        if (response.data.event?.date) {
          try {
            const eventDate = new Date(response.data.event.date);

            // Check if date is valid before formatting
            if (!isNaN(eventDate.getTime())) {
              formattedDate = eventDate.toISOString().split("T")[0];
            } else {
              console.warn(
                "Invalid date format in event:",
                response.data.event.date
              );
              formattedDate = ""; // Fallback to empty string
            }
          } catch (dateError) {
            console.warn("Error parsing date:", dateError);
          }
        }

        const eventToUpdate = response.data.event || response.data;

        setEventData({
          ...eventToUpdate,
          date: formattedDate,
          // Ensure we have default values for optional fields
          requirements: eventToUpdate.requirements || "",
          organizer: eventToUpdate.organizer || "",
          maxParticipants: eventToUpdate.maxParticipants || 10,
        });
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError("Failed to load event details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id && backendUrl && token) {
      fetchEventData();
    } else {
      navigate("/events");
    }
  }, [id, backendUrl, token, navigate]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in to update an event");
      navigate("/login");
      return;
    }

    try {
      setSubmitting(true);

      // Convert maxParticipants to number
      const updatedEventData = {
        ...eventData,
        maxParticipants: Number(eventData.maxParticipants),
      };

      await axios.put(`${backendUrl}/api/event/${id}`, updatedEventData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Event updated successfully!");
      navigate(`/events/${id}`);
    } catch (err) {
      console.error("Error updating event:", err);
      setError(
        err.response?.data?.message ||
          "Failed to update event. Please try again."
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
      <h1 className="text-3xl font-bold mb-6">Edit Event</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={eventData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-2">Category</label>
            <select
              name="category"
              value={eventData.category}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select a category</option>
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
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium mb-2">Date</label>
            <input
              type="date"
              name="date"
              value={eventData.date}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Start Time */}
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={eventData.startTime}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* End Time */}
          <div>
            <label className="block text-sm font-medium mb-2">End Time</label>
            <input
              type="time"
              name="endTime"
              value={eventData.endTime}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={eventData.location}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Max Participants */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Maximum Participants
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={eventData.maxParticipants}
              min="1"
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* Organizer */}
          <div>
            <label className="block text-sm font-medium mb-2">Organizer</label>
            <input
              type="text"
              name="organizer"
              value={eventData.organizer || ""}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={eventData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            ></textarea>
          </div>

          {/* Requirements */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Requirements (optional)
            </label>
            <textarea
              name="requirements"
              value={eventData.requirements || ""}
              onChange={handleInputChange}
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={() => navigate(`/events/${id}`)}
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
            {submitting ? "Updating..." : "Update Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditEvent;
