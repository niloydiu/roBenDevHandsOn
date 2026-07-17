import React, { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AnimatePresence } from "framer-motion";

// Layout Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Lazy Loaded Pages & Components
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const Profile = lazy(() => import("./pages/Profile"));
const Events = lazy(() => import("./pages/Events"));
const EventDetail = lazy(() => import("./components/EventDetail"));
const EditEvent = lazy(() => import("./components/EditEvent"));
const CreateEvent = lazy(() => import("./pages/CreateEvent"));
const CommunityHelp = lazy(() => import("./pages/CommunityHelp"));
const Teams = lazy(() => import("./pages/Teams"));
const TeamDetail = lazy(() => import("./components/TeamDetail"));
const TeamEdit = lazy(() => import("./components/TeamEdit"));
const AdminPendingHours = lazy(() => import("./components/AdminPendingHours"));
const Chat = lazy(() => import("./pages/Chat"));
const Support = lazy(() => import("./pages/Support"));

// Loading Fallback Component
const PageLoading = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Loading Experience</span>
  </div>
);

const App = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/50 text-slate-900 font-sans antialiased">
      <Navbar />
      <div className="flex-grow pt-24 lg:pt-32">
        <Suspense fallback={<PageLoading />}>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/events" element={<Events />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/edit-event/:id" element={<EditEvent />} />
              <Route path="/create-event" element={<CreateEvent />} />
              <Route path="/community-help" element={<CommunityHelp />} />
              <Route path="/teams" element={<Teams />} />
              <Route path="/teams/:id" element={<TeamDetail />} />
              <Route path="/edit-team/:id" element={<TeamEdit />} />
              <Route path="/create-team" element={<Teams />} />
              <Route path="/admin/pending-hours" element={<AdminPendingHours />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/support" element={<Support />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
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
  );
};

export default App;
