require('dotenv').config();

const jwt = require('jsonwebtoken');

//* Token creation
const generate = function(user){
  return jwt.sign(
    { _id: user._id, }, 
    process.env.ACCESS_TOKEN_SECRET,
    // { expiresIn: '15m' }
  );
}

//* Refresh token creation
const refresh = function(user){
  return jwt.sign(
    { _id: user._id, }, 
    process.env.REFRESH_TOKEN_SECRET,
  );
}

//* Token verification
const auth = (req, res) => {
  if(!req) return false;

  // Not logged in yet
  if(!req.cookies['authorization']) return false;
  
  // Retrieve tokens
  const { accessToken, refreshToken } = req.cookies['authorization'];

  // If no token is present, redirect to home page
  if (!accessToken) return false;

  // Verify token
  try {
    const user = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    
    return user;
    
  } catch (error) {
    // Token is probably invalid
    return false;
  }
};

module.exports = { generate, auth, refresh };