const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

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

const submissionSchema = new mongoose.Schema({
  user_id: {
    required: true,
    type: ObjectId,
  },
  username: {
    type: String,
  },
  problem_id: {
    required: true,
    type: ObjectId,
  },
  problemCodeName: {
    type: String,
  },
  answer: {
    required: true,
    type: answerSchema,
  },
  verdict: {
    required: true,
    type: String,
    default: 'wrong',
    validate: {
      validator: val => {
        return ['correct', 'wrong'].includes(val);
      },
      message: 'Verdict must be a valid string.',
    }
  },
  timestamp: {
    required: true,
    type: Number,
  }
}, { collection: 'submissions' });

module.exports = mongoose.model('Submission', submissionSchema);