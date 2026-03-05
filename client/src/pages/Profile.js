import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const [email, setEmail] = useState(""); // pulled from localStorage on mount
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [lendingHistory, setLendingHistory] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) {
      setEmail(user.email);
      fetchProfilePic(user.email);
      fetchHistory(user.email);
    }
  }, []);

  const fetchProfilePic = async (email) => {
    try {
      const res = await axios.get(`/api/users/profile-pic/${email}`, {
        responseType: "arraybuffer",
      });
      const base64 = btoa(
        new Uint8Array(res.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );
      setPreview(`data:image/png;base64,${base64}`);
    } catch (err) {
      console.log("No image found");
    }
  };

  const fetchHistory = async (email) => {
    try {
      const res = await axios.get(`/api/users/history/${email}`);
      setRentalHistory(res.data.rentalHistory || []);
      setLendingHistory(res.data.lendingHistory || []);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfileImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadImage = async () => {
    if (!profileImage) return alert("Choose an image first");
    const formData = new FormData();
    formData.append("profileImage", profileImage);
    formData.append("email", email);
    try {
      await axios.post("/api/users/upload-profile", formData);
      alert("Uploaded successfully");
    } catch (err) {
      alert("Upload failed");
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      <div className="profile-section">
        <img src={preview} alt="Profile" className="profile-pic" />
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button onClick={uploadImage}>Upload</button>
      </div>

      <div className="history-section">
        <h3>Rental History</h3>
        {rentalHistory.length ? (
          <ul>
            {rentalHistory.map((item, i) => (
              <li key={i}>
                📘 {item.bookTitle} - ₹{item.amount} - {new Date(item.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No rentals yet.</p>
        )}

        <h3>Lending History</h3>
        {lendingHistory.length ? (
          <ul>
            {lendingHistory.map((item, i) => (
              <li key={i}>
                📕 {item.bookTitle} - ₹{item.amount} - {new Date(item.date).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No lendings yet.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;
