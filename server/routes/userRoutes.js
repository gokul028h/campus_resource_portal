const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
  uploadProfilePic,
  getProfilePic,
  getUserHistory,
  signupUser,
  loginUser,
  handleGoogleAuth,
  migrateToGoogle
} = require("../controllers/userController");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Auth routes
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/google-auth", handleGoogleAuth);
router.patch("/:email/migrate-to-google", migrateToGoogle);

// Profile routes
router.post("/upload-profile", upload.single("profileImage"), uploadProfilePic);
router.get("/profile-pic/:email", async (req, res) => {
  try {
    const user = await require("../models/User").findOne({ email: req.params.email });
    if (!user || !user.profilePic || !user.profilePic.data) {
      return res.status(404).send("No profile picture found");
    }
    res.contentType(user.profilePic.contentType);
    res.send(user.profilePic.data);
  } catch (err) {
    res.status(500).send("Failed to retrieve image");
  }
});

// History route
router.get("/history/:email", getUserHistory);

module.exports = router;