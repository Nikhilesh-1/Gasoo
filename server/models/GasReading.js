
const mongoose = require('mongoose');

const gasReadingSchema = new mongoose.Schema({
  level: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('GasReading', gasReadingSchema);
