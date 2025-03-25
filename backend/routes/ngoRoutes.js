const express = require("express");
const { registerNgo, loginNgo } = require("../controllers/ngoController");
const router = express.Router();

router.post("/register", registerNgo);
// router.post("/verify", verifyNgo); // Only Admin should call this
router.post("/login", loginNgo);
module.exports = router;
