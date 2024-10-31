import mongoose from 'mongoose'
const ObjectId = mongoose.Schema.Types.ObjectId;

const scoreSchema = new mongoose.Schema({
  user_id : {
    required: true,
    unique: true,
    type: ObjectId,
  },
  score: {
    type: Number,
    default: 0,
  },
  baseScore: {
    type: Number,
    default: 0,
  },
  correctSubmissions: {
    type: Array,
    default: [],
  }
}, { collection: 'scores' });

export const Score = mongoose.model('Score', scoreSchema);

export default { Score }
