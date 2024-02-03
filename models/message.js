const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema({
  user_id: {
    required: true,
    type: ObjectId,
  },
  //! add a privacy parameter or something
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
  subject: {
    required: true,
    type: String,
  },
  content: {
    required: true,
    type: String,
  },
  parent_id: {
    type: ObjectId,
  }
}, { collection: 'messages' });

module.exports = mongoose.model('Message', messageSchema)