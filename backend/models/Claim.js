const mongoose = require("mongoose");
const Claim = require("../models/Claim");

router.post("/", async (req, res) => {
  try {

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

      bank_name: req.body.bank_name,
      account_number: req.body.account_number,
      ifsc_code: req.body.ifsc_code,

      policy_number: req.body.policy_number,
      sum_insured: req.body.sum_insured

    });

    await newClaim.save();

    res.json({ message: "Full Claim Saved ✅" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = mongoose.model("Claim", ClaimSchema);