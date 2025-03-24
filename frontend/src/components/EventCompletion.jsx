import axios from "axios";
import React, { useContext, useState } from "react";
import { FaClock, FaSpinner } from "react-icons/fa";
import { Appcontext } from "../context/Appcontext";

const EventCompletion = ({ eventId, eventTitle, onSuccess }) => {
  const [hours, setHours] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { backendUrl, token, loadUserProfileData } = useContext(Appcontext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setError("Please log in to record volunteer hours");
      return;
    }

    if (hours <= 0) {
      setError("Please enter a valid number of hours");
      return;
    }

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        `${backendUrl}/api/event/complete`,
        {
          eventId,
          hoursContributed: hours,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(response.data.message);
        setHours(1);

        // Refresh user data to show updated points/hours
        loadUserProfileData();

        // Call the onSuccess callback if provided
        if (onSuccess && typeof onSuccess === "function") {
          onSuccess(response.data);
        }
      }
    } catch (err) {
      console.error("Error completing event:", err);
      setError(
        err.response?.data?.message || "Failed to record volunteer hours"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mt-6">
      <h3 className="font-semibold text-blue-800 flex items-center">
        <FaClock className="mr-2" />
        Record Volunteer Hours
      </h3>

      <p className="text-sm text-blue-700 mt-2 mb-4">
        Log your volunteer hours for <strong>{eventTitle}</strong> to earn
        points!
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-sm">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <label
            htmlFor="hours"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Hours Volunteered
          </label>
          <input
            type="number"
            id="hours"
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            min="0.5"
            step="0.5"
            required
            className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded-md font-medium ${
            isSubmitting
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="inline animate-spin mr-1" /> Submitting...
            </>
          ) : (
            "Log Hours"
          )}
        </button>
      </form>
    </div>
  );
};

export default EventCompletion;
