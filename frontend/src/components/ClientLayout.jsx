"use client";
import React from "react";
import AppcontextProvider from "../context/Appcontext";
import { ThemeProvider } from "../context/ThemeContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ClientLayout({ children }) {
  return (
    <AppcontextProvider>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
          <Navbar />
          <div className="flex-grow pt-24 lg:pt-32">
            {children}
          </div>
          <Footer />
          <ToastContainer 
            position="bottom-right"
            toastClassName={() => 
              "relative flex p-4 min-h-10 rounded-2xl justify-between overflow-hidden cursor-pointer bg-white shadow-2xl border border-slate-100 mb-4 mx-4 md:mx-0"
            }
            bodyClassName={() => "text-sm font-bold text-slate-900 flex items-center p-0"}
          />
        </div>
      </ThemeProvider>
    </AppcontextProvider>
  );
}
