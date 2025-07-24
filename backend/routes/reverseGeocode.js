// routes/reverseGeocode.js
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Helper to validate coordinates
function isValidCoordinate(val) {
  return typeof val === 'number' && !isNaN(val) && isFinite(val);
}

router.post('/reverse-geocode', async (req, res) => {
  let { lat, lon } = req.body;
  // Try to coerce to numbers if sent as strings
  lat = typeof lat === 'string' ? parseFloat(lat) : lat;
  lon = typeof lon === 'string' ? parseFloat(lon) : lon;

  if (!isValidCoordinate(lat) || !isValidCoordinate(lon)) {
    return res.status(400).json({ error: 'Invalid or missing latitude/longitude.' });
  }

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`, {
      headers: {
        'User-Agent': 'surplussmile-app (surplussmile@gmail.com)'
      }
    });
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch address from geocoding service.' });
    }
    const data = await response.json();
    if (!data || !data.display_name) {
      return res.status(404).json({ error: 'No address found for the given coordinates.' });
    }
    res.json(data);
  } catch (err) {
    console.error('Reverse geocoding error:', err);
    res.status(500).json({ error: 'Internal server error during reverse geocoding.' });
  }
});

module.exports = router;
