const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
const app = express();

// ✅ CORS
app.use(cors());

// ✅ IMPORTANT FIX (FormData + JSON दोनों के लिए)
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // 🔥 ADD THIS


console.log("MONGO URI:", process.env.MONGO_URI);

// ✅ MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));


// ✅ ROUTES (correct order)
app.use("/api/app", require("./routes/app"));
app.use("/api/claim", require("./routes/claim"));
app.use("/api/auth", require("./routes/auth"));



app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ frontend serve
app.use(express.static(path.join(__dirname, "../frontend")));


// ✅ homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


// ✅ SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));