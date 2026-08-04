import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// We need to point to the backend .env
dotenv.config();

// Make sure to load the schema first. The script is run from project root, so we point to api/models/Product.js
import Product from '../api/models/Product.js';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'ss_kids_furniture',
      resource_type: 'image',
    });
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${filePath}:`, error);
    return null;
  }
};

const DIRS = [
  { path: 'D:\\Furniture Pictures\\AI Pictures\\Bunk Beds', mainCategory: 'Bunk Beds' },
  { path: 'D:\\Furniture Pictures\\AI Pictures\\Babycot', mainCategory: 'Babycots' },
  { path: 'D:\\Furniture Pictures\\AI Pictures\\Car Beds', mainCategory: 'Car Beds' },
  { path: 'D:\\Furniture Pictures\\AI Pictures\\Single Beds', mainCategory: 'Single Beds' },
  { path: 'D:\\Furniture Pictures\\AI Pictures\\Study Table &', mainCategory: 'Study Table' },
  { path: 'D:\\Furniture Pictures\\Colour_Almary', mainCategory: 'Wardrobe' }
];

const parseFileName = (fileName, folderPath) => {
  const nameWithoutExt = path.parse(fileName).name;
  
  // Extract the abbreviation (letters at the start)
  const match = nameWithoutExt.match(/^([a-zA-Z]+)/);
  if (!match) return null;
  
  const abbr = match[1].toUpperCase();
  
  let productName = null;
  let category = null;

  if (abbr === 'FD') { productName = 'Full Double Door'; category = 'Wardrobe'; }
  else if (abbr === 'DD') { productName = 'Double Door'; category = 'Wardrobe'; }
  else if (abbr === 'TD') { productName = 'Triple Door'; category = 'Wardrobe'; }
  else if (abbr === 'SC') {
    if (folderPath.includes('Car Beds')) { productName = 'Single Car Bed'; category = 'Car Beds'; }
    else if (folderPath.includes('Study Table')) { productName = 'Single Chair Study table'; category = 'Study Table'; }
  }
  else if (abbr === 'SB') { productName = 'Single Bed'; category = 'Single Beds'; }
  else if (abbr === 'DB') { productName = 'Double Bed'; category = 'Single Beds'; }
  else if (abbr === 'P') { productName = 'Pilor Bunk Bed'; category = 'Bunk Beds'; }
  else if (abbr === 'CH') { productName = 'Car Hut Bunk Bed'; category = 'Bunk Beds'; }
  else if (abbr === 'T') { productName = 'Tub Bunk Bed'; category = 'Bunk Beds'; }
  else if (abbr === 'S') { productName = 'Simple Bunk Bed'; category = 'Bunk Beds'; }
  else if (abbr === 'Q') { productName = 'Queen Size Bunk Bed'; category = 'Bunk Beds'; }
  else if (abbr === 'WC') { productName = 'With Cabin'; category = 'Babycots'; }
  else if (abbr === 'WOC') { productName = 'Without Cabin'; category = 'Babycots'; }
  else if (abbr === 'DC') { productName = 'Double Chair Study table'; category = 'Study Table'; }
  else if (abbr === 'LM') { productName = 'Long Mirror Dressing'; category = 'Dressing Tables'; }
  else if (abbr === 'RM') { productName = 'Round Mirror Dressing'; category = 'Dressing Tables'; }

  if (!productName) return null;

  // e.g., if file is "CH1", product name might be "Car Hut Bunk Bed 1"
  const numberMatch = nameWithoutExt.match(/\d+$/);
  const finalName = numberMatch ? `${productName} ${numberMatch[0]}` : productName;

  return { productName: finalName, category };
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

const runSeed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    let addedCount = 0;

    for (const dirObj of DIRS) {
      if (!fs.existsSync(dirObj.path)) {
        console.warn(`Directory not found: ${dirObj.path}`);
        continue;
      }

      console.log(`\nProcessing directory: ${dirObj.path}`);
      const files = fs.readdirSync(dirObj.path);

      for (const file of files) {
        if (!file.match(/\.(jpg|jpeg|png|webp)$/i)) continue; // only images

        const parsed = parseFileName(file, dirObj.path);
        if (!parsed) {
          console.log(`Skipping file (no matched abbreviation): ${file}`);
          continue;
        }

        const { productName, category } = parsed;
        const filePath = path.join(dirObj.path, file);

        console.log(`Uploading ${file} as "${productName}" (Category: ${category})...`);
        const imageUrl = await uploadToCloudinary(filePath);

        if (imageUrl) {
          const product = new Product({
            name: productName,
            slug: productName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-4),
            category: category,
            description: `Beautiful ${productName} crafted with premium materials. Custom orders available.`,
            price: 0,
            dimensions: { length: 0, width: 0, height: 0 },
            material: 'Premium Wood/MDF',
            finish: 'Non-toxic Paint',
            ageGroup: 'Kids',
            colors: ['Various'],
            featured: false,
            image: imageUrl,
            images: [imageUrl]
          });

          await product.save();
          console.log(`Saved product to DB: ${productName}`);
          addedCount++;
          
          // Slight delay to avoid hitting Cloudinary API limits
          await delay(500);
        }
      }
    }

    console.log(`\nSeeding completed successfully! Added ${addedCount} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
};

runSeed();
