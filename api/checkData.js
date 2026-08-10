import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Product from './_models/Product.js';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    const categories = await Product.distinct('category');
    console.log('Categories:', categories);
    
    const products = await Product.find({}, 'name category price dimensions');
    products.forEach(p => {
      console.log(`- ${p.name} (Cat: ${p.category}) [Price: ${p.price}]`);
    });

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
