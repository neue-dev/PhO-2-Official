const User = require('../models/user');

//* User identification
const identify = async (_id) => {
  const user = await User.findOne({ _id: _id });

  if(user)
    return user;
  return false;
}

module.exports = identify;