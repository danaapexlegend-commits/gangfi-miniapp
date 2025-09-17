// ================================
// Root of the React app
// ================================

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// api
import { loginWithTelegram, getCurrentUser } from "./api/user";

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
    async function init() {
      try {
        console.log("🔎 window.Telegram.WebApp:", window.Telegram?.WebApp);
        console.log("🔎 initData:", window.Telegram?.WebApp?.initData);
        console.log("🔎 initDataUnsafe:", window.Telegram?.WebApp?.initDataUnsafe);

        // 1. Login first
        const loginRes = await loginWithTelegram();
        const loggedUser = loginRes.user;
        console.log("✅ Logged in user:", loggedUser);

        // 2. Fetch fresh user data (optional)
        const data = await getCurrentUser(String(loggedUser.telegram_id));
        setUser(data.user);
      } catch (err) {
        console.error("❌ Failed to load user", err);
      }
    }
    init();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div style={{ paddingBottom: "80px" }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/missions" element={<Missions />} />
            <Route path="/coming" element={<ComingSoon />} />
            <Route path="/info" element={<Info />} />
          </Routes>
        </div>

        <NavBar />
      </Router>
    </UserContext.Provider>
  );
}

export default App;
