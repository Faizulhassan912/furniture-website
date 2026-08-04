import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import Category from '../api/_models/Category.js';
import Product from '../api/_models/Product.js';

const categories = [
  { name: 'Beds', desc: 'Beautiful custom beds for kids', status: 'Active', image: '/images/bunk-bed-1.jpg' },
  { name: 'Desks', desc: 'Study desks that inspire', status: 'Active', image: '/images/almary-1.jpg' },
  { name: 'Storage', desc: 'Wardrobes and toy storage', status: 'Active', image: '/images/bunk-bed-2.jpg' }
];

const products = [
  {
    name: 'Adventure Bunk Bed',
    slug: 'adventure-bunk-bed',
    category: 'Beds',
    description: 'A magical bunk bed that brings adventure to your kids room. Solid wood construction ensures safety and durability.',
    dimensions: { length: 75, width: 42, height: 65 },
    material: 'Pine Wood',
    finish: 'Natural Matte',
    ageGroup: '4-12 years',
    colors: ['Natural Wood', 'White', 'Navy Blue'],
    featured: true,
    price: 45000,
    stock: 5,
    image: '/images/bunk-bed-1.jpg',
    images: ['/images/bunk-bed-1.jpg', '/images/bunk-bed-2.jpg']
  },
  {
    name: 'Creative Study Desk',
    slug: 'creative-study-desk',
    category: 'Desks',
    description: 'Perfect for homework and arts & crafts. Features built-in storage and an adjustable height chair.',
    dimensions: { length: 48, width: 24, height: 30 },
    material: 'Birch Plywood',
    finish: 'Glossy White',
    ageGroup: '6-14 years',
    colors: ['White', 'Pastel Pink', 'Mint Green'],
    featured: true,
    price: 25000,
    stock: 10,
    image: '/images/almary-1.jpg',
    images: ['/images/almary-1.jpg']
  },
  {
    name: 'Car Racing Bed',
    slug: 'car-racing-bed',
    category: 'Beds',
    description: 'Speed into dreamland with our awesome car racing bed! Perfect for little racers.',
    dimensions: { length: 80, width: 45, height: 25 },
    material: 'MDF',
    finish: 'Glossy Red',
    ageGroup: '3-8 years',
    colors: ['Racing Red', 'Blue', 'Black'],
    featured: false,
    price: 55000,
    stock: 2,
    image: '/images/car-bed-1.jpg',
    images: ['/images/car-bed-1.jpg']
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    await Category.deleteMany();
    await Product.deleteMany();
    console.log('Cleared existing data.');

    await Category.insertMany(categories);
    console.log('Categories seeded.');

    await Product.insertMany(products);
    console.log('Products seeded.');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
