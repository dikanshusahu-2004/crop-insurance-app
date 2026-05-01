const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();   // ✅ सबसे ऊपर

const app = express();

app.use(cors());
app.use(express.json());

console.log("MONGO URI:", process.env.MONGO_URI);
// ✅ MongoDB connect (ONLY ONCE)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// routes
app.use("/api/app", require("./routes/app"));
app.use("/api/claim", require("./routes/claim"));
app.use("/api/auth", require("./routes/auth"));

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log("Server running on port " + PORT));