const express = require("express");
const router = express.Router();
const multer = require("multer");

const Claim = require("../models/Application");

// multer
const storage = multer.memoryStorage();
const upload = multer({ storage });


// ✅ GET
router.get("/", async (req, res) => {
  try {
    const data = await Claim.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ SAVE (IMPORTANT FIX)
router.post("/create", upload.single("damage_image"), async (req, res) => {
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

    res.json({ success: true, message: "Saved ✅" });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ APPROVAL ROUTES (same)
router.put("/patwari/:id", async (req, res) => {
  await Claim.findByIdAndUpdate(req.params.id, { "status.patwari": "Approved" });
  res.json({ message: "Patwari Approved ✅" });
});

router.put("/insurance/:id", async (req, res) => {
  await Claim.findByIdAndUpdate(req.params.id, { "status.insurance": "Approved" });
  res.json({ message: "Insurance Approved ✅" });
});

router.put("/bank/:id", async (req, res) => {
  await Claim.findByIdAndUpdate(req.params.id, { "status.bank": "Approved" });
  res.json({ message: "Bank Approved ✅" });
});

module.exports = router;