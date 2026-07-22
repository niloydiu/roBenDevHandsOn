"use client";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { Appcontext } from "../context/Appcontext";
import { ArrowLeft, CheckCircle2, Globe, Shield, Camera } from "lucide-react";
import { toast } from "react-toastify";

const TeamEdit = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token, backendUrl } = useContext(Appcontext) as any;
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [teamData, setTeamData] = useState({
    name: "",
    description: "",
    cause: "",
    isPublic: true,
    avatar: "",
  });

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/team/${id}`);
        setTeamData({
          name: response.data.name || "",
          description: response.data.description || "",
          cause: response.data.cause || "",
          isPublic: response.data.isPublic !== false,
          avatar: response.data.avatar || "",
        });
      } catch (err) {
        toast.error("Failed to load team details");
        router.push("/teams");
      } finally {
        setLoading(false);
      }
    };

    if (id && backendUrl && token) fetchTeamData();
    else if (!token) router.push("/login");
  }, [id, backendUrl, token, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setTeamData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.put(`${backendUrl}/api/team/${id}`, teamData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Team settings saved");
      router.push(`/teams/${id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <Link 
          href={`/teams/${id}`} 
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors text-[13px] font-medium"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Team Settings</h1>
          <p className="text-[14px] text-gray-500">Manage your team's profile and visibility.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex items-start gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-gray-50 rounded-md border border-gray-200 flex items-center justify-center overflow-hidden">
                {teamData.avatar ? (
                  <img src={teamData.avatar} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={20} className="text-gray-400" />
                )}
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              <label className="text-[12px] font-medium text-gray-600">Avatar URL</label>
              <input
                type="text"
                name="avatar"
                value={teamData.avatar}
                onChange={handleInputChange}
                className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-gray-300"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-600">Name</label>
              <input
                type="text"
                name="name"
                value={teamData.name}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-gray-300"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[12px] font-medium text-gray-600">Cause</label>
              <select
                name="cause"
                value={teamData.cause}
                onChange={handleInputChange}
                required
                className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-gray-300 appearance-none"
              >
                <option value="Environment">Environment</option>
                <option value="Education">Education</option>
                <option value="Food">Food</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Animals">Animals</option>
                <option value="Elderly">Elderly</option>
                <option value="Development">Development</option>
                <option value="Community">Community</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-600">Visibility</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTeamData(prev => ({ ...prev, isPublic: true }))}
                className={`flex items-start gap-3 p-4 rounded-md border transition-all text-left ${teamData.isPublic ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Globe size={16} className={`mt-0.5 ${teamData.isPublic ? 'text-gray-900' : 'text-gray-400'}`} />
                <div>
                  <div className={`font-medium text-[13px] ${teamData.isPublic ? 'text-gray-900' : 'text-gray-700'}`}>Public</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">Visible to everyone</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTeamData(prev => ({ ...prev, isPublic: false }))}
                className={`flex items-start gap-3 p-4 rounded-md border transition-all text-left ${!teamData.isPublic ? 'border-gray-900 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
              >
                <Shield size={16} className={`mt-0.5 ${!teamData.isPublic ? 'text-gray-900' : 'text-gray-400'}`} />
                <div>
                  <div className={`font-medium text-[13px] ${!teamData.isPublic ? 'text-gray-900' : 'text-gray-700'}`}>Private</div>
                  <div className="text-[12px] text-gray-500 mt-0.5">Invite only</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[12px] font-medium text-gray-600">Description</label>
            <textarea
              name="description"
              value={teamData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-white border border-gray-200 rounded-md px-3 py-2 text-[14px] focus:outline-none focus:ring-1 focus:ring-gray-300 resize-none"
              required
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="h-9 px-4 bg-black text-white rounded-md text-[13px] font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>Save changes</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamEdit;
