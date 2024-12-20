import mongoose from 'mongoose'
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
  problem_id: {
    required: true,
    type: ObjectId,
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

export const Submission = mongoose.model('Submission', submissionSchema);

export default { Submission }