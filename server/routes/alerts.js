const express = require('express');
const router = express.Router();
const Alert = require('../models/Alert');

// Simulate price fluctuation for demo
function simulateCurrentPrice(from, to, mode) {
  const seed = (from + to + mode).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const base = mode === 'Train' ? 800 : 500;
  const variation = Math.sin(Date.now() / 3600000 + seed) * 300;
  return Math.round(base + Math.abs(variation));
}

// GET /api/v1/alerts - list all alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    
    // Update current prices dynamically
    const updatedAlerts = await Promise.all(alerts.map(async (a) => {
      const currentPrice = simulateCurrentPrice(a.from, a.to, a.mode);
      const status = currentPrice <= a.threshold ? 'triggered' : 'watching';
      
      // Save updated price and status if changed
      if (a.currentPrice !== currentPrice || a.status !== status) {
        a.currentPrice = currentPrice;
        a.status = status;
        await a.save();
      }
      return a;
    }));

    res.json({ alerts: updatedAlerts, count: updatedAlerts.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

// POST /api/v1/alerts - create new alert
router.post('/', async (req, res) => {
  try {
    const { from, to, mode, quota, threshold } = req.body;
    if (!from || !to || !mode || !threshold) {
      return res.status(400).json({ error: 'Missing required fields: from, to, mode, threshold' });
    }
    
    const count = await Alert.countDocuments();
    const currentPrice = simulateCurrentPrice(from, to, mode);
    const status = currentPrice <= Number(threshold) ? 'triggered' : 'watching';

    const newAlert = new Alert({
      id: `PA${String(count + 1).padStart(3, '0')}-${Date.now().toString(36)}`,
      route: `${from} → ${to}`,
      from, to, mode,
      quota: quota || 'Regular',
      threshold: Number(threshold),
      currentPrice,
      status
    });

    await newAlert.save();
    res.status(201).json(newAlert);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create alert' });
  }
});

// DELETE /api/v1/alerts/:id - delete alert
router.delete('/:id', async (req, res) => {
  try {
    const alert = await Alert.findOneAndDelete({ id: req.params.id });
    if (!alert) {
      return res.status(404).json({ error: 'Alert not found' });
    }
    res.json({ message: 'Alert deleted', id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete alert' });
  }
});

module.exports = router;
