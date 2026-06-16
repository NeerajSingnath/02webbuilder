import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import dns from 'node:dns';
import dbConnect from './config/db.js';
import { stripeWebhook } from './controllers/stripeWebhook.controller.js';
import authRouter from './routes/auth.routes.js';
import billingRouter from './routes/billing.route.js';
import userRouter from './routes/user.routes.js';
import websiteRouter from './routes/website.routes.js';
// loading env variables
dotenv.config();

// setting dns - for faster requests
dns.setServers(['1.1.1.1', '8.8.8.8']);

// main app
const app = express();

app.post(
  '/api/stripe/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook,
);

// port
const PORT = process.env.PORT;

// basic middleware - for accepting json and url-encoded data
// also for accepting cookies

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// for allowing requests from frontend
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

// console.log(process.env.OPENROUTER_API_KEY);

// api routes
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/website', websiteRouter);
app.use('/api/billing', billingRouter);

// listen server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  app.get('/', (req, res) => {
    return res.send('hello');
  });

  // connecting to database
  dbConnect();
});
