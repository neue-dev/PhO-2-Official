const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const messageSchema = new mongoose.Schema({
  // key: {
  //   required: true,
  //   unique: true,
  //   type: String,
  // },
  // type: {
  //   required: false,
  //   type: String,
  //   default: 'text',
  // },
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