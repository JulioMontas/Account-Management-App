var mongoose = require('mongoose');
var priceSchema = new mongoose.Schema({
  skill: String,
  perProjectHigh: Number,
  perProjectLow: Number,
  perHourHigh: Number,
  perHourLow: Number,
  category: String,
  created_at: { type: Date, default: Date.now},
  updated_at: { type: Date, default: Date.now}
});

mongoose.model('Price', priceSchema);
