import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "10px", background: "#eee", marginBottom: "20px" }}>
      <Link to="/" style={{ marginRight: "10px" }}>Home</Link>

      {user && (
        <>
          <Link to="/upload" style={{ marginRight: "10px" }}>Upload Book</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}

      {!user && <Link to="/login">Login</Link>}
    </nav>
  );
};

export default Navbar;
