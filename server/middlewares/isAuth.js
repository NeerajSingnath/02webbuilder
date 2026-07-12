import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// authentication middleware
const isAuth = async (req, res, next) => {
  try {
    // gets the token from cookies
    const token = req.cookies.token;
    // if token not found then return error
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: No token provided' });
    }
    console.log('here');

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // find user
    const user = await User.findById(decoded.id);
    // if user not found then return error
    if (!user) {
      console.log('user not found');
      return res.status(401).json({ user: null });
    }
    // console.log(user);
    // attach user to request
    req.user = user;
    req.userId = user._id;

    // call next middleware
    next();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res
        .status(401)
        .json({ message: 'Unauthorized: Invalid or expired token' });
    }
    // if error then return error
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export default isAuth;
