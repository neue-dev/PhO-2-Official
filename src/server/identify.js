import { User } from '../models/user.js';

//* User identification
export const identify = async (_id) => {
  const user = await User.findOne({ _id: _id });

  if(user)
    return user;
  return false;
}

export default {
  identify,
}