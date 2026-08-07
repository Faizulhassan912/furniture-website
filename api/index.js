import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

// Fix querySrv ECONNREFUSED issues on Windows / local ISP DNS blocking (only locally)
if (!process.env.VERCEL) {
  try {
    dns.setServers(['8.8.8.8', '8.8.4.4']);
  } catch (e) {
    console.log('Could not set custom DNS servers:', e.message);
  }
}

// Load environment variables from .env file
dotenv.config();

// 1. Initialize the Express application
const app = express();

// 2. Add Middleware
app.use(cors());
app.use(express.json());

// Database connection middleware for Serverless & Express
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI);
      console.log("Connected to MongoDB Atlas successfully!");
    } catch (err) {
      console.error("Database connection error:", err.message);
      return res.status(500).json({ message: "Database connection failed", error: err.message });
    }
  }
  next();
});

import authRoutes from './_routes/authRoutes.js';
import productRoutes from './_routes/productRoutes.js';
import messageRoutes from './_routes/messageRoutes.js';
import orderRoutes from './_routes/orderRoutes.js';
import categoryRoutes from './_routes/categoryRoutes.js';
import reviewRoutes from './_routes/reviewRoutes.js';
import contentRoutes from './_routes/contentRoutes.js';
import dashboardRoutes from './_routes/dashboardRoutes.js';
import uploadRoutes from './_routes/uploadRoutes.js';
import aiRoutes from './_routes/aiRoutes.js';

// Setup routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/test', (req, res) => {
  res.json({
    message: 'Hello from S&S Kids Furniture API!',
    status: 'success'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Express Error:', err.message);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});



// Only listen on port if NOT running on Vercel (Vercel manages HTTP serverless invocations)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;
