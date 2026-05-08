const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const SplitGroup = require('../models/SplitGroup');

// Helper to calculate settlements
function calculateGroupSettlements(group) {
  const groupObj = group.toObject();
  const total = groupObj.expenses.reduce((s, e) => s + e.amount, 0);
  const perPerson = groupObj.travelers.length > 0 ? total / groupObj.travelers.length : 0;
  const paidMap = {};
  
  groupObj.travelers.forEach(t => { paidMap[t.id] = 0; });
  groupObj.expenses.forEach(e => { if (paidMap[e.paidBy] !== undefined) paidMap[e.paidBy] += e.amount; });

  const balances = groupObj.travelers.map(t => ({ ...t, balance: (paidMap[t.id] || 0) - perPerson }));
  const settlements = [];
  const debtors = balances.filter(b => b.balance < -0.01).map(b => ({ ...b, owed: Math.abs(b.balance) }));
  const creditors = balances.filter(b => b.balance > 0.01).map(b => ({ ...b, owed: b.balance }));

  let di = 0, ci = 0;
  while (di < debtors.length && ci < creditors.length) {
    const amt = Math.min(debtors[di].owed, creditors[ci].owed);
    if (amt > 0.01) settlements.push({ from: debtors[di].name, to: creditors[ci].name, amount: Math.round(amt * 100) / 100 });
    debtors[di].owed -= amt;
    creditors[ci].owed -= amt;
    if (debtors[di].owed < 0.01) di++;
    if (creditors[ci].owed < 0.01) ci++;
  }

  return { ...groupObj, total, perPerson: Math.round(perPerson), settlements };
}

// POST /api/v1/split - create a new split group
router.post('/', async (req, res) => {
  try {
    const { name, travelers } = req.body;
    if (!name) return res.status(400).json({ error: 'Group name is required' });

    let code;
    let exists = true;
    while (exists) {
      code = crypto.randomBytes(3).toString('hex').toUpperCase();
      const existing = await SplitGroup.findOne({ code });
      if (!existing) exists = false;
    }

    const group = new SplitGroup({
      code,
      name,
      travelers: travelers || [{ id: 'T1', name: 'You' }],
      expenses: []
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create split group' });
  }
});

// GET /api/v1/split/:code - get split group by code
router.get('/:code', async (req, res) => {
  try {
    const group = await SplitGroup.findOne({ code: req.params.code.toUpperCase() });
    if (!group) return res.status(404).json({ error: 'Split group not found' });

    res.json(calculateGroupSettlements(group));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch split group' });
  }
});

// PUT /api/v1/split/:code/traveler - add traveler
router.put('/:code/traveler', async (req, res) => {
  try {
    const group = await SplitGroup.findOne({ code: req.params.code.toUpperCase() });
    if (!group) return res.status(404).json({ error: 'Split group not found' });

    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Traveler name is required' });

    const id = `T${group.travelers.length + 1}`;
    group.travelers.push({ id, name });
    
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add traveler' });
  }
});

// DELETE /api/v1/split/:code/traveler/:id - remove traveler
router.delete('/:code/traveler/:id', async (req, res) => {
  try {
    const group = await SplitGroup.findOne({ code: req.params.code.toUpperCase() });
    if (!group) return res.status(404).json({ error: 'Split group not found' });

    group.travelers = group.travelers.filter(t => t.id !== req.params.id);
    group.expenses = group.expenses.filter(e => e.paidBy !== req.params.id);
    
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove traveler' });
  }
});

// POST /api/v1/split/:code/expense - add expense
router.post('/:code/expense', async (req, res) => {
  try {
    const group = await SplitGroup.findOne({ code: req.params.code.toUpperCase() });
    if (!group) return res.status(404).json({ error: 'Split group not found' });

    const { desc, amount, paidBy } = req.body;
    if (!desc || !amount || !paidBy) return res.status(400).json({ error: 'desc, amount, and paidBy are required' });

    group.expenses.push({ id: `E${Date.now()}`, desc, amount: Number(amount), paidBy });
    
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// DELETE /api/v1/split/:code/expense/:expId - remove expense
router.delete('/:code/expense/:expId', async (req, res) => {
  try {
    const group = await SplitGroup.findOne({ code: req.params.code.toUpperCase() });
    if (!group) return res.status(404).json({ error: 'Split group not found' });

    group.expenses = group.expenses.filter(e => e.id !== req.params.expId);
    
    await group.save();
    res.json(group);
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove expense' });
  }
});

module.exports = router;
