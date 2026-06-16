import express from 'express';
import {
  changes,
  deploy,
  generateWebsite,
  getAllWebsites,
  getBySlug,
  getWebsiteBYId,
} from '../controllers/website.controller.js';
import isAuth from '../middlewares/isAuth.js';

const websiteRouter = express.Router();

// creating route for website creation
websiteRouter.post('/generate', isAuth, generateWebsite);
websiteRouter.get('/getById/:id', isAuth, getWebsiteBYId);
websiteRouter.get('/getAll', isAuth, getAllWebsites);
websiteRouter.post('/update/:id', isAuth, changes);
websiteRouter.post('/deploy/:id', isAuth, deploy);
websiteRouter.get('/getbySlug/:slug', isAuth, getBySlug);

export default websiteRouter;
