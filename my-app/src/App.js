import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ChooseRole from "./pages/ChooseRole";
import Profile from "./pages/profile";
import Reader from "./pages/Reader";
import Blogger from "./pages/Blogger";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:3001/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: "user@example.com", password: "password" }),
        });
        const data = await response.json();
        if (data.success) setUser(data.user);
      } catch (err) {
        console.error("Auth check failed:", err);
      }
    };
    checkAuth();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={user ? <Navigate to="/choose-role" /> : <Login onLogin={handleLogin} />} />
      <Route path="/choose-role" element={<ChooseRole />} />
      <Route path="/reader" element={<Reader user={user} />} />
      <Route path="/blogger" element={<Blogger user={user} />} />
      <Route path="/profile" element={<Profile user={user} />} />
      <Route path="*" element={<Navigate to={user ? "/choose-role" : "/"} />} />
    </Routes>
  );
}

export default App;