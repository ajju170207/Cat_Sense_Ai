import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./styles/style.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import History from "./pages/History";

function App() {
  return (
    <BrowserRouter>
      <a href="#main-content" className="skip-link">Skip to Content</a>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;