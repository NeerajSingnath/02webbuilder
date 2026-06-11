import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// authentication middleware
const isAuth = async (req, res, next) => {
  try {
    // gets the token from cookies
    const token = req.cookies.token;
    // if token not found then return error
    if (!token) {
      return res.status(401).json({ message: 'token not found' });
    }

    // verify token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    // find user
    const user = await User.findById(decoded.id);
    // if user not found then return error
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // attach user to request
    req.user = user;

    // call next middleware
    next();
  } catch (error) {
    // if error then return error
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default isAuth;
