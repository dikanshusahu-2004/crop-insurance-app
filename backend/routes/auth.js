const express = require("express");
const router = express.Router();
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User Registered ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    const user = await User.findOne({ mobile, password });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials ❌" });
    }

    res.json({ message: "Login success ✅", user });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;