import { Route, Routes } from "react-router-dom";
import EditEvent from "./components/EditEvent";
import EventDetail from "./components/EventDetail";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import TeamDetail from "./components/TeamDetail";
import TeamEdit from "./components/TeamEdit";
import CommunityHelp from "./pages/CommunityHelp";
import CreateEvent from "./pages/CreateEvent";
import Events from "./pages/Events";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import Teams from "./pages/Teams";

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
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
        {/* New routes for team management */}
        <Route path="/teams/:id" element={<TeamDetail />} />
        <Route path="/edit-team/:id" element={<TeamEdit />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
