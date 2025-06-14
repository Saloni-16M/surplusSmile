const express = require("express");
const { getAllNgos, getAllResorts,updateNgo, approveNgo, approveResort, updateResort,loginAdmin } = require("../controllers/adminController");
const verifyAdminAuth = require("../middlewares/verifyAdminAuth");

const router = express.Router();

// Get all registered NGOs & Resorts
// Protected routes: only accessible after login
router.post("/login", loginAdmin);
router.get("/ngos", verifyAdminAuth, getAllNgos);
router.get("/resorts", verifyAdminAuth, getAllResorts);

router.put("/ngos/:ngoId/approve", verifyAdminAuth, approveNgo);
router.put("/ngos/update/:ngoId", verifyAdminAuth, updateNgo);
router.put("/resorts/:resortId/approve", verifyAdminAuth, approveResort);
router.put("/resorts/update/:resortId", verifyAdminAuth, updateResort);

module.exports = router;
