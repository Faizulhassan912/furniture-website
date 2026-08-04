import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import categoryRoutes from './api/routes/categoryRoutes.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const app = express();
app.use(express.json());

app.use('/api/categories', categoryRoutes);

app.use((err, req, res, next) => {
  console.log("Global err:", err.message);
  res.status(500).json({ message: err.message });
});

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // get admin user from DB
  const User = mongoose.model('User');
  const adminUser = await User.findOne({ isAdmin: true });
  
  if (!adminUser) {
    console.log("No admin user found!");
    process.exit(1);
  }

  const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const server = app.listen(5004, async () => {
    try {
      const fd = new FormData();
      fd.append('name', 'TestCatFinal_' + Date.now());
      const blob = new Blob(['fake image content'], { type: 'image/png' });
      fd.append('image', blob, 'test.png');
      
      const res = await fetch('http://localhost:5004/api/categories', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
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
