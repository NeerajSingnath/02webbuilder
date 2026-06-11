import express from 'express';
import { getCurrentUser } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';

const userRouter = express();

userRouter.get('/me', isAuth, getCurrentUser);

export default userRouter;
