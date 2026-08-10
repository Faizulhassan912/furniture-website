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

// Auto-migration on startup
import Product from './_models/Product.js';
mongoose.connection.once('open', async () => {
  try {
    const products = await Product.find({});
    let updatedCount = 0;
    for (const p of products) {
      let changed = false;
      if (p.dimensions) {
        if (p.dimensions.length && p.dimensions.length < 20) {
          p.dimensions.length = p.dimensions.length * 12;
          changed = true;
        }
        if (p.dimensions.width && p.dimensions.width < 20) {
          p.dimensions.width = p.dimensions.width * 12;
          changed = true;
        }
        if (p.dimensions.height && p.dimensions.height < 20) {
          p.dimensions.height = p.dimensions.height * 12;
          changed = true;
        }
        if (changed) {
          await p.save();
          updatedCount++;
        }
      }
    }
    if (updatedCount > 0) {
      console.log(`Auto-migrated ${updatedCount} products from feet to inches.`);
    }

    console.log('Running Automatic Price & Dimension Fixes...');
    
    // Queen Size Bunk Bed
    await Product.updateMany(
      { $or: [{ category: { $regex: /Queen Size Bunk Bed/i } }, { name: { $regex: /Queen Size Bunk Bed/i } }] },
      { $set: { price: 65000, 'dimensions.length': 90, 'dimensions.width': 78, 'dimensions.height': 66 } }
    );
    
    // Pilors Bunk Bed
    await Product.updateMany(
      { $or: [{ category: { $regex: /Pilor.*Bunk Bed/i } }, { name: { $regex: /Pilor.*Bunk Bed/i } }] },
      { $set: { price: 60000, 'dimensions.length': 96, 'dimensions.width': 42, 'dimensions.height': 66 } }
    );

    // Tub Bunk Bed
    await Product.updateMany(
      { $or: [{ category: { $regex: /Tub Bunk Bed/i } }, { name: { $regex: /Tub Bunk Bed/i } }] },
      { $set: { price: 55000, 'dimensions.length': 114, 'dimensions.width': 36, 'dimensions.height': 60 } }
    );

    // Simple Bunk Bed
    await Product.updateMany(
      { $or: [{ category: { $regex: /Simple Bunk Bed/i } }, { name: { $regex: /Simple Bunk Bed/i } }] },
      { $set: { price: 50000 } }
    );

    // Car Hut Bunk Bed
    await Product.updateMany(
      { $or: [{ category: { $regex: /Car Hut Bunk Bed/i } }, { name: { $regex: /Car Hut Bunk Bed/i } }] },
      { $set: { price: 50000 } }
    );

    // Babycots with crib (In DB, category is "With Cabin")
    await Product.updateMany(
      { category: "With Cabin" },
      { $set: { price: 35000, 'dimensions.length': 56, 'dimensions.width': 24, 'dimensions.height': 30 } }
    );
    
    // Babycots without crib (In DB, category is "Without Cabin")
    await Product.updateMany(
      { category: "Without Cabin" },
      { $set: { price: 30000, 'dimensions.length': 48, 'dimensions.width': 24, 'dimensions.height': 30 } }
    );

    // Remove height from Car Beds
    await Product.updateMany(
      { $or: [{ category: { $regex: /car bed/i } }, { name: { $regex: /car bed/i } }] },
      { $unset: { 'dimensions.height': "" } }
    );

    // Remove height from Single Beds
    await Product.updateMany(
      { $or: [{ category: { $regex: /single bed/i } }, { name: { $regex: /single bed/i } }] },
      { $unset: { 'dimensions.height': "" } }
    );

    console.log('✅ Automatic Price Fixes Applied Successfully!');

  } catch (error) {
    console.error("Auto-migration failed:", error);
  }
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
import chatRoutes from './_routes/chatRoutes.js';
import searchRoutes from './_routes/searchRoutes.js';

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
app.use('/api/chat', chatRoutes);
app.use('/api/smart-search', searchRoutes);

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
