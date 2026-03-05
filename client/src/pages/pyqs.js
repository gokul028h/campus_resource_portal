import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Buffer } from "buffer";
import Modal from "react-modal";


const PyqPage = () => {
  const [pyqs, setPyqs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalImage, setModalImage] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchPyqs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/pyqs");
        setPyqs(res.data);
      } catch (err) {
        console.error("Failed to fetch PYQs:", err);
      }
    };

    fetchPyqs();
  }, []);

  const filteredPyqs = pyqs.filter((pyq) => {
    const term = searchTerm.toLowerCase();
    return (
      pyq.subjectName.toLowerCase().includes(term) ||
      pyq.subjectCode.toLowerCase().includes(term) ||
      pyq.examType.toLowerCase().includes(term) ||
      pyq.slot.toLowerCase().includes(term) ||
      pyq.year.toString().includes(term)
    );
  });

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const handleImageClick = (imageData) => {
    setModalImage(imageData);
  };

  const handleCloseModal = () => {
    setModalImage(null);
  };

  const goToUpload = () => {
    if (!user) return alert("You must be logged in to upload.");
    navigate("/upload-pyq");
  };

  return (
    <div style={{ padding: "20px" }}>
      {/* Top Buttons */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
        <button onClick={() => navigate("/books")}>🏠 Back to Books</button>
        <button onClick={goToUpload}>📤 Upload PYQ</button>
      </div>

      <h2>Previous Year Question Papers</h2>

      {/* Search */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <input
          type="text"
          placeholder="Search PYQs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "80%", padding: "10px" }}
        />
      </div>

      {/* PYQ Grid */}
      {filteredPyqs.length === 0 ? (
        <p style={{ textAlign: "center" }}>No PYQs found.</p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "20px",
          }}
        >
          {filteredPyqs.slice(0, visibleCount).map((pyq) => {
            const base64 = Buffer.from(pyq.image.data).toString("base64");
            const mime = pyq.image.contentType;
            const imageUrl = `data:${mime};base64,${base64}`;
            return (
              <div
                key={pyq._id}
                onClick={() => handleImageClick(imageUrl)}
                style={{
                  cursor: "pointer",
                  border: "1px solid #ccc",
                  borderRadius: "10px",
                  padding: "10px",
                }}
              >
                <img src={imageUrl} alt="PYQ" style={{ width: "100%", height: "auto" }} />
                <p><strong>Date:</strong> {pyq.date}</p>
                <p><strong>Year:</strong> {pyq.year}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Load More */}
      {visibleCount < filteredPyqs.length && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={!!modalImage}
        onRequestClose={handleCloseModal}
        style={{ content: { inset: "10%", padding: 0 } }}
      >
        <img
          src={modalImage}
          alt="Preview"
          style={{ width: "100%", height: "auto" }}
        />
      </Modal>
    </div>
  );
};

export default PyqPage;
