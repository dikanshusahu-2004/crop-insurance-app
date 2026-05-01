const express = require("express");
const router = express.Router();
const multer = require("multer");

const axios = require("axios");
const FormData = require("form-data");

const Application = require("../models/Application");

// multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

// CREATE
router.post("/create", async (req, res) => {
  ...
});

// GET
router.get("/all", async (req, res) => {
  ...
});

// 🔥 UPLOAD (AI CONNECTED)
router.post("/upload", upload.single("file"), async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded ❌" });
    }

    console.log("Sending to AI...");

    const formData = new FormData();
    formData.append("image", req.file.buffer, req.file.originalname);

    const response = await axios.post("https://crop-ai-api-vqcm.onrender.com", formData, {
      headers: formData.getHeaders()
    });

    console.log("AI RESPONSE:", response.data);

    res.json({
      success: true,
      result: response.data.result
    });

  } catch (err) {
    console.error("AI ERROR:", err.message);
    res.status(500).json({ message: "AI Failed ❌" });
  }
});

module.exports = router;