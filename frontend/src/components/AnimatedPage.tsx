// src/components/AnimatedPage.tsx

"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { fadeInUp, prefersReducedMotion } from "../lib/animation";

/**
 * Global page transition wrapper.
 * Applies a fade‑in‑up on mount and fade‑out on unmount.
 * Respects prefers‑reduced‑motion – when true it renders children without motion.
 */
export default function AnimatedPage({ children }: { children: ReactNode }) {
  if (prefersReducedMotion()) {
    return <>{children}</>;
  }
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="page"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{ height: "100%" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
