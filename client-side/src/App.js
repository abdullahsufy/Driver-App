import "./App.css";
import Home from "./pages/Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import AdminPage from "./pages/AdminPage";
import EditUserDetail from "./pages/EditUserDetail";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/admin" element={<AdminPage />} />
          <Route exact path="/update/:id" element={<EditUserDetail />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;