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
    validate: {
      validator: val => {
        return ['text', 'date', 'url', 'duration'].includes(val);
      },
      message: 'Type must be a valid string.',
    }
  },
  value: {
    required: true,
    type: String
  },
  security: {
    type: String,
    default: 'private',
    validate: {
      validator: val => {
        return ['private', 'public'].includes(val);
      },
      message: 'Privacy can only be private or public.',
    }
  }
}, { collection: 'config' });

module.exports = mongoose.model('Config', configSchema)