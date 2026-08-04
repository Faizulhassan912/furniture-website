import express from 'express';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// @desc    Shuffle all products
// @route   GET /api/products/shuffle
// @access  Public (Temporary)
router.get('/shuffle', async (req, res) => {
  try {
    const products = await Product.find({}, '_id');
    const bulkOps = products.map(p => ({
      updateOne: {
        filter: { _id: p._id },
        update: { $set: { randomSeed: Math.random() } }
      }
    }));
    
    if (bulkOps.length > 0) {
      await Product.collection.bulkWrite(bulkOps);
    }
    res.json({ message: `Successfully shuffled ${bulkOps.length} products.` });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Fetch all products (with search and filters)
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page, limit } = req.query;
    
    // Build query object
    let query = {};

    // 1. Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // 2. Filter by category
    if (category && category !== 'All') {
      // Check if it's a parent category
      const subCategories = await Category.find({ parent: category });
      if (subCategories.length > 0) {
        // It's a parent category, so match either the parent name itself or any of its subcategories
        const catNames = subCategories.map(c => c.name);
        catNames.push(category);
        query.category = { $in: catNames };
      } else {
        // It's a sub category (or a parent with no subs)
        query.category = category;
      }
    }

    // 3. Filter by price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // If page is provided, we do pagination. Otherwise, return all matching products.
    if (page) {
      const pageNum = parseInt(page) || 1;
      const limitNum = parseInt(limit) || 24;
      const skip = (pageNum - 1) * limitNum;

      const total = await Product.countDocuments(query);
      const products = await Product.find(query)
        .sort({ randomSeed: -1 })
        .skip(skip)
        .limit(limitNum);

      return res.json({
        products,
        total,
        page: pageNum,
        totalPages: Math.ceil(total / limitNum)
      });
    } else {
      const products = await Product.find(query).sort({ randomSeed: -1 });
      res.json(products);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Fetch single product by slug
// @route   GET /api/products/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug });
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name, slug, category, description,
      length, width, height, material, finish, ageGroup, featured, price, stock
    } = req.body;

    const product = new Product({
      name,
      slug,
      category,
      description,
      dimensions: {
        length: length ? Number(length) : undefined,
        width: width ? Number(width) : undefined,
        height: height ? Number(height) : undefined,
      },
      material,
      finish,
      ageGroup,
      featured: featured === 'true' || featured === true,
      price: price ? Number(price) : 0,
      stock: stock ? Number(stock) : 0,
      image: req.files && req.files.length > 0 ? req.files[0].path : '/images/placeholder.jpg',
      images: req.files && req.files.length > 0 ? req.files.map(f => f.path) : ['/images/placeholder.jpg']
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data', error: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.findByIdAndDelete(req.params.id);
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
  try {
    const {
      name, slug, category, description,
      length, width, height, material, finish, ageGroup, featured, price, stock
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.slug = slug || product.slug;
      product.category = category || product.category;
      product.description = description || product.description;
      
      product.dimensions = {
        length: length ? Number(length) : product.dimensions.length,
        width: width ? Number(width) : product.dimensions.width,
        height: height ? Number(height) : product.dimensions.height,
      };
      
      product.material = material || product.material;
      product.finish = finish || product.finish;
      product.ageGroup = ageGroup || product.ageGroup;
      if (price !== undefined) product.price = Number(price);
      if (stock !== undefined) product.stock = Number(stock);
      
      if (featured !== undefined) {
        product.featured = featured === 'true' || featured === true;
      }

      if (req.files && req.files.length > 0) {
        // If they upload new images, we append them to the existing ones
        // Or if we want to replace them completely:
        // product.image = req.files[0].path;
        // product.images = req.files.map(f => f.path);
        
        // Let's assume uploading new images REPLACES the old ones for simplicity in this MVP
        product.image = req.files[0].path;
        product.images = req.files.map(f => f.path);
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Invalid product data', error: error.message });
  }
});

export default router;
