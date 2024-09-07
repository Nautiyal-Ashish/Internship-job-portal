const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; //token nikalna 
  // token aise hi nhi ja sakta array ke through bhejna padega
  if (!authHeader || !authHeader.startsWith('Bearer')) { //ye bearer token ke sath ek array main jayega 
    return res.status(403).json({ msg: "Not an authenticated user" })
  }
  const token = authHeader.split(' ')[1]; //is line main jo array upar ban rha hai usme se token nikal rahe hai

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    if (!decoded) {
      return res.status(500).json({ msg: "Not an authenticated user" })
    }
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Token is not valid" })
  }
};

module.exports = authMiddleware;