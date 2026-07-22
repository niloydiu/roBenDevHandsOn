"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useInView, animate } from "framer-motion";
import CommunityRequests from "../components/home/CommunityRequests";
import FeaturedEvents from "../components/home/FeaturedEvents";
import HeroSection from "../components/home/HeroSection";
import { ArrowRight, Calendar, Heart, Users, Sparkles, ShieldCheck } from "lucide-react";
import PageWrapper from "../components/PageWrapper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  useEffect(() => {
    if (!isInView || !ref.current) return;
    const numMatch = value.match(/[\d,.]+/);
    if (!numMatch) return;
    
    const numeric = parseFloat(numMatch[0].replace(/,/g, ''));
    const suffix = value.replace(/[\d,.]+/, '');

    const controls = animate(0, numeric, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (ref.current) {
          const valStr = Math.floor(latest).toLocaleString();
          ref.current.textContent = valStr + suffix;
        }
      }
    });

    return () => controls.stop();
  }, [isInView, value]);

  return (
    <div className="text-center p-4 rounded-xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xs">
      <div ref={ref} className="text-2xl md:text-3xl font-semibold text-zinc-900 dark:text-white tracking-tight mb-0.5">
        {value}
      </div>
      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

export default function Home() {
  const statsRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (statsRef.current) {
        gsap.fromTo(
          statsRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: statsRef.current,
              start: "top 85%",
            }
          }
        );
      }

      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.98 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 85%",
            }
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <PageWrapper>
      <div className="space-y-0 text-zinc-900 dark:text-zinc-100">
        
        {/* Hero Section */}
        <HeroSection />

        {/* Community Stats Band */}
        <section ref={statsRef} className="py-10 bg-zinc-50/60 dark:bg-zinc-950/40 border-b border-zinc-200/70 dark:border-zinc-800/80">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "Active Volunteers", val: "2,400+" },
                { label: "Hours Donated", val: "15,000+" },
                { label: "Impact Projects", val: "450+" },
                { label: "Lives Touched", val: "10,000+" },
              ].map((stat, i) => (
                <StatCounter key={i} value={stat.val} label={stat.label} />
              ))}
            </div>
          </div>
        </section>

        {/* Upcoming Opportunities */}
        <section ref={eventsRef} className="py-14 bg-white dark:bg-zinc-950 border-b border-zinc-200/70 dark:border-zinc-800/80 relative overflow-hidden">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
              <div className="max-w-xl space-y-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/40 text-xs font-medium">
                  <Calendar size={13} />
                  <span>Upcoming Opportunities</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight">
                  Make an impact in your <span className="text-emerald-600 dark:text-emerald-400">Neighborhood</span>.
                </h2>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                <span>See all events</span>
                <ArrowRight size={14} />
              </Link>
            </div>
            <FeaturedEvents />
          </div>
        </section>

        {/* Community Help / Direct Mutual Aid */}
        <section className="py-14 bg-zinc-50/50 dark:bg-zinc-900/20 border-b border-zinc-200/70 dark:border-zinc-800/80">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/40 text-xs font-medium">
                  <Heart size={13} />
                  <span>Direct Mutual Aid</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white tracking-tight leading-tight">
                  Hearts needing a <span className="text-emerald-600 dark:text-emerald-400">Helping Hand</span>.
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-xs md:text-sm leading-relaxed max-w-md">
                  Real people, real local needs. From quick errands to tutoring or companionship, small actions build stronger communities.
                </p>
                <div className="pt-2">
                  <Link
                    href="/community-help"
                    className="btn-saas btn-primary shadow-xs"
                  >
                    <span>Post a Request</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
              <div className="lg:col-span-7" id="help-requests">
                <CommunityRequests />
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 bg-white dark:bg-zinc-950">
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <div ref={ctaRef} className="card-saas !p-8 md:!p-12 relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white dark:from-zinc-900 dark:to-zinc-950 border border-zinc-800 shadow-md">
              <div className="max-w-2xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-medium">
                  <Sparkles size={13} />
                  <span>Get Started Today</span>
                </div>

                <h2 className="text-2xl md:text-4xl font-bold tracking-tight leading-tight">
                  Ready to build a stronger community?
                </h2>

                <p className="text-zinc-300 text-xs md:text-sm leading-relaxed max-w-lg">
                  Join our network of Change Makers. Whether you lead a local team or donate an hour a week, every contribution shapes a better future.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    href="/signup"
                    className="btn-saas btn-primary !bg-emerald-500 hover:!bg-emerald-400 text-zinc-950 font-semibold"
                  >
                    <span>Create Free Account</span>
                    <ArrowRight size={14} />
                  </Link>
                  <Link
                    href="/teams"
                    className="btn-saas text-white border border-zinc-700 hover:bg-zinc-800"
                  >
                    <span>Browse Teams</span>
                  </Link>
                </div>
              </div>

              {/* Decorative Icon Graphic */}
              <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 w-32 h-32 rounded-xl bg-zinc-800/50 border border-zinc-700/60 items-center justify-center text-zinc-500 pointer-events-none">
                <Users size={56} className="text-emerald-500/60" />
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageWrapper>
  );
}
