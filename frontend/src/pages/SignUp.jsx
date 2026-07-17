import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { motion } from "framer-motion";
import { HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from "react-icons/hi";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

const SignUp = () => {
  const { backendUrl, setToken } = useContext(Appcontext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/register`, formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        toast.success("Account created! Let's get started.");
        navigate("/");
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
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-2xl shadow-slate-200/50 border border-white">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Join Movement</h2>
            <p className="text-slate-500 font-medium">Create an account to start contributing</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Creating Account..." : (
                <>Sign Up <HiOutlineArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <p className="text-slate-500 font-medium mb-4">Already have an account?</p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm text-slate-900 hover:bg-slate-50 hover:border-slate-200 transition-all"
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
