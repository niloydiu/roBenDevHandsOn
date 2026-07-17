import axios from "axios";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Appcontext } from "../context/Appcontext";
import { motion } from "framer-motion";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineArrowRight } from "react-icons/hi";
import { toast } from "react-toastify";
import PageWrapper from "../components/PageWrapper";

const Login = () => {
  const { backendUrl, setToken } = useContext(Appcontext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${backendUrl}/api/user/login`, formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        toast.success("Welcome back!");
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-slate-50">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl"
      >
        <div className="bg-white rounded-[48px] p-8 md:p-16 shadow-2xl shadow-slate-200/50 border border-white">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 font-medium">Log in to continue your impact journey</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="#" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:text-blue-700">Forgot?</Link>
              </div>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-none rounded-3xl focus:ring-2 focus:ring-blue-500 font-bold text-slate-900 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? "Authenticating..." : (
                <>Sign In <HiOutlineArrowRight size={20} /></>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium mb-4">Don't have an account yet?</p>
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white border-2 border-slate-100 rounded-2xl font-black text-sm text-slate-900 hover:bg-slate-50 hover:border-slate-200 transition-all"
            >
              Create Account
            </Link>
          </div>
        </div>
      </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Login;
