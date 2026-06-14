import express from 'express';
import {
  changes,
  generateWebsite,
  getAllWebsites,
  getWebsiteBYId,
} from '../controllers/website.controller.js';
import isAuth from '../middlewares/isAuth.js';

const websiteRouter = express.Router();

// creating route for website creation
websiteRouter.post('/generate', isAuth, generateWebsite);
websiteRouter.get('/getById/:id', isAuth, getWebsiteBYId);
websiteRouter.get('/getAll', isAuth, getAllWebsites);
websiteRouter.post('/update/:id', isAuth, changes);

export default websiteRouter;
