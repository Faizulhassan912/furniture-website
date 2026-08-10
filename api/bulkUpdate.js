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
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');

    let res;

    // Queen Size Bunk Bed
    res = await Product.updateMany(
      { name: { $regex: /Queen Size Bunk Bed/i } },
      { $set: { price: 65000, 'dimensions.length': 90, 'dimensions.width': 78, 'dimensions.height': 66 } }
    );
    console.log(`Updated Queen Size Bunk Bed: ${res.modifiedCount}`);
    
    // Pilor Bunk Bed
    res = await Product.updateMany(
      { name: { $regex: /Pil(o|la)r Bunk Bed/i } },
      { $set: { price: 60000, 'dimensions.length': 96, 'dimensions.width': 42, 'dimensions.height': 66 } }
    );
    console.log(`Updated Pilor Bunk Bed: ${res.modifiedCount}`);

    // Tub Bunk Bed
    res = await Product.updateMany(
      { name: { $regex: /Tub Bunk Bed/i } },
      { $set: { price: 55000, 'dimensions.length': 114, 'dimensions.width': 36, 'dimensions.height': 60 } }
    );
    console.log(`Updated Tub Bunk Bed: ${res.modifiedCount}`);

    // Simple Bunk Bed
    res = await Product.updateMany(
      { name: { $regex: /Simple Bunk Bed/i } },
      { $set: { price: 50000 } }
    );
    console.log(`Updated Simple Bunk Bed: ${res.modifiedCount}`);

    // Car Hut Bunk Bed
    res = await Product.updateMany(
      { name: { $regex: /Car Hut Bunk Bed/i } },
      { $set: { price: 50000 } }
    );
    console.log(`Updated Car Hut Bunk Bed: ${res.modifiedCount}`);

    // Babycots with crib
    res = await Product.updateMany(
      { name: { $regex: /Babycot.*with crib/i } },
      { $set: { price: 35000, 'dimensions.length': 56, 'dimensions.width': 24, 'dimensions.height': 30 } }
    );
    console.log(`Updated Babycots with crib: ${res.modifiedCount}`);
    
    // Babycots without crib
    res = await Product.updateMany(
      { name: { $regex: /Babycot.*without crib/i } },
      { $set: { price: 30000, 'dimensions.length': 48, 'dimensions.width': 24, 'dimensions.height': 30 } }
    );
    console.log(`Updated Babycots without crib: ${res.modifiedCount}`);

    // Remove height from Car Beds (category or name)
    res = await Product.updateMany(
      { $or: [{ category: { $regex: /car bed/i } }, { name: { $regex: /car bed/i } }] },
      { $unset: { 'dimensions.height': "" } }
    );
    console.log(`Updated Car Beds: ${res.modifiedCount}`);

    // Remove height from Single Beds
    res = await Product.updateMany(
      { $or: [{ category: { $regex: /single bed/i } }, { name: { $regex: /single bed/i } }] },
      { $unset: { 'dimensions.height': "" } }
    );
    console.log(`Updated Single Beds: ${res.modifiedCount}`);

    // Wardrobe Full Double Door
    res = await Product.updateMany(
      { name: { $regex: /Wardrobe Full Double Door/i } },
      { $set: { 'dimensions.length': 16, 'dimensions.width': 36, 'dimensions.height': 60 } }
    );
    console.log(`Updated Wardrobe Full Double Door: ${res.modifiedCount}`);

    // Wardrobe Double Door
    res = await Product.updateMany(
      { name: { $regex: /Wardrobe Double Door/i } },
      { $set: { 'dimensions.length': 16, 'dimensions.width': 36, 'dimensions.height': 60 } }
    );
    console.log(`Updated Wardrobe Double Door: ${res.modifiedCount}`);

    // Wardrobe Triple Door
    res = await Product.updateMany(
      { name: { $regex: /Wardrobe Triple Door/i } },
      { $set: { 'dimensions.length': 24, 'dimensions.width': 48, 'dimensions.height': 72 } }
    );
    console.log(`Updated Wardrobe Triple Door: ${res.modifiedCount}`);

    // Dressing table - remove depth (length) and height
    res = await Product.updateMany(
      { $or: [{ category: { $regex: /dressing/i } }, { name: { $regex: /dressing/i } }] },
      { $unset: { 'dimensions.length': "", 'dimensions.height': "" } }
    );
    console.log(`Updated Dressing Tables: ${res.modifiedCount}`);

    console.log('Update Complete');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
