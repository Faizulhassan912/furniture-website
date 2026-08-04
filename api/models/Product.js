import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
  },
  stock: {
    type: Number,
    default: 0,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  material: String,
  finish: String,
  ageGroup: String,
  features: [String],
  colors: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
    required: true,
  },
  images: [String],
  randomSeed: {
    type: Number,
    default: () => Math.random()
  }
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
