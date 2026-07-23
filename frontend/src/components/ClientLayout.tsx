"use client";
import React, { ReactNode, useEffect } from "react";
import AppcontextProvider from "../context/Appcontext";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Lenis from "lenis";
import AnimatedPage from "../components/AnimatedPage";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <AppcontextProvider>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 font-sans antialiased text-[14px]">
          <Navbar />
          <div className="flex-grow pt-16">
            <AnimatedPage>{children}</AnimatedPage>
          </div>
          <Footer />
          <ToastContainer 
            position="bottom-right"
            toastClassName="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-lg shadow-sm text-xs font-medium"
          />
        </div>
      </ThemeProvider>
    </AppcontextProvider>
  );
}
