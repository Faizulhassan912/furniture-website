import express from 'express';
import Order from '../models/Order.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Get all orders (Admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create new order (can be from inquiry conversion or manual entry)
// Includes optional image upload for custom orders
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { customer, phone, address, productType, productName, customDesc, amount, advance } = req.body;
    
    const orderData = {
      customer,
      phone,
      address,
      productType,
      productName,
      customDesc,
      amount,
      advance: advance || 0
    };

    if (req.file) {
      orderData.image = req.file.path;
    }

    const order = new Order(orderData);
    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order Creation Error:', error);
    res.status(400).json({ message: 'Error creating order', error: error.message });
  }
});

// Update order status
router.put('/:id/status', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.status = req.body.status || order.status;
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating order' });
  }
});

// Delete order
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order) {
      await order.deleteOne();
      res.json({ message: 'Order removed' });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
