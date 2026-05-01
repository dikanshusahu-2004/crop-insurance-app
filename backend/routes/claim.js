const express = require("express");
const router = express.Router();

const Claim = require("../models/Application");

// GET all claims
router.get("/", async (req, res) => {
  const data = await Claim.find();
  res.json(data);
});

// SAVE claim (ONLY ONE ROUTE)
router.post("/", async (req, res) => {
  try {
    console.log("DATA RECEIVED:", req.body);

    const newClaim = new Claim({
      name: req.body.name,
      mobile: req.body.mobile,
      aadhaar: req.body.aadhaar,

      status: {
        patwari: "Pending",
        insurance: "Pending",
        bank: "Pending"
      }
    });

    await newClaim.save();

    res.json({ message: "Claim saved successfully ✅" });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// UPDATE PATWARI STATUS
router.put("/patwari/:id", async (req, res) => {
  try {
    const updated = await Claim.findByIdAndUpdate(
      req.params.id,
      { "status.patwari": "Approved" },
      { new: true }
    );

    console.log("UPDATED:", updated);

    res.json({ message: "Patwari Approved ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});
// INSURANCE APPROVAL
router.put("/insurance/:id", async (req, res) => {
  try {
    await Claim.findByIdAndUpdate(req.params.id, {
      "status.insurance": "Approved"
    });

    res.json({ message: "Insurance Approved ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// BANK APPROVAL
router.put("/bank/:id", async (req, res) => {
  try {
    await Claim.findByIdAndUpdate(req.params.id, {
      "status.bank": "Approved"
    });

    res.json({ message: "Bank Approved ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;