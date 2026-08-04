import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './api/models/User.js';
import dotenv from 'dotenv';
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sskids.com', password: 'password' })
    });
    let token;
    try {
      const loginData = await loginRes.json();
      token = loginData.token;
    } catch(e) {}
    
    // Fallback: manually sign token if login fails
    if (!token) {
      console.log('Using manual token');
      const User = mongoose.model('User');
      const admin = await User.findOne({ isAdmin: true });
      if (!admin) throw new Error("No admin user");
      token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    }

    const fd = new FormData();
    fd.append('name', 'BigTestCat_' + Date.now());
    fd.append('desc', 'Test');
    
    // create 6MB file
    const buffer = new Uint8Array(6 * 1024 * 1024);
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    fd.append('image', blob, 'bigbed.jpg');

    console.log('Sending request...');
    const res = await fetch('http://localhost:5000/api/categories', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: fd
    });
    
    console.log('Status:', res.status);
    console.log('Response:', await res.text());
  } catch (err) {
    console.error(err);
  }
}
run();
