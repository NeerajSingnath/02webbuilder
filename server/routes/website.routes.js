import express from 'express';
import { generateWebsite } from '../controllers/website.controller.js';
import isAuth from '../middlewares/isAuth.js';

const websiteRouter = express.Router();

// creating route for website creation
websiteRouter.post('/generate', isAuth, generateWebsite);

export default websiteRouter;
