import express from 'express';
import {
  generateWebsite,
  getWebsiteBYId,
} from '../controllers/website.controller.js';
import isAuth from '../middlewares/isAuth.js';

const websiteRouter = express.Router();

// creating route for website creation
websiteRouter.post('/generate', isAuth, generateWebsite);
websiteRouter.get('/getById/:id', isAuth, getWebsiteBYId);

export default websiteRouter;
