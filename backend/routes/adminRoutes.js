const express = require("express");
const { getAllNgos, getAllResorts ,approveNgo,updateNgo} = require("../controllers/adminController");

const router = express.Router();

// Route to get all registered NGOs
router.get("/ngos", getAllNgos);
router.get("/resorts", getAllResorts);
router.put("/update-ngo/:id", updateNgo);
router.put("/ngos/:ngoId", approveNgo);
module.exports = router;
