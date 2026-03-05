import React from "react";
import { useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const handleGoogleLogin = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const { email, displayName, uid } = result.user;

    try {
      // Try Google auth endpoint first
      const authRes = await axios.post("http://localhost:5000/api/users/google-auth", {
        email,
        name: displayName,
        googleId: uid
      });
      
      localStorage.setItem("user", JSON.stringify(authRes.data.user));
      localStorage.setItem("token", authRes.data.token);
      navigate("/books");
    } catch (authErr) {
      // Handle migration case
      if (authErr.response?.data?.requiresMigration) {
        const confirm = window.confirm(
          "Account exists with password login. Switch to Google login?"
        );
        
        if (confirm) {
          const migrateRes = await axios.patch(
            `http://localhost:5000/api/users/${email}/migrate-to-google`,
            { googleId: uid }
          );
          
          localStorage.setItem("user", JSON.stringify(migrateRes.data.user));
          localStorage.setItem("token", migrateRes.data.token);
          navigate("/books");
        }
      } else {
        throw authErr;
      }
    }
  } catch (err) {
    console.error("Google login error:", err);
    alert("Login failed. Please try again.");
  }
};
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Login</h2>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleGoogleLogin}>Sign in with Google</button>
      </div>
    </div>
  );
};

export default Login;