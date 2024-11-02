import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  username: {
    required: true,
    unique: true,
    type: String,
  },
  password: {
    required: true,
    type: String
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  category: {
    required: true,
    type: String,
    default: 'junior',
    validate: {
      validator: val => {
        return ['junior', 'senior', 'open'].includes(val);
      },
      message: 'Category must be a valid string.',
    },
  },
  status: {
    required: true,
    type: String,
    default: 'participating',
    validate: {
      validator: val => {
        return ['participating', 'disqualified', 'spectating'].includes(val);
      },
      message: 'Status must be a valid string.',
    },
  },
  muted: {
    type: Boolean,
    default: false,
  },
}, { collection: 'users' });

export const User = mongoose.model('User', userSchema)

export default { User }