import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { FaCheck, FaSpinner, FaTimes } from "react-icons/fa";
import { Appcontext } from "../context/Appcontext";

const AdminPendingHours = () => {
  const { backendUrl, token } = useContext(Appcontext);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingAction, setProcessingAction] = useState(null);

  useEffect(() => {
    fetchPendingHours();
  }, [backendUrl, token]);

  const fetchPendingHours = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/user/pending-hours`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setPendingUsers(response.data.pendingHours);
      }
    } catch (error) {
      console.error("Error fetching pending hours:", error);
      alert("Could not fetch pending hours for review");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId, pendingHourId) => {
    setProcessingAction(`approve-${userId}-${pendingHourId}`);
    try {
      await axios.put(
        `${backendUrl}/api/user/approve-hours/${userId}/${pendingHourId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPendingHours(); // Refresh data
      alert("Hours approved successfully!");
    } catch (error) {
      console.error("Error approving hours:", error);
      alert("Could not approve hours");
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async (userId, pendingHourId) => {
    setProcessingAction(`reject-${userId}-${pendingHourId}`);
    try {
      await axios.put(
        `${backendUrl}/api/user/reject-hours/${userId}/${pendingHourId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchPendingHours(); // Refresh data
      alert("Hours rejected");
    } catch (error) {
      console.error("Error rejecting hours:", error);
      alert("Could not reject hours");
    } finally {
      setProcessingAction(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
        <span className="ml-2">Loading pending hours...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Pending Volunteer Hours</h2>

      {pendingUsers.length === 0 ? (
        <div className="bg-gray-50 p-6 rounded-lg text-center">
          <p className="text-gray-600">No pending hours to review.</p>
        </div>
      ) : (
        pendingUsers.map((user) => (
          <div
            key={user._id}
            className="mb-8 bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold">{user.name}</h3>
            <p className="text-gray-600">{user.email}</p>

            <div className="mt-4">
              <h4 className="font-medium text-sm uppercase text-gray-500 mb-2">
                Pending Hours
              </h4>

              <div className="divide-y">
                {user.pendingHours
                  .filter((entry) => entry.status === "pending")
                  .map((entry) => (
                    <div
                      key={entry._id}
                      className="py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {entry.event?.title || "Event"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {entry.hours} hours on{" "}
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleApprove(user._id, entry._id)}
                          disabled={
                            processingAction ===
                            `approve-${user._id}-${entry._id}`
                          }
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
                        >
                          {processingAction ===
                          `approve-${user._id}-${entry._id}` ? (
                            <FaSpinner className="animate-spin mr-1" />
                          ) : (
                            <FaCheck className="mr-1" />
                          )}
                          Approve
                        </button>

                        <button
                          onClick={() => handleReject(user._id, entry._id)}
                          disabled={
                            processingAction ===
                            `reject-${user._id}-${entry._id}`
                          }
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center"
                        >
                          {processingAction ===
                          `reject-${user._id}-${entry._id}` ? (
                            <FaSpinner className="animate-spin mr-1" />
                          ) : (
                            <FaTimes className="mr-1" />
                          )}
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminPendingHours;
