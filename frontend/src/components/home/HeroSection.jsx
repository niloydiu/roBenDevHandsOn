"use client";
import React, { useContext, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Appcontext } from "../../context/Appcontext";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { ArrowRight, Globe, Users, Clock, ShieldCheck, Sparkles } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function CounterNumber({ value, suffix = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (!isInView || !ref.current) return;
    const numericVal = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(numericVal)) {
      ref.current.textContent = value + suffix;
      return;
    }

    const controls = animate(0, numericVal, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        if (ref.current) {
          if (numericVal % 1 !== 0) {
            ref.current.textContent = latest.toFixed(1) + suffix;
          } else if (numericVal >= 1000) {
            ref.current.textContent = (latest / 1000).toFixed(1) + "k" + suffix;
          } else {
            ref.current.textContent = Math.floor(latest) + suffix;
          }
        }
      }
    });

    return () => controls.stop();
  }, [isInView, value, suffix]);

  return <span ref={ref}>{value}{suffix}</span>;
}

const HeroSection = () => {
  const { isLoggedIn } = useContext(Appcontext);
  const router = useRouter();
  const heroRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;
    
    const ctx = gsap.context(() => {
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 12,
          ease: "none",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true
          }
        });
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const navigateToHelpRequests = () => {
    router.push("/community-help");
    setTimeout(() => {
      const element = document.getElementById("help-requests");
      if (element) element.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <section ref={heroRef} className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-zinc-200/70 dark:border-zinc-800/80 bg-zinc-50/40 dark:bg-zinc-950/20">
      
      {/* Subtle Ambient Grid Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none -z-10" />

      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Main Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40 text-xs font-semibold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600 dark:bg-emerald-400"></span>
                </span>
                <span>Connecting 2,400+ Neighborhood Volunteers</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-bold tracking-tight text-zinc-900 dark:text-white leading-[1.12]">
                Lend a <span className="text-emerald-600 dark:text-emerald-400">Hand</span>,<br className="hidden sm:inline" />
                Shape a <span className="text-emerald-600 dark:text-emerald-400">Future</span>.
              </h1>

              {/* Subtitle */}
              <p className="text-zinc-600 dark:text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl">
                Connect with hyper-local opportunities, organize volunteer teams, and track your social impact in real time with zero platform fees.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {isLoggedIn ? (
                  <button
                    onClick={navigateToHelpRequests}
                    className="btn-saas btn-primary shadow-xs"
                  >
                    <span>Explore Requests</span>
                    <ArrowRight size={15} />
                  </button>
                ) : (
                  <Link
                    href="/signup"
                    className="btn-saas btn-primary shadow-xs"
                  >
                    <span>Start Volunteering</span>
                    <ArrowRight size={15} />
                  </Link>
                )}
                <Link
                  href="/events"
                  className="btn-saas btn-secondary"
                >
                  Browse Opportunities
                </Link>
              </div>

              {/* Stats Band Row */}
              <div className="grid grid-cols-3 gap-4 pt-8 mt-8 border-t border-zinc-200/80 dark:border-zinc-800/80 max-w-lg">
                <div>
                  <div className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                    <CounterNumber value="1.2k" suffix="+" />
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Events Held</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                    $0
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Platform Fees</div>
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
                    <CounterNumber value="5k" suffix="+" />
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-0.5">Hours Logged</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Visual Graphic Side */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-sm overflow-hidden"
            >
              <div ref={imageRef} className="relative aspect-[4/3] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <img 
                  src="/hero_volunteer_graphic.jpg" 
                  alt="HandsOn Community Volunteers" 
                  className="w-full h-full object-cover"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                {/* Micro Overlay Badge */}
                <div className="absolute bottom-3 left-3 right-3 p-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-md border border-white/20 dark:border-zinc-800/60 shadow-xs flex items-center gap-3">
                  <div className="w-8 h-8 rounded-md bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center text-white shrink-0">
                    <Globe size={16} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-zinc-900 dark:text-white text-xs truncate">Empowering Local Neighborhoods</div>
                    <div className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium truncate">Direct Action • Verified Teams</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
