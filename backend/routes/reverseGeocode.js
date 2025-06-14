// routes/reverseGeocode.js
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

router.post('/reverse-geocode', async (req, res) => {
  const { lat, lon } = req.body;
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: {
        'User-Agent': 'your-app-name (your-email@example.com)'
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch address' });
  }
});

module.exports = router;
