import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

// creates user if not exists
// then sends token
// this is use for google auth

export const googleAuth = async (req, res) => {
  try {
    // checking if name email and avatar is present
    const { name, email, avatar } = req.body;
    if (!name || !email || !avatar) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }
    // checking if user already exists
    let user = await User.findOne({ email });

    // if not exists then create
    if (!user) {
      user = await User.create({
        name,
        email,
        avatar,
      });
    }

    // signing token
    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // setting cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true when deploying
      sameSite: 'strict', // set to 'none' when deploying
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // sending response
    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    // sending error response
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// clears token
// use for logout
export const logOut = async (req, res) => {
  try {
    // clearing cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: false, // set to true when deploying
      sameSite: 'strict', // set to 'none' when deploying
    });

    // sending response
    return res.status(200).json({
      success: true,
      message: 'User logged out successfully',
    });
  } catch (error) {
    // sending error response
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};

// verifying token
export const verifyToken = async (req, res) => {
  try {
    // checking if token is present
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not logged in',
      });
    }
    // verifying token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    // finding user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // sending response
    return res.status(200).json({
      success: true,
      message: 'User verified successfully',
      user,
    });
  } catch (error) {
    // sending error response
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
