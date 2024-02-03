const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema({
  // key: {
  //   required: true,
  //   unique: true,
  //   type: String,
  // },
  type: {
    required: true,
    type: String,
    default: 'message',
    validate: {
      validator: val => {
        return ['message', 'reply', 'announcement', 'notification', 'clarification'].includes(val);
      },
      message: 'Type must be a valid string.',
    },
  },
  // value: {
  //   required: true,
  //   type: String
  // },
  // security: {
  //   type: String,
  //   default: 'private'
  // }
}, { collection: 'messages' });

module.exports = mongoose.model('Message', messageSchema)