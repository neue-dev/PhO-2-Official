const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
  number: {
    required: true,
    type: Number,
    validate: {
      validator: val => {
        return Math.floor(val) == Math.ceil(val);
      },
      message: 'Code number must be an integer.',
    },
  },
  alpha: {
    type: String,
    validate: {
      validator: val => {
        return val.match(/^[a-z]{0,1}$/);
      },
      message: 'Alpha string must only have alphabetic characters.',
    }
  },
});

const answerSchema = new mongoose.Schema({
  mantissa: {
    required: true,
    type: Number,
    validate: {
      validator: val => {
        if(Math.abs(val) > 10 || Math.abs(val) < 1){
          if(val == 0) 
            return true;
          return false;
        }
      },
      message: 'Mantissa must be between 1 and 10.',
    },
  },
  exponent: {
    required: true,
    type: Number,
    validate: {
      validator: val => {
        return Math.floor(val) == Math.ceil(val);
      },
      message: 'Exponent must be an integer.',
    },
  }
});

const problemSchema = new mongoose.Schema({
  name: {
    required: true,
    unique: true,
    type: String
  },
  code: {
    required: true,
    type: codeSchema,
  },
  answer: {
    required: true,
    type: answerSchema,
  },
  tolerance: {
    required: true,
    type: Number,
    default: 0.01,
  },
  points: {
    required: true,
    type: Number,
    default: 5,
  },
  status: {
    required: true,
    type: String,
    default: 'active',
    validate: {
      validator: val => {
        return ['active', 'disabled'].includes(val);
      },
      message: 'Status must be a valid string.',
    }
  }
}, { collection: 'problems' });

module.exports = mongoose.model('Problem', problemSchema);