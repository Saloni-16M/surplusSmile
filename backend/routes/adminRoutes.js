const express = require("express");
const { getAllNgos, getAllResorts,updateNgo, approveNgo, approveResort, updateResort,loginAdmin, loginAdminValidators } = require("../controllers/adminController");
const verifyAdminAuth = require("../middlewares/verifyAdminAuth");
const rateLimit = require('express-rate-limit');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
});

// Get all registered NGOs & Resorts
// Protected routes: only accessible after login
router.post("/login", loginLimiter, loginAdminValidators, loginAdmin);
router.get("/ngos", verifyAdminAuth, getAllNgos);
router.get("/resorts", verifyAdminAuth, getAllResorts);

router.put("/ngos/:ngoId/approve", verifyAdminAuth, approveNgo);
router.put("/ngos/update/:ngoId", verifyAdminAuth, updateNgo);
router.put("/resorts/:resortId/approve", verifyAdminAuth, approveResort);
router.put("/resorts/update/:resortId", verifyAdminAuth, updateResort);

// TODO: Add rate limiting to login and register endpoints
// TODO: Add input validation for all endpoints

module.exports = router;
