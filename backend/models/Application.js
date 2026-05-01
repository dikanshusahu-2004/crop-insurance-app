const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  aadhaar: String,

  status: {
    patwari: { type: String, default: "Pending" },
    insurance: { type: String, default: "Pending" },
    bank: { type: String, default: "Pending" }
  }
});

module.exports = mongoose.model("Application", ApplicationSchema);