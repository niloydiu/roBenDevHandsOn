"use client";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Appcontext } from "../../context/Appcontext";
import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from "react-icons/hi";
import { FaGoogle, FaGithub } from "react-icons/fa";
import { toast } from "react-toastify";
import PageWrapper from "../../components/PageWrapper";

const SignUp = () => {
  const { backendUrl, setToken } = useContext(Appcontext);
  const router = useRouter();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerMockLogin = async (provider) => {
    setLoading(true);
    try {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify({
        email: `${provider.toLowerCase()}.volunteer@handson.org`,
        name: `${provider} Volunteer`,
        sub: `${provider.toLowerCase()}-volunteer-id-12345`
      }));
      const mockJwt = `${header}.${payload}.mocksignature`;
      
      const res = await axios.post(`${backendUrl}/api/user/google`, {
        token: mockJwt
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        toast.success(`Account created with ${provider}!`);
        router.push("/");
      }
    } catch (err) {
      toast.error(`${provider} Sign-Up failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (response) => {
    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/user/google`, {
        token: response.credential
      });
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        setToken(res.data.token);
        toast.success("Welcome with Google!");
        router.push("/");
      }
    } catch (err) {
      toast.error("Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: "870634676451-dummyid.apps.googleusercontent.com",
        callback: handleGoogleLogin,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("google-signup-btn"),
        { theme: "outline", size: "large", width: "350" }
      );
    }
  }, [backendUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        toast.success("Account created! Let's get started.");
        router.push("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-100 dark:bg-blue-900/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-indigo-100 dark:bg-indigo-900/10 rounded-full blur-3xl opacity-50" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-xl"
        >
          <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 md:p-12 shadow-2xl border border-white dark:border-slate-800/40">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Create Account</h2>
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Join the HandsOn community of Change Makers</p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <HiOutlineUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <HiOutlineMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 dark:text-slate-555 uppercase tracking-widest ml-1">Password</label>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? "Creating Account..." : (
                  <>Get Started <HiOutlineArrowRight size={18} /></>
                )}
              </button>
            </form>

            <div className="relative flex py-4 items-center">
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800/40"></div>
              <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-555 text-xs font-black uppercase tracking-widest">Or</span>
              <div className="flex-grow border-t border-slate-100 dark:border-slate-800/40"></div>
            </div>

            {/* One-Click Fast Auth Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => triggerMockLogin("Google")}
                className="py-4 px-6 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700/50 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <FaGoogle className="text-red-500" size={16} /> Google
              </button>
              <button 
                onClick={() => triggerMockLogin("GitHub")}
                className="py-4 px-6 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-100 dark:border-slate-700/50 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <FaGithub className="text-slate-900 dark:text-white" size={16} /> GitHub
              </button>
            </div>

            <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-800/40 pt-6">
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm mb-4">Already have an account?</p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800/40 rounded-2xl font-black text-xs text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-850 hover:border-slate-200 transition-all uppercase tracking-wider"
              >
                Sign In Instead
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default SignUp;
