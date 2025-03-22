
const express = require('express');
const router = express.Router();
const GasReading = require('../models/GasReading');

// Get all gas readings
router.get('/readings', async (req, res) => {
  try {
    const readings = await GasReading.find().sort({ timestamp: -1 }).limit(30);
    res.json(readings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get latest gas reading
router.get('/readings/latest', async (req, res) => {
  try {
    const reading = await GasReading.findOne().sort({ timestamp: -1 });
    res.json(reading);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add a new gas reading
router.post('/readings', async (req, res) => {
  const reading = new GasReading({
    level: req.body.level
  });

  try {
    const newReading = await reading.save();
    res.status(201).json(newReading);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
