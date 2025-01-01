import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/NavBar.css";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="navbar">
      <h2>Vehicle Service Management</h2>
      <ul>
        {isLoggedIn ? ( 
          <>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/repair">Vehicles</Link></li>
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        ) : (
          <li><Link to="/">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
