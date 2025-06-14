const express = require("express");
const fetch = require("node-fetch"); // use native fetch if Node 18+
const router = express.Router();

router.post("/get-coordinates", async (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "MyNGOApp/1.0 (contact@example.com)", // Required by Nominatim
      },
    });

    const data = await response.json();

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "No results found" });
    }

    const { lat, lon } = data[0];
    res.json({ lat, lon });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch coordinates", details: error.message });
  }
});

module.exports = router;
