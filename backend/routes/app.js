const express = require("express");
const router = express.Router();
const Application = require("../models/Application");

// ✅ CREATE API
router.post("/create", async (req, res) => {
  try {
    console.log(req.body);

    const newApp = new Application(req.body);
    await newApp.save();

    res.json({ success: true, message: "Application Saved ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server Error" });
  }
});

module.exports = router;