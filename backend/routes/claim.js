const express = require("express");
const router = express.Router();
const multer = require("multer");

const Claim = require("../models/Application"); // check path सही हो

// 🔥 multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ GET all claims
router.get("/", async (req, res) => {
  try {
    const data = await Claim.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ SAVE FULL CLAIM (IMAGE + ALL DATA)
router.post("/", upload.single("damage_image"), async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const newClaim = new Claim({
      name: req.body.name,
      mobile: req.body.mobile,
      aadhaar: req.body.aadhaar,

      khasra: req.body.khasra,
      land_area: req.body.land_area,
      village: req.body.village,
      district: req.body.district,

      crop_name: req.body.crop_name,
      sowing_date: req.body.sowing_date,
      season: req.body.season,

      damage_type: req.body.damage_type,
      incident_date: req.body.incident_date,

      image: req.file ? req.file.originalname : "",

      bank_name: req.body.bank_name,
      account_number: req.body.account_number,
      ifsc_code: req.body.ifsc_code,

      policy_number: req.body.policy_number,
      sum_insured: req.body.sum_insured,

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

// ✅ PATWARI APPROVE
router.put("/patwari/:id", async (req, res) => {
  try {
    await Claim.findByIdAndUpdate(req.params.id, {
      "status.patwari": "Approved"
    });

    res.json({ message: "Patwari Approved ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ INSURANCE APPROVE
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

// ✅ BANK APPROVE
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