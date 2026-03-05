import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [profilePicUrl, setProfilePicUrl] = useState("/default-avatar.png");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    const fetchBooks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/books");
        setBooks(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch books:", err);
      }
    };

    const fetchProfilePic = async () => {
      if (!user?.email) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/users/profile-pic/${user.email}`,
          { responseType: "arraybuffer" }
        );
        const base64 = Buffer.from(res.data, "binary").toString("base64");
        const mimeType = res.headers["content-type"];
        setProfilePicUrl(`data:${mimeType};base64,${base64}`);
      } catch (err) {
        console.error("⚠️ Failed to load profile picture:", err);
      }
    };

    fetchBooks();
    fetchProfilePic();
  }, []);

  const handleRent = (book) => {
    alert(
      `To rent this book:\n\nSend ₹${book.price} to UPI ID:\n${book.upiId}\n\nThen confirm payment with the lender (${book.lenderEmail}) within 3 minutes.`
    );
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      {/* Profile Picture - Top Right */}
      <div style={{ position: "absolute", top: 10, right: 10 }}>
        <img
          src={profilePicUrl}
          alt="Profile"
          width="50"
          height="50"
          onClick={() => navigate("/profile")}
          style={{
            borderRadius: "50%",
            cursor: "pointer",
            border: "2px solid #ccc",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Navigation Buttons */}
      <div style={{ position: "absolute", top: 10, left: 10, display: "flex", gap: "10px" }}>
        <button onClick={() => navigate("/uploadbook")}>📤 Upload Book</button>
        <button onClick={() => navigate("/pyqs")}>📚 View PYQs</button>
      </div>

      <h2 style={{ marginTop: "80px" }}>Available Books for Rent</h2>

      {books.length === 0 ? (
        <p>No books available yet.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {books.map((book) => (
            <div
              key={book._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                borderRadius: "10px",
                width: "300px",
              }}
            >
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>₹{book.price}</strong></p>
              <p>{book.description}</p>
              <button onClick={() => handleRent(book)}>Rent Now</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
