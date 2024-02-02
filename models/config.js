const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
  key: {
    required: true,
    unique: true,
    type: String,
  },
  type: {
    required: false,
    type: String,
    default: 'text',
  },
  value: {
    required: true,
    type: String
  },
  security: {
    type: String,
    default: 'private'
  }
}, { collection: 'config' });

module.exports = mongoose.model('Config', configSchema)