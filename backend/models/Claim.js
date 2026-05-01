const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({

  // 👤 Farmer
  name: String,
  mobile: String,
  aadhaar: String,

  // 🌍 Land
  khasra: String,
  land_area: String,
  village: String,
  district: String,

  // 🌾 Crop
  crop_name: String,
  sowing_date: String,
  season: String,

  // ⚠️ Damage
  damage_type: String,
  incident_date: String,
  image: String,

  // 🏦 Bank
  bank_name: String,
  account_number: String,
  ifsc_code: String,

  // 🧾 Insurance
  policy_number: String,
  sum_insured: String,

  verify_image: String,
  verify_time: Date,

  lat: String,
  lon: String,

  // 📊 Status
  status: {
    patwari: { type: String, default: "Pending" },
    insurance: { type: String, default: "Pending" },
    bank: { type: String, default: "Pending" }
  }

});

module.exports = mongoose.model("Claim", claimSchema);