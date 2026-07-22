"use client";
import React from "react";
import Link from "next/link";
import { FaGithub, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/60 text-zinc-600 dark:text-zinc-400 py-12 text-xs">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pb-10 border-b border-zinc-200 dark:border-zinc-800/60">
          
          {/* Brand Column */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2 group text-zinc-900 dark:text-white font-semibold text-base tracking-tight">
              <div className="w-7 h-7 rounded-md bg-emerald-600 dark:bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                H
              </div>
              <span>HandsOn</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40">
                v2.0
              </span>
            </Link>

            <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed max-w-sm">
              A high-impact community platform matching neighborhood volunteer needs with active, dedicated local change makers.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a 
                href="https://github.com/niloydiu/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                aria-label="GitHub"
              >
                <FaGithub size={14} />
              </a>
              <a 
                href="https://www.linkedin.com/in/niloykumarmohonta000/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={14} />
              </a>
              <a 
                href="#" 
                className="w-8 h-8 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
                aria-label="Twitter / X"
              >
                <FaXTwitter size={14} />
              </a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-xs uppercase tracking-wider">Platform</h4>
              <ul className="space-y-2">
                {[
                  { name: "Feed & Events", href: "/events" },
                  { name: "Browse Teams", href: "/teams" },
                  { name: "Mutual Aid", href: "/community-help" },
                  { name: "Support Hub", href: "/support" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-xs uppercase tracking-wider">Account</h4>
              <ul className="space-y-2">
                {[
                  { name: "Sign In", href: "/login" },
                  { name: "Create Account", href: "/signup" },
                  { name: "Dashboard", href: "/dashboard" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-3 text-xs uppercase tracking-wider">Community</h4>
              <ul className="space-y-2">
                <li>
                  <a href="https://github.com/niloydiu/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Open Source
                  </a>
                </li>
                <li>
                  <a href="https://niloykm.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-zinc-900 dark:hover:text-white transition-colors">
                    Developer Portfolio
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-zinc-500">
          <div className="flex items-center gap-2">
            <span>© {currentYear} HandsOn Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              Platform Operational
            </span>
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-zinc-900 dark:hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
