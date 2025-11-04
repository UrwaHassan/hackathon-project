const express = require('express');
const MarketData = require('../models/MarketData');
const auth = require('../middleware/auth');
const axios = require('axios');

const router = express.Router();

// Get market data
router.get('/market-data', auth, async (req, res) => {
  try {
    const data = await MarketData.find().sort({ date: -1 });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get weather data
router.get('/weather/:city', auth, async (req, res) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY || 'your_api_key';
    const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${req.params.city}&appid=${apiKey}&units=metric`);
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: 'Weather data unavailable' });
  }
});

// Get advice
router.get('/advice', auth, async (req, res) => {
  // Simple logic-based advice
  const advice = "Check weather before watering crops.";
  res.json({ advice });
});

module.exports = router;
