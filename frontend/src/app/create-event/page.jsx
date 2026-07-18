"use client";
import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Appcontext } from "../../context/Appcontext";
import { motion } from "framer-motion";
import { 
  HiOutlineClipboardCheck, 
  HiOutlineCalendar, 
  HiOutlineLocationMarker, 
  HiOutlineTag, 
  HiOutlineUserGroup,
  HiOutlineArrowLeft,
  HiOutlineSparkles
} from "react-icons/hi";
import { toast } from "react-toastify";
import PageWrapper from "../../components/PageWrapper";

function CreateEvent() {
  const router = useRouter();
  const { isLoggedIn, token, fetchAllEvents, backendUrl } = useContext(Appcontext);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    maxParticipants: "50",
    requirements: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      toast.info("Please login to create an event");
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.description) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.location) newErrors.location = "Location is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the highlighted errors");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${backendUrl}/api/event/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Event created successfully!");
        fetchAllEvents();
        router.push("/events");
      } else {
        toast.error(data.message || "Failed to create event");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const categories = ["Environmental", "Education", "Hunger Relief", "Community Support", "Healthcare", "Animal Welfare", "Crisis Response", "Arts & Culture", "Other"];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-slate-50/50 pb-20">
        <div className="bg-white border-b border-slate-100 pt-10 pb-12 mb-12">
        <div className="container mx-auto px-4 lg:px-20">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 font-bold hover:text-blue-600 transition-colors mb-8 group"
          >
            <HiOutlineArrowLeft className="group-hover:-translate-x-1 transition-transform" />
            Back to Events
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl font-black text-slate-900 mb-2">Create an Event</h1>
              <p className="text-slate-500 font-medium italic">Empower your community through shared action</p>
            </div>
            <div className="hidden lg:flex items-center gap-4 text-blue-600 bg-blue-50 px-6 py-4 rounded-3xl border border-blue-100">
              <HiOutlineSparkles size={24} />
              <span className="font-bold text-sm">Join 500+ other organizers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 lg:px-20">
        <form onSubmit={handleSubmit} className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Fields */}
            <div className="lg:col-span-2 space-y-8">
              <section className="bg-white rounded-[40px] p-8 lg:p-10 shadow-sm border border-slate-100">
                <h3 className="flex items-center gap-3 text-xl font-black text-slate-900 mb-8 pb-4 border-b border-slate-50">
                  <HiOutlineClipboardCheck className="text-blue-600" size={24} />
                  Basic Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Event Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Beach Cleanup Drive 2024"
                      className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.title ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
                    />
                    {errors.title && <p className="text-red-500 text-xs font-bold mt-2 px-4 italic">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="6"
                      placeholder="Tell volunteers about the impact they will make..."
                      className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300 resize-none ${errors.description ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
                    />
                    {errors.description && <p className="text-red-500 text-xs font-bold mt-2 px-4 italic">{errors.description}</p>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Category</label>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, category: cat }))}
                          className={`px-4 py-3 rounded-2xl text-xs font-black transition-all border-2 ${formData.category === cat ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-500 border-transparent hover:border-slate-200'}`}
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
                  Logistics & Place
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Event Date</label>
                      <div className="relative">
                        <HiOutlineCalendar className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Max Participants</label>
                      <div className="relative">
                        <HiOutlineUserGroup className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                          type="number"
                          name="maxParticipants"
                          value={formData.maxParticipants}
                          onChange={handleChange}
                          className="w-full pl-14 pr-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                        />
                      </div>
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
                        className="w-full px-6 py-4 bg-slate-50 border-transparent border-2 focus:border-blue-500 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">End Time (Optional)</label>
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
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 px-2">Location Address</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Street address, City, Country"
                      className={`w-full px-6 py-4 bg-slate-50 border-2 rounded-[24px] focus:ring-4 focus:ring-blue-500/10 transition-all font-bold text-slate-700 placeholder:text-slate-300 ${errors.location ? 'border-red-400' : 'border-transparent focus:border-blue-500'}`}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Sidebar / CTA */}
            <div className="space-y-8">
              <div className="bg-slate-900 rounded-[40px] p-8 text-white sticky top-32">
                <h3 className="text-xl font-bold mb-6">Create & Launch</h3>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed">
                  Once created, your event will be visible to all volunteers in the community. You can always edit details later.
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
                      <>Verify & Post Event</>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/events")}
                    className="w-full py-5 bg-white/5 hover:bg-white/10 text-white rounded-[24px] font-bold text-lg transition-all"
                  >
                    Cancel
                  </button>
                </div>

                <div className="mt-10 pt-10 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <HiOutlineTag />
                    <span>Free listing for non-profits</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-400">
                    <HiOutlineArrowLeft />
                    <span>Real-time dashboard updates</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
      </div>
    </PageWrapper>
  );
}

export default CreateEvent;
