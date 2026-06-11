import express from 'express';
import {
  googleAuth,
  logOut,
  verifyToken,
} from '../controllers/auth.controller.js';

// auth router - auth routes
const authRouter = express.Router();

// for google auth
authRouter.post('/google', googleAuth);

// for logout
authRouter.get('/logout', logOut);

// checks if user is logged in
// returns user if logged in
authRouter.get('/check', verifyToken);

export default authRouter;
