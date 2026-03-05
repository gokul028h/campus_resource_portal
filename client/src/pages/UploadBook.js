import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UploadBook = () => {
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    description: "",
    upiId: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return alert("Please log in to upload a book");

    try {
      await axios.post("http://localhost:5000/api/books", {
        ...form,
        lenderEmail: user.email,
      });

      alert("Book uploaded successfully!");
      setForm({ title: "", author: "", price: "", description: "", upiId: "" });
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Navigation Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button onClick={() => navigate("/books")}>🏠 Back to Books</button>
        <button onClick={() => navigate("/pyqs")}>📚 View PYQs</button>
      </div>

      <h2>Upload a Book for Rent</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", width: "300px" }}>
        <input name="title" value={form.title} onChange={handleChange} placeholder="Book Title" required />
        <input name="author" value={form.author} onChange={handleChange} placeholder="Author" required />
        <input name="price" value={form.price} onChange={handleChange} placeholder="Price" type="number" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
        <input name="upiId" value={form.upiId} onChange={handleChange} placeholder="Your UPI ID" required />
        <button type="submit">Upload Book</button>
      </form>
    </div>
  );
};

export default UploadBook;
