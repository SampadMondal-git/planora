import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react"
import "./App.css";

import { Header } from "./components/header.jsx";
import { Welcome } from "./components/welcome.jsx";
import { Destination } from "./components/destination";
import { TripPlanner } from "./components/tripplanner.jsx";
import { SignIn, SignUp } from "./components/auth.jsx";

export default function App() {
  return (
    <>
      <Router>
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/enter-your-plans" element={<Destination />} />
            <Route path="/planner" element={<TripPlanner />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </div>
      </Router>
      
      <Analytics />
      <SpeedInsights />
    </>
  );
}
