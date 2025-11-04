const express = require('express');
const MarketData = require('../models/MarketData');
const auth = require('../middleware/auth');

const router = express.Router();

// Middleware to check admin role
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  next();
};

// Get all market data
router.get('/market-data', auth, adminAuth, async (req, res) => {
  try {
    const data = await MarketData.find();
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add market data
router.post('/market-data', auth, adminAuth, async (req, res) => {
  const { item, price, region } = req.body;
  try {
    const data = new MarketData({ item, price, region });
    await data.save();
    res.status(201).json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update market data
router.put('/market-data/:id', auth, adminAuth, async (req, res) => {
  const { item, price, region } = req.body;
  try {
    const data = await MarketData.findByIdAndUpdate(req.params.id, { item, price, region }, { new: true });
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete market data
router.delete('/market-data/:id', auth, adminAuth, async (req, res) => {
  try {
    await MarketData.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
