"use client";
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Appcontext } from "../../context/Appcontext";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Sparkles } from "lucide-react";
import { FaGithub, FaGoogle } from "react-icons/fa6";
import { toast } from "react-toastify";
import PageWrapper from "../../components/PageWrapper";

const Login = () => {
  const { backendUrl, setToken } = useContext(Appcontext);
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const triggerMockLogin = async (provider: string) => {
    setLoading(true);
    try {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify({
        email: `${provider.toLowerCase()}.volunteer@handson.org`,
        name: `${provider} Volunteer`,
        sub: `${provider.toLowerCase()}-volunteer-id-12345`
      }));
      const mockJwt = `${header}.${payload}.mocksignature`;

      localStorage.setItem("token", mockJwt);
      setToken(mockJwt);
      toast.success(`Signed in successfully with ${provider}!`);
      router.push("/");
    } catch (err) {
      toast.error(`${provider} authentication failed`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const payload = btoa(JSON.stringify({
        email: formData.email,
        name: formData.email.split("@")[0],
        sub: "user-id-12345"
      }));
      const mockJwt = `${header}.${payload}.mocksignature`;

      localStorage.setItem("token", mockJwt);
      setToken(mockJwt);
      toast.success("Welcome back!");
      router.push("/");
    } catch (error: any) {
      toast.error("Login failed");
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
          className="w-full max-w-sm card-saas !p-6 shadow-sm"
        >
          <div className="text-center mb-6">
            <div className="w-9 h-9 rounded-md bg-emerald-600 dark:bg-emerald-500 text-white font-bold flex items-center justify-center mx-auto mb-3 text-base shadow-xs">
              H
            </div>
            <h2 className="text-lg font-bold text-zinc-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">Sign in to your HandsOn volunteer account</p>
          </div>

          <form className="space-y-3.5" onSubmit={handleSubmit}>
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="input-saas pl-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <label className="font-medium text-zinc-700 dark:text-zinc-300">Password</label>
                <Link href="#" className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="input-saas pl-8 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-saas btn-primary w-full text-xs"
            >
              {loading ? "Authenticating..." : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="my-4 flex items-center">
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
            <span className="mx-2 text-zinc-400 text-[10px] uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-zinc-200 dark:border-zinc-800"></div>
          </div>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button 
              onClick={() => triggerMockLogin("Google")}
              className="btn-saas btn-secondary text-xs"
            >
              <FaGoogle size={13} />
              <span>Google</span>
            </button>
            <button 
              onClick={() => triggerMockLogin("GitHub")}
              className="btn-saas btn-secondary text-xs"
            >
              <FaGithub size={13} />
              <span>GitHub</span>
            </button>
          </div>

          <div className="text-center text-xs pt-1">
            <p className="text-zinc-500 dark:text-zinc-400">
              Don't have an account?{" "}
              <Link href="/signup" className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Login;
