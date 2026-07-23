"use client";
import React, { useContext, useState, useEffect } from "react";
import { Appcontext } from "../../context/Appcontext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  User as UserIcon, Mail, ShieldCheck, Star, Zap, Award, 
  Calendar, Clock, Users, Heart, LogOut, CheckCircle2, 
  Edit3, ArrowRight, Activity
} from "lucide-react";
import PageWrapper from "../../components/PageWrapper";

export default function ProfilePage() {
  const { userData, token, logout, loadUserProfileData } = useContext(Appcontext) || {};
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "skills" | "activity">("overview");

  useEffect(() => {
    setMounted(true);
    if (token && loadUserProfileData) {
      loadUserProfileData();
    }
  }, [token]);

  if (!mounted) return null;

  if (!token) {
    return (
      <PageWrapper>
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
          <div className="w-full max-w-sm card-saas !p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <UserIcon size={24} />
            </div>
            <h2 className="text-lg font-bold tracking-tight mb-2 text-zinc-900 dark:text-white">Authentication Required</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Please sign in to access your volunteer profile, badges, and activity history.
            </p>
            <div className="space-y-2">
              <Link href="/login" className="btn-saas btn-primary w-full text-xs justify-center">
                Sign In
              </Link>
              <Link href="/signup" className="btn-saas btn-secondary w-full text-xs justify-center">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  const user = userData || {
    name: "Volunteer Member",
    email: "volunteer@handson.org",
    verificationLevel: "Tier 3 Verified",
    avgRating: 4.9,
    reviewCount: 28,
    streak: 12,
    volunteerHours: 84,
    points: 1250,
    skills: ["Event Organization", "Community Outreach", "First Aid", "Disaster Relief"],
    causes: ["Environment", "Youth Education", "Food Security"],
    createdAt: "2024-01-15"
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* User Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-saas !p-6 relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-bold text-xl flex items-center justify-center shadow-md ring-4 ring-emerald-500/10">
                  {user.name ? user.name.charAt(0).toUpperCase() : "V"}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-xl font-bold text-zinc-900 dark:text-white tracking-tight">{user.name}</h1>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      <ShieldCheck size={12} />
                      {user.verificationLevel || "Verified Volunteer"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
                    <Mail size={12} />
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full md:w-auto">
                <button
                  onClick={() => {
                    if (logout) logout();
                    router.push("/login");
                  }}
                  className="btn-saas btn-secondary text-xs flex-1 md:flex-initial justify-center text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 border-red-200 dark:border-red-900/40"
                >
                  <LogOut size={14} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card-saas !p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Volunteer Hours</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{user.volunteerHours || 84} hrs</p>
              </div>
            </div>

            <div className="card-saas !p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Zap size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Impact Points</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{user.points || 1250} pts</p>
              </div>
            </div>

            <div className="card-saas !p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Active Streak</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{user.streak || 12} days</p>
              </div>
            </div>

            <div className="card-saas !p-4 flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Star size={18} />
              </div>
              <div>
                <p className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">Rating</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-white">{user.avgRating || 4.9} ★</p>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card-saas !p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Award size={16} className="text-emerald-500" />
                <span>Verification Badges</span>
              </h3>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-zinc-100/50 dark:bg-zinc-900">
                  <span className="text-zinc-600 dark:text-zinc-400">Phone Verified</span>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-zinc-100/50 dark:bg-zinc-900">
                  <span className="text-zinc-600 dark:text-zinc-400">Email Verified</span>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-zinc-100/50 dark:bg-zinc-900">
                  <span className="text-zinc-600 dark:text-zinc-400">ID Credentials</span>
                  <CheckCircle2 size={14} className="text-emerald-500" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 card-saas !p-6 space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-white flex items-center gap-2">
                <Heart size={16} className="text-emerald-500" />
                <span>Skills & Supported Causes</span>
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-1.5">Verified Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(user.skills || ["Event Organization", "Community Outreach", "First Aid"]).map((skill: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-zinc-500 dark:text-zinc-400 font-medium mb-1.5">Primary Causes</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(user.causes || ["Environment", "Youth Education", "Food Security"]).map((cause: string, i: number) => (
                      <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-500/20">
                        {cause}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
