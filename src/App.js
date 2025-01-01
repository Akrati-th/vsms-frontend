import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Navbar from "./components/NavBar";
import ComponentRegistration from "./components/Registration";
import Inventory from "./components/Inventory";
import VehicleRepair from "./components/AddVehicle";
import Dashboard from "./components/Dashboard";
import EditInventory from './components/EditInventory';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/dashboard" /> : <Login setIsLoggedIn={setIsLoggedIn} />}
        />

        {isLoggedIn ? (
          <>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/add-to-inventory" element={<ComponentRegistration />} />
            <Route path="/edit-component/:id" element={<EditInventory />} />
            <Route path="/repair" element={<VehicleRepair />} />
          </>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;


