import React, { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [profilePicUrl, setProfilePicUrl] = useState("/default-avatar.png");
  const [rentalHistory, setRentalHistory] = useState([]);
  const [lendingHistory, setLendingHistory] = useState([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      try {
        // Profile pic
        const picRes = await axios.get(
          `http://localhost:5000/api/users/profile-pic/${user.email}`,
          { responseType: "arraybuffer" }
        );
        const base64 = Buffer.from(picRes.data, "binary").toString("base64");
        const mimeType = picRes.headers["content-type"];
        setProfilePicUrl(`data:${mimeType};base64,${base64}`);

        // Rental & Lending History
        const historyRes = await axios.get(
          `http://localhost:5000/api/users/history/${user.email}`
        );
        setRentalHistory(historyRes.data.rentals || []);
        setLendingHistory(historyRes.data.lendings || []);
      } catch (err) {
        console.error("Failed to load profile data:", err);
      }
    };

    fetchData();
  }, [user?.email]);

  const handlePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.email) return;

    const formData = new FormData();
    formData.append("email", user.email);
    formData.append("profilePic", file);

    try {
      await axios.post("http://localhost:5000/api/users/upload-pic", formData);
      alert("Profile picture updated.");
      window.location.reload(); // Refresh to show new pic
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Your Profile</h2>
      <div>
        <img
          src={profilePicUrl}
          alt="Profile"
          width="120"
          height="120"
          style={{ borderRadius: "50%", border: "3px solid #ccc" }}
        />
        <div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePicUpload}
            style={{ marginTop: "10px" }}
          />
        </div>
      </div>

      <h3 style={{ marginTop: "30px" }}>Rental History</h3>
      <ul>
        {rentalHistory.length === 0 ? (
          <li>No rentals yet.</li>
        ) : (
          rentalHistory.map((r, i) => (
            <li key={i}>
              {r.bookTitle} - ₹{r.price} - {new Date(r.date).toLocaleDateString()}
            </li>
          ))
        )}
      </ul>

      <h3 style={{ marginTop: "30px" }}>Lending History</h3>
      <ul>
        {lendingHistory.length === 0 ? (
          <li>No lendings yet.</li>
        ) : (
          lendingHistory.map((l, i) => (
            <li key={i}>
              {l.bookTitle} - ₹{l.price} - {new Date(l.date).toLocaleDateString()}
            </li>
          ))
        )}
      </ul>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "40px",
          backgroundColor: "crimson",
          color: "#fff",
          padding: "10px 20px",
          border: "none",
          borderRadius: "8px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
