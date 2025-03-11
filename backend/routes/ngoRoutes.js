const express = require("express");
const { registerNgo, verifyNgo } = require("../controllers/ngoController");
const router = express.Router();

router.post("/register", registerNgo);
// router.post("/verify", verifyNgo); // Only Admin should call this

module.exports = router;
