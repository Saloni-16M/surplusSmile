const express = require("express");
const { registerResort, loginResort } = require("../controllers/resortController");

const router = express.Router();

// Resort registration route
router.post("/register", registerResort);
router.post("/login", loginResort);
// Admin approval & login details route
// router.post("/verify", verifyResort);

module.exports = router;
