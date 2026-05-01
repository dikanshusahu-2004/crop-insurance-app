const mongoose = require("mongoose");
const Claim = require("../models/Claim");

const ClaimSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  aadhaar: String,
  status: String
});

module.exports = mongoose.model("Claim", ClaimSchema);