import express from 'express';
import Review from '../models/Review.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

// Get all reviews (Admin gets all, public gets only approved)
router.get('/', async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { status: 'Approved' };
    
    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;

    const total = await Review.countDocuments(filter);
    
    const reviews = await Review.find(filter)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);

    res.json({
      reviews,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create a review (Public)
router.post('/', async (req, res) => {
  try {
    const { customer, product, rating, comment } = req.body;
    const review = new Review({
      customer,
      product,
      rating,
      comment
    });
    const createdReview = await review.save();
    res.status(201).json(createdReview);
  } catch (error) {
    res.status(400).json({ message: 'Error creating review', error: error.message });
  }
});

// Update review status / showOnHome (Admin only)
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      if (req.body.status !== undefined) review.status = req.body.status;
      if (req.body.showOnHome !== undefined) review.showOnHome = req.body.showOnHome;
      
      const updatedReview = await review.save();
      res.json(updatedReview);
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating review' });
  }
});

// Delete review (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (review) {
      await review.deleteOne();
      res.json({ message: 'Review removed' });
    } else {
      res.status(404).json({ message: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
