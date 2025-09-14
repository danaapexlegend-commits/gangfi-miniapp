// App.jsx
// ================================
// Root of the React app
// - Uses react-router-dom for 4 main pages
// - Always shows NavBar at bottom
// - Pages: Dashboard, Missions, ComingSoon, Info
// ================================

import React, {  useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { getCurrentUser } from "./api/user";

// Components
import NavBar from "./components/NavBar";

// Pages
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
import ComingSoon from "./pages/ComingSoon";
import Info from "./pages/Info";

// context
import { UserContext } from "./context/UserContext";


function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await getCurrentUser();
        setUser(data.user);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    }
    loadUser();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        {/* wrapper for all pages */}
        <div style={{ paddingBottom: "80px" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/coming" element={<ComingSoon />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </div>

        {/* bottom navigation bar */}
        <NavBar />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
