const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  route: {
    type: String,
    required: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    required: true,
    enum: ['Train', 'Bus', 'Flight']
  },
  quota: {
    type: String,
    default: 'Regular'
  },
  threshold: {
    type: Number,
    required: true
  },
  currentPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['watching', 'triggered'],
    default: 'watching'
  },
  notified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
