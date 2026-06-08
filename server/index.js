import express from 'express';
import dotenv from 'dotenv';
import dns from 'node:dns';
import dbConnect from './config/db.js';

dotenv.config();
dns.setServers(['1.1.1.1', '8.8.8.8']);

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  dbConnect();
});
