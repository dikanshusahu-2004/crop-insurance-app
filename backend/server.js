const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

console.log("MONGO URI:", process.env.MONGO_URI);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// API routes
app.use("/api/app", require("./routes/app"));
app.use("/api/claim", require("./routes/claim"));
app.use("/api/auth", require("./routes/auth"));

// ✅ frontend serve
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port " + PORT));