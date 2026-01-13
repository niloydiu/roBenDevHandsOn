import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { motion } from "framer-motion";
import { 
  HiOutlineClipboardCheck, 
  HiOutlineCalendar, 
  HiOutlineLocationMarker, 
  HiOutlineTag, 
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlinePencilAlt
} from "react-icons/hi";
import { toast } from "react-toastify";

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, backendUrl, fetchAllEvents } = useContext(Appcontext);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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
    organizer: "",
  });

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/event/${id}`);
        const ev = response.data.event || response.data;

        let formattedDate = "";
        if (ev.date) {
          const d = new Date(ev.date);
          if (!isNaN(d.getTime())) formattedDate = d.toISOString().split("T")[0];
        }

        setFormData({
          title: ev.title || "",
          description: ev.description || "",
          category: ev.category || "",
          date: formattedDate,
          startTime: ev.startTime || "",
          endTime: ev.endTime || "",
          location: ev.location || "",
          maxParticipants: ev.maxParticipants?.toString() || "50",
          requirements: ev.requirements || "",
          organizer: ev.organizer || "",
        });
      } catch (err) {
        toast.error("Failed to load event details");
        navigate("/events");
      } finally {
        setLoading(false);
      }
    };

    if (id && backendUrl && token) fetchEventData();
  }, [id, backendUrl, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`${backendUrl}/api/event/${id}`, {
        ...formData,
        maxParticipants: Number(formData.maxParticipants)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Event updated successfully!");
      fetchAllEvents();
      navigate(`/events/${id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["Environmental", "Education", "Hunger Relief", "Community Support", "Healthcare", "Animal Welfare", "Crisis Response", "Arts & Culture", "Other"];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-100 pt-10 pb-12 mb-12">
        <div className="container mx-auto px-4 lg:px-20">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8 group"
          >
            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Details
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">Edit Event</h1>
              <p className="text-slate-500 font-medium italic">Refine the details and keep your volunteers informed</p>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-blue-600 bg-blue-50 px-6 py-4 rounded-3xl border border-blue-100">
              <HiOutlinePencilAlt size={24} />
              <span className="font-bold text-sm">Update mode active</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-20">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-100">
                <h3 className="flex items-center gap-3 text-xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-50">
                  <HiOutlineClipboardCheck className="text-blue-600" size={24} />
                  Main Details
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Event Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="6"
                      required
                      className="w-full px-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Category</label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                          className={`px-4 py-3 rounded-2xl text-[10px] font-black tracking-wider transition-all border-2 uppercase ${formData.category === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-500 border-transparent hover:border-slate-200'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-100">
                <h3 className="flex items-center gap-3 text-xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-50">
                  <HiOutlineLocationMarker className="text-blue-600" size={24} />
                  Logistics & Location
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Max Capacity</label>
                      <input
                        type="number"
                        name="maxParticipants"
                        value={formData.maxParticipants}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Start Time</label>
                      <input
                        type="time"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                        required
                        className="w-full px-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">End Time</label>
                      <input
                        type="time"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full px-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Full Address</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                    />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[40px] p-8 text-white sticky top-32">
                <h3 className="text-xl font-bold mb-6">Save Changes</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Volunteers already signed up will be notified of major changes if you choose to broadcast them.
                </p>
                <div className="space-y-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black text-lg transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20"
                  >
                    {submitting ? (
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Update Event</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/events/${id}`)}
                    className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-[24px] font-bold text-lg transition-all"
                  >
                    Discard Edits
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditEvent;
