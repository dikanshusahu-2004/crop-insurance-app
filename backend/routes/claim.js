const express = require("express");
const router = express.Router();
const multer = require("multer");

const Claim = require("../models/Application");

// multer


const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  cb(null, path.join(__dirname, "../uploads"));
} ,
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });


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
router.post("/", upload.single("damage_image"), async (req, res) => {

    console.log("REQ BODY:", req.body);
    console.log("REQ FILE:", req.file);

    if (!req.file) {
  return res.status(400).json({ error: "Image not uploaded" });
}

    try {

        const newClaim = new Claim({
            name: req.body.name || "",
            mobile: req.body.mobile || "",
            aadhaar: req.body.aadhaar || "",

            khasra: req.body.khasra || "",
            land_area: req.body.land_area || "",
            village: req.body.village || "",
            district: req.body.district || "",

            crop_name: req.body.crop_name || "",
            sowing_date: req.body.sowing_date || "",
            season: req.body.season || "",
            
            lat: req.body.lat || "",
            lon: req.body.lon || "",
           image: req.file ? req.file.filename : "",

            bank_name: req.body.bank_name || "",
            account_number: req.body.account_number || "",
            ifsc_code: req.body.ifsc_code || "",

            policy_number: req.body.policy_number || "",
            sum_insured: req.body.sum_insured || "",

            status: {
                patwari: "Pending",
                insurance: "Pending",
                bank: "Pending"
            }
        });

        await newClaim.save();

        res.json({ message: "Claim saved successfully ✅" });

    } catch (err) {
        console.error("ERROR:", err);
        res.status(500).json({ error: err.message });
    }

});
// ✅ APPROVAL ROUTES (same)
router.put("/patwari/:id", upload.single("verify_image"), async (req, res) => {
  try {

    const updated = await Claim.findByIdAndUpdate(
  req.params.id,
  {
    "status.patwari": "Approved",

    verify_image: req.file ? req.file.originalname : "",

    lat: req.body.lat || "",
    lon: req.body.lon || "",

    verify_time: new Date()
  },
  { new: true }
);

    res.json({ message: "Patwari Verified ✅", data: updated });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/insurance/:id", async (req, res) => {
  await Claim.findByIdAndUpdate(req.params.id, {
    "status.insurance": "Approved"
  });
  res.json({ message: "Insurance Approved" });
});

router.put("/bank/:id", async (req, res) => {
  await Claim.findByIdAndUpdate(req.params.id, { "status.bank": "Approved" });
  res.json({ message: "Bank Approved ✅" });
});

module.exports = router;