import React, { useState } from "react";
import axios from "axios";

const UploadPYQ = () => {
  const [form, setForm] = useState({
    subjectName: "",
    subjectCode: "",
    year: "",
    type: "",
    slot: "",
    date: "",
  });
  const [image, setImage] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("You must be logged in to upload PYQ.");
      return;
    }

    if (!image) return alert("Please upload an image.");

    const formData = new FormData();
    formData.append("image", image);
    Object.entries(form).forEach(([key, value]) =>
      formData.append(key, value)
    );
    formData.append("email", user.email);

    try {
      await axios.post("http://localhost:5000/api/pyqs/upload", formData);
      alert("PYQ uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Failed to upload PYQ.");
    }
  };

  return (
    <form onSubmit={handleUpload} style={{ padding: "20px" }}>
      <h2>Upload PYQ</h2>
      <input
        type="text"
        name="subjectName"
        placeholder="Subject Name"
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="text"
        name="subjectCode"
        placeholder="Subject Code (e.g. CSE200)"
        pattern="[A-Za-z]{4}[0-9]{3}[a-zA-Z]{1}"
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="text"
        name="year"
        placeholder="Year (e.g. 2nd Year)"
        onChange={handleChange}
        required
      />
      <br />
      <label>
        Exam Type:
        <select name="type" onChange={handleChange} required>
          <option value="">Select</option>
          <option value="CAT1">CAT1</option>
          <option value="CAT2">CAT2</option>
          <option value="FAT">FAT</option>
        </select>
      </label>
      <br />
      <input
        type="text"
        name="slot"
        placeholder="Slot (e.g. d1, td1, taa1)"
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="date"
        name="date"
        onChange={handleChange}
        required
      />
      <br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        required
      />
      <br />
      <button type="submit">Upload</button>
    </form>
  );
};

export default UploadPYQ;
