import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    const { username, email, password } = form;

    // Username: only alphanumeric, 3–20 chars
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      errs.username = "Username must be 3–20 characters (letters, numbers, or _)";
    }

    // Email: Gmail only
    if (!/^[\w.+-]+@gmail\.com$/.test(email)) {
      errs.email = "Only Gmail addresses are allowed";
    }

    // Password: like Instagram (min 6 chars, includes letter & number)
    if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(password)) {
      errs.password = "Password must be at least 6 characters and include letters and numbers";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async () => {
    if (!validate()) return;

    try {
      await axios.post("http://localhost:5000/api/users/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Sign Up</h2>
      <div>
        <input
          name="username"
          placeholder="Unique Username"
          onChange={handleChange}
          required
        />
        {errors.username && <div style={{ color: "red" }}>{errors.username}</div>}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          name="email"
          type="email"
          placeholder="Gmail"
          onChange={handleChange}
          required
        />
        {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
      </div>

      <div style={{ marginTop: "10px" }}>
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        {errors.password && <div style={{ color: "red" }}>{errors.password}</div>}
      </div>

      <button style={{ marginTop: "20px" }} onClick={handleSignup}>
        Sign Up
      </button>
    </div>
  );
};

export default Signup;
