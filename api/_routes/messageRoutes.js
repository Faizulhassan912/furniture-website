import express from 'express';
import Message from '../_models/Message.js';
import { protect } from '../_middleware/auth.js';

const router = express.Router();

// @desc    Submit a new message
// @route   POST /api/messages
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, phone, subject, message } = req.body;
    
    if (!name || !phone || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const newMessage = new Message({
      name,
      phone,
      subject: subject || 'General Inquiry',
      message
    });

    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Get all messages
// @route   GET /api/messages
// @access  Private/Admin
router.get('/', protect, async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update message status
// @route   PUT /api/messages/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message) {
      message.status = req.body.status || message.status;
      const updatedMessage = await message.save();
      res.json(updatedMessage);
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (message) {
      await Message.findByIdAndDelete(req.params.id);
      res.json({ message: 'Message removed' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

export default router;
