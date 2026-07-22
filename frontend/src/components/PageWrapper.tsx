"use client";
import { motion, Variants, Transition } from "framer-motion";
import React, { ReactNode } from "react";

const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 }
};

const pageTransition: Transition = {
  ease: "easeInOut",
  duration: 0.2
};

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full h-full flex flex-col min-h-screen"
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
