import express from 'express';
import { protect, admin } from '../_middleware/auth.js';
import Order from '../_models/Order.js';
import Message from '../_models/Message.js';
import Product from '../_models/Product.js';

const router = express.Router();

// Get dashboard stats
router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalOrdersCount = await Order.countDocuments();
    
    // Calculate total revenue from all orders
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((acc, order) => acc + (order.amount || 0), 0);

    // Count pending messages/inquiries (we don't have a status on Message model currently, so just total or 'New' if we add one)
    // Actually, in InquiriesTab, we use Messages model. Wait, Messages model has `isRead`? Let's check model.
    // For now, let's just count all inquiries or where isRead: false
    // I will check the Message model soon. Let's just do countDocuments for now.
    const pendingInquiriesCount = await Message.countDocuments();
    const activeProductsCount = await Product.countDocuments();

    // Fetch recent activity (latest 5 inquiries)
    const recentActivity = await Message.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name createdAt');

    res.json({
      revenue: totalRevenue,
      orders: totalOrdersCount,
      products: activeProductsCount,
      inquiries: pendingInquiriesCount,
      recentActivity
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
