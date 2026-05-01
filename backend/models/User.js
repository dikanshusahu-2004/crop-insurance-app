const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  password: String,
  role: { type: String, default: "farmer" } 
  // farmer / patwari / insurance / bank
});

module.exports = mongoose.model("User", UserSchema);