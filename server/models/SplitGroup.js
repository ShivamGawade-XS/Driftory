const mongoose = require('mongoose');

const splitGroupSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  travelers: [{
    id: String,
    name: String
  }],
  expenses: [{
    id: String,
    desc: String,
    amount: Number,
    paidBy: String
  }]
}, { timestamps: true });

module.exports = mongoose.model('SplitGroup', splitGroupSchema);
