"use client";
import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { Heart, CreditCard, ChevronRight, Sparkles, ShieldCheck } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { Appcontext } from "../../context/Appcontext";
import PageWrapper from "../../components/PageWrapper";

const Support = () => {
  const { token, backendUrl } = useContext(Appcontext);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      return toast.error("Please enter a valid amount");
    }

    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const res = await axios.post(`${backendUrl}/api/payment/create-session`, {
        amount: Number(amount),
        successUrl: window.location.origin + "/profile",
        cancelUrl: window.location.href,
      }, config);

      if (res.data.success) {
        toast.info("Redirecting to Stripe checkout...");
        
        setTimeout(async () => {
          const verifyRes = await axios.post(`${backendUrl}/api/payment/verify`, {
            sessionId: res.data.sessionId
          }, config);

          if (verifyRes.data.success) {
            toast.success("Payment completed! 100 bonus volunteer points awarded!");
            window.location.href = res.data.url;
          }
        }, 1200);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
        <motion.div 
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md card-saas !p-6 shadow-sm"
        >
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3 border border-emerald-200/50 dark:border-emerald-800/40">
              <Heart size={20} className="fill-emerald-600 dark:fill-emerald-400" />
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Support Our Platform</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5 max-w-xs mx-auto">
              Fund local volunteer initiatives & logistics. Earn 100 points as a verified community backer.
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            {[10, 25, 50, 100].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setAmount(String(val))}
                className={`btn-saas text-xs !h-9 justify-center ${
                  amount === String(val)
                    ? "btn-primary"
                    : "btn-secondary"
                }`}
              >
                ${val}
              </button>
            ))}
          </div>

          <form onSubmit={handleDonate} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Donation Amount (USD)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-semibold text-xs">$</span>
                <input
                  type="number"
                  placeholder="50"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-saas pl-7 text-xs"
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-saas btn-primary w-full text-xs"
            >
              <CreditCard size={14} />
              <span>{loading ? "Processing Payment..." : "Donate via Stripe"}</span>
              <ChevronRight size={14} />
            </button>
          </form>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center text-[11px] text-zinc-400 flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} className="text-emerald-500" />
            <span>Secure SSL Encrypted Platform Transaction</span>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Support;
