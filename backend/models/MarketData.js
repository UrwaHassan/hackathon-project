const mongoose = require('mongoose');

const marketDataSchema = new mongoose.Schema({
  item: { type: String, required: true },
  price: { type: Number, required: true },
  region: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('MarketData', marketDataSchema);
