import express from 'express';
import Category from '../_models/Category.js';
import { protect, admin } from '../_middleware/auth.js';
import { upload } from '../_config/cloudinary.js';

const router = express.Router();

// Get all categories (Public)
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create category (Admin only)
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, desc, parent, status } = req.body;
    
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = new Category({
      name,
      desc,
      parent: parent || 'None',
      status: status || 'Active',
      image: req.file ? req.file.path : ''
    });

    const createdCategory = await category.save();
    res.status(201).json(createdCategory);
  } catch (error) {
    res.status(400).json({ message: 'Error creating category', error: error.message });
  }
});

// Delete category (Admin only)
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      await category.deleteOne();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update category (Admin only)
router.put('/:id', protect, admin, upload.single('image'), async (req, res) => {
  try {
    const { name, desc, parent, status } = req.body;
    const category = await Category.findById(req.params.id);

    if (category) {
      category.name = name || category.name;
      category.desc = desc !== undefined ? desc : category.desc;
      category.parent = parent || category.parent;
      category.status = status || category.status;
      
      if (req.file) {
        category.image = req.file.path;
      }

      const updatedCategory = await category.save();
      res.json(updatedCategory);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Error updating category', error: error.message });
  }
});

export default router;
