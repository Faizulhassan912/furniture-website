import express from 'express';
import Content from '../models/Content.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get content by type (Public)
router.get('/:type', async (req, res) => {
  try {
    const content = await Content.findOne({ type: req.params.type });
    if (content) {
      res.json(content.data);
    } else {
      res.json({}); // Return empty object if not found so frontend doesn't break
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Upsert content by type (Admin only)
router.put('/:type', protect, admin, async (req, res) => {
  try {
    const { type } = req.params;
    const { data } = req.body;
    
    let content = await Content.findOne({ type });
    
    if (content) {
      content.data = data;
      await content.save();
    } else {
      content = new Content({ type, data });
      await content.save();
    }
    
    res.json(content);
  } catch (error) {
    res.status(400).json({ message: 'Error saving content' });
  }
});

export default router;
