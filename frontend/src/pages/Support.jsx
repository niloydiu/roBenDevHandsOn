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
          className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <FaHeart size={30} className="animate-pulse" />
            </div>
          </div>

          <h2 className="text-2xl font-black text-slate-800 dark:text-white text-center mb-2">Support Our Community</h2>
          <p className="text-slate-500 dark:text-slate-400 text-center text-sm mb-8">Donate to fund volunteer logistics or help requests. Earn 100 points as a community contributor badge!</p>

          {/* Quick-toggle selector buttons */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {[10, 25, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(String(val))}
                className={`py-3 rounded-xl text-xs font-black transition-all cursor-pointer border ${
                  amount === String(val)
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700/50 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                ${val}
              </button>
            ))}
          </div>

          <form onSubmit={handleDonate} className="space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">Donation Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400">$</span>
                <input
                  type="number"
                  placeholder="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-8 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 focus:border-emerald-650 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-white font-bold transition-all focus:outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-lg shadow-emerald-500/20 dark:shadow-none active:scale-95 disabled:opacity-50 cursor-pointer"
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
