// src/components/MotionButton.tsx

"use client";
import { motion, MotionProps } from "framer-motion";
import { prefersReducedMotion } from "../lib/animation";
import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface MotionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
}

export default function MotionButton({ children, className = "", ...rest }: MotionButtonProps) {
  if (prefersReducedMotion()) {
    return (
      <button className={className} {...rest}>
        {children}
      </button>
    );
  }

  const motionProps: MotionProps = {
    whileHover: { scale: 1.03 },
    whileTap: { scale: 0.97 },
    transition: { duration: 0.15, ease: [0.4, 0, 0.2, 1] },
  };

  return (
    <motion.button className={className} {...motionProps} {...(rest as any)}>
      {children}
    </motion.button>
  );
}
