import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ChooseRole from "./pages/ChooseRole";
import Reader from "./pages/Reader";
import Blogger from "./pages/Blogger";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/reader" element={<Reader />} />
        <Route path="/blogger" element={<Blogger />} />
      </Routes>
    </Router>
  );
}

export default App;
