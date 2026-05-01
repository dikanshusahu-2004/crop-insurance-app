const express = require("express");
const router = express.Router();
const multer = require("multer");

const Application = require("../models/Application");

// ===== MULTER =====
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ===== CREATE API =====
router.post("/create", async (req, res) => {
  try {
    const newApp = new Application(req.body);
    await newApp.save();

    res.json({ success: true, message: "Application Saved ✅" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});


// ===== GET ALL =====
router.get("/all", async (req, res) => {
  try {
    const data = await Application.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ===== UPLOAD =====
router.post("/upload", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded ❌" });
    }

    console.log("File received:", req.file.originalname);

    // dummy AI result
    const result = Math.random() > 0.5 ? "damaged" : "healthy";

    res.json({
      success: true,
      result: result
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Upload failed ❌" });
  }
});

module.exports = router;