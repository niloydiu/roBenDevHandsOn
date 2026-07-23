// src/lib/animation.ts

import { Variant, Variants } from "framer-motion";

// Timing constants (seconds)
export const durationShort = 0.2;
export const durationMedium = 0.35;
export const durationLong = 0.5;
export const easing: any = [0.4, 0, 0.2, 1]; // easeOut cubic-bezier

/**
 * Helper to respect prefers-reduced-motion media query.
 * Returns true if the user prefers reduced motion.
 */
export const prefersReducedMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/** Base fade‑in variant */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durationShort, ease: easing },
  },
};

/** Fade‑in + slight upward movement */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationMedium, ease: easing },
  },
};

/** Simple scale‑in */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durationShort, ease: easing },
  },
};

/** Stagger container for child animations */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

/** Slide‑in from right */
export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durationMedium, ease: easing },
  },
};
