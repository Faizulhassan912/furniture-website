import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

import Product from './_models/Product.js';

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Queen Size Bunk Bed
    await Product.updateMany(
      { $or: [{ category: { $regex: /Queen Size Bunk Bed/i } }, { name: { $regex: /Queen Size Bunk Bed/i } }] },
      { $set: { price: 65000, 'dimensions.length': 90, 'dimensions.width': 78, 'dimensions.height': 66 } }
    );
    
    // Pilors Bunk Bed (matching exact category from screenshot)
    await Product.updateMany(
      { $or: [{ category: { $regex: /Pilor.*Bunk Bed/i } }, { name: { $regex: /Pilor.*Bunk Bed/i } }] },
      { $set: { price: 60000, 'dimensions.length': 96, 'dimensions.width': 42, 'dimensions.height': 66 } }
    );

    // Tub Bunk Bed
    await Product.updateMany(
      { $or: [{ category: { $regex: /Tub Bunk Bed/i } }, { name: { $regex: /Tub Bunk Bed/i } }] },
      { $set: { price: 55000, 'dimensions.length': 114, 'dimensions.width': 36, 'dimensions.height': 60 } }
    );

    // Simple Bunk Bed
    await Product.updateMany(
      { $or: [{ category: { $regex: /Simple Bunk Bed/i } }, { name: { $regex: /Simple Bunk Bed/i } }] },
      { $set: { price: 50000 } }
    );

    // Car Hut Bunk Bed
    await Product.updateMany(
      { $or: [{ category: { $regex: /Car Hut Bunk Bed/i } }, { name: { $regex: /Car Hut Bunk Bed/i } }] },
      { $set: { price: 50000 } }
    );

    // Babycots with crib
    await Product.updateMany(
      { $or: [{ category: { $regex: /Babycot.*with.*crib/i } }, { name: { $regex: /Babycot.*with.*crib/i } }] },
      { $set: { price: 35000, 'dimensions.length': 56, 'dimensions.width': 24, 'dimensions.height': 30 } }
    );
    
    // Babycots without crib
    await Product.updateMany(
      { $or: [{ category: { $regex: /Babycot.*without.*crib/i } }, { name: { $regex: /Babycot.*without.*crib/i } }] },
      { $set: { price: 30000, 'dimensions.length': 48, 'dimensions.width': 24, 'dimensions.height': 30 } }
    );

    // Remove height from Car Beds
    await Product.updateMany(
      { $or: [{ category: { $regex: /car bed/i } }, { name: { $regex: /car bed/i } }] },
      { $unset: { 'dimensions.height': "" } }
    );

    // Remove height from Single Beds
    await Product.updateMany(
      { $or: [{ category: { $regex: /single bed/i } }, { name: { $regex: /single bed/i } }] },
      { $unset: { 'dimensions.height': "" } }
    );

    // Wardrobe Full Double Door
    await Product.updateMany(
      { $or: [{ category: { $regex: /Wardrobe Full Double Door/i } }, { name: { $regex: /Wardrobe Full Double Door/i } }] },
      { $set: { 'dimensions.length': 16, 'dimensions.width': 36, 'dimensions.height': 60 } }
    );

    // Wardrobe Double Door
    await Product.updateMany(
      { $or: [{ category: { $regex: /Wardrobe Double Door/i } }, { name: { $regex: /Wardrobe Double Door/i } }] },
      { $set: { 'dimensions.length': 16, 'dimensions.width': 36, 'dimensions.height': 60 } }
    );

    // Wardrobe Triple Door
    await Product.updateMany(
      { $or: [{ category: { $regex: /Wardrobe Triple Door/i } }, { name: { $regex: /Wardrobe Triple Door/i } }] },
      { $set: { 'dimensions.length': 24, 'dimensions.width': 48, 'dimensions.height': 72 } }
    );

    // Dressing table - remove depth (length) and height
    await Product.updateMany(
      { $or: [{ category: { $regex: /dressing/i } }, { name: { $regex: /dressing/i } }] },
      { $unset: { 'dimensions.length': "", 'dimensions.height': "" } }
    );

    // Dump current status to a file so I can verify
    const products = await Product.find({}, 'name category price dimensions');
    let dumpStr = '';
    products.forEach(p => {
      dumpStr += `${p.name} | Cat: ${p.category} | Rs ${p.price} | Dim: ${JSON.stringify(p.dimensions)}\n`;
    });
    fs.writeFileSync(path.join(__dirname, 'data-dump.txt'), dumpStr);

    console.log('Update Complete 2.0');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
