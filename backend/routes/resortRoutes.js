const express = require("express");
const { registerResort, verifyResort } = require("../controllers/resortController");

const router = express.Router();

// Resort registration route
router.post("/register", registerResort);

// Admin approval & login details route
// router.post("/verify", verifyResort);

module.exports = router;
