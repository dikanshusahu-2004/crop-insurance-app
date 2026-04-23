const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  aadhaar: String,
  farmerId: String
});

module.exports = mongoose.model("Application", ApplicationSchema);