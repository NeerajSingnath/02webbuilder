import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const googleAuth = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;
    if (!name || !email || !avatar) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        name,
        email,
        avatar,
      });
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: false, // set to true when deploying
      sameSite: 'strict', // set to 'none' when deploying
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message,
    });
  }
};
