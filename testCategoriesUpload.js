import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import categoryRoutes from './api/routes/categoryRoutes.js';
import mongoose from 'mongoose';
import User from './api/models/User.js';

const app = express();
app.use(express.json());

// mock auth middleware
app.use((req, res, next) => {
  req.user = { isAdmin: true, _id: new mongoose.Types.ObjectId() };
  next();
});

app.use('/api/categories', categoryRoutes);

app.use((err, req, res, next) => {
  console.log("Global err:", err.message);
  res.status(500).json({ message: err.message });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  const server = app.listen(5003, async () => {
    try {
      const fd = new FormData();
      fd.append('name', 'TestCatFinal_' + Date.now());
      const blob = new Blob(['fake image content'], { type: 'image/png' });
      fd.append('image', blob, 'test.png');
      
      const res = await fetch('http://localhost:5003/api/categories', {
        method: 'POST',
        body: fd
      });
      console.log('Status:', res.status);
      console.log('Response:', await res.text());
    } catch (e) {
      console.error(e);
    } finally {
      server.close();
      mongoose.disconnect();
    }
  });
});
