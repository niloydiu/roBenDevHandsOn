import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaHeart, FaChevronRight, FaCreditCard } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";

const Support = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e) => {
    e.preventDefault();
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Create mockup checkout session
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://ro-ben-dev-hands-on.vercel.app";
      const res = await axios.post(`${backendUrl}/api/payment/create-session`, {
        amount: Number(amount),
        successUrl: window.location.origin + "/profile",
        cancelUrl: window.location.href,
      }, config);

      if (res.data.success) {
        toast.info("Redirecting to dummy Stripe checkout...");
        
        // Simulating the checkout delay
        setTimeout(async () => {
          // Auto-verify mock payment
          const verifyRes = await axios.post(`${backendUrl}/api/payment/verify`, {
            sessionId: res.data.sessionId
          }, config);

          if (verifyRes.data.success) {
            toast.success("Payment completed! 100 bonus volunteer points awarded!");
            window.location.href = res.data.url;
          }
        }, 1500);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto my-12 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <FaHeart size={30} className="animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 text-center mb-2">Support Our Community</h2>
          <p className="text-slate-500 text-center text-sm mb-8">Donate to fund volunteer logistics or help requests. Earn 100 points as a community contributor badge!</p>

          <form onSubmit={handleDonate} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Donation Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                <input
                  type="number"
                  placeholder="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:border-blue-600 focus:bg-white text-slate-800 font-bold transition-all focus:outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
            >
              <FaCreditCard size={16} />
              <span>{loading ? "Processing..." : "Pay with Stripe"}</span>
              <FaChevronRight size={10} />
            </button>
          </form>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Support;
