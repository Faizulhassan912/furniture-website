import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import Product from '../api/_models/Product.js';

// Fix DNS resolution
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const specsMap = {
  // Bunk Beds
  "Simple Bunk Bed": {
    price: 50000,
    dimensions: { length: 7.5, width: 3, height: 5 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Designed for ultimate durability and space efficiency, this Simple Bunk Bed is crafted from high-quality Lamination Board. It offers a secure, comfortable double-deck sleeping arrangement for kids' bedrooms.",
    features: ["Space-saving double deck layout", "Sturdy & child-safe frame", "Smooth non-toxic protective finish", "Easy-to-clean lamination surface"]
  },
  "Tub Bunk Bed": {
    price: 55000,
    dimensions: { length: 9.5, width: 3, height: 5 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "The Tub Bunk Bed features an extended layout with integrated tub storage steps. Keep toys, clothes, and bedding organized while providing top-tier safety and comfort for your children.",
    features: ["Built-in tub storage drawers", "Extended safety guardrails", "Heavy-duty lamination board", "Child-safe non-toxic coating"]
  },
  "Car Hut Bunk Bed": {
    price: 50000,
    dimensions: { length: 7.5, width: 3, height: 5 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Spark your child's imagination with the Car Hut Bunk Bed! Designed with playful house cutouts and vibrant finishes, it turns bedtime into a fun adventure with total structural safety.",
    features: ["Playful hut & theme design", "Solid reinforced frame", "Scratch-resistant lamination board", "Smooth rounded safety edges"]
  },
  "Pilors Bunk Bed": {
    price: 55000,
    dimensions: { length: 8, width: 3.5, height: 5 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Featuring heavy pillar supports and an architectural structure, the Pilors Bunk Bed provides superior weight tolerance and spacious 3.5ft width sleeping comfort for growing kids.",
    features: ["Pillar-reinforced heavy structure", "Spacious 3.5ft mattress width", "Heavy-duty hardware & joints", "Non-toxic eco-friendly finish"]
  },
  "Queen Size Bunk Bed": {
    price: 65000,
    dimensions: { length: 7.5, width: 6.5, height: 5.5 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "The Queen Size Bunk Bed offers generous room for sleeping and lounging. Constructed from heavy-duty lamination board, it effortlessly accommodates multiple children with premium stability.",
    features: ["Extra-wide Queen size lower tier", "Maximum weight tolerance", "Integrated step ladder", "Premium non-toxic finish"]
  },

  // Car Beds
  "Car Bed": {
    price: 25000,
    dimensions: { length: 6.5, width: 3.5, height: 3 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Vroom into dreamland! The Car Bed features realistic sports car contours, vibrant glossy paneling, and built-in side guardrails to keep young racers safe all night.",
    features: ["Sporty race-car side rails for safety", "High-gloss laminated finish", "Sturdy mattress base", "Easy wipe-clean surface"]
  },

  // Single Beds
  "Single Bed": {
    price: 20000,
    dimensions: { length: 6, width: 3, height: 3 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "A sleek and versatile Single Bed tailored for modern kids' bedrooms. Built from sturdy lamination board to withstand daily use with timeless minimal aesthetics.",
    features: ["Compact & space-saving footprint", "Ergonomic headboard support", "Non-toxic eco-friendly materials", "Long-lasting lamination finish"]
  },

  // Double Beds
  "Double Bed": {
    price: 35000,
    dimensions: { length: 6.5, width: 3, height: 3 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Spacious Double Bed offering comfortable sleeping for growing children. Designed with robust lamination board and clean modern accents to elevate any room.",
    features: ["Spacious sleeping area", "Heavy-duty frame construction", "Smooth non-toxic paint finish", "Low maintenance design"]
  },

  // Baby Cots
  "Babycot With Cabin": {
    price: 35000,
    dimensions: { length: 5, width: 2, height: 2.5 },
    material: "Lamination Board",
    ageGroup: "Baby",
    finish: "Non-toxic Paint",
    description: "Keep your baby safe and essentials organized! The Babycot with Cabin features an integrated storage cabinet for diapers, clothes, and baby gear alongside secure crib rails.",
    features: ["Integrated storage cabinet", "High safety side rails", "100% baby-safe non-toxic finish", "Smooth rounded corners"]
  },
  "Babycot Without Cabin": {
    price: 30000,
    dimensions: { length: 4, width: 2, height: 2.5 },
    material: "Lamination Board",
    ageGroup: "Baby",
    finish: "Non-toxic Paint",
    description: "A classic and serene baby crib crafted from premium lamination board. Offers maximum ventilation, sturdy slatted safety walls, and a comforting nursery environment.",
    features: ["Classic slatted crib guardrails", "Compact nursery design", "Safe non-toxic paint", "Sturdy newborn support"]
  },

  // Study Tables
  "Study Table Single Chair": {
    price: 20000,
    dimensions: { length: 5, width: 3, height: 2 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Encourage focused learning with the Single Chair Study Table. Equipped with storage shelves, a spacious desktop, and a matching ergonomic chair for kids.",
    features: ["Includes matching ergonomic chair", "Built-in book & stationary shelf", "Scratch-resistant lamination desk", "Child-safe rounded edges"]
  },
  "Study Table Double Chair": {
    price: 35000,
    dimensions: { length: 5.5, width: 5, height: 2 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Perfect for siblings or study buddies! The Double Chair Study Desk features dual seating spaces with central divider storage for books, laptops, and craft supplies.",
    features: ["Dual seating setup with 2 chairs", "Center storage organizer", "Heavy-duty desktop surface", "Easy-to-clean lamination board"]
  },

  // Dressing Tables
  "Dressing table Long Mirror": {
    price: 15000,
    dimensions: { length: 5.5, width: 1.5, height: 1 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Add elegance to your child's room with the Long Mirror Dressing Table. Features a tall distortion-free mirror and pull-out drawers for accessories and grooming items.",
    features: ["Full-length distortion-free mirror", "Smooth gliding storage drawer", "Sleek compact design", "Child-safe non-toxic finish"]
  },
  "Dressing table Round Mirror": {
    price: 20000,
    dimensions: { length: 4.5, width: 3, height: 1 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "A whimsical Round Mirror Dressing Table that turns daily routines into delight. Complete with an aesthetic tabletop organizer and drawers.",
    features: ["Modern circular mirror frame", "Ample tabletop storage space", "High-grade lamination board", "Non-toxic paint coating"]
  },

  // Wardrobes
  "Wardrobe Full Double Door": {
    price: 20000,
    dimensions: { length: 5, width: 3, height: 1.5 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Maximize clothes storage with the Full Double Door Wardrobe. Features full-height hanging space and bottom shelving for shoes and folded garments.",
    features: ["Full-height hanging rod space", "Reinforced door hinges", "Durable lamination board", "Sleek non-toxic finish"]
  },
  "Wardrobe Double Door": {
    price: 24000,
    dimensions: { length: 5, width: 3, height: 1.5 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "The Double Door Wardrobe combines internal hanging rods with multiple organized shelves. Designed to store clothes, toys, and linens neatly.",
    features: ["Multi-shelf & hanging rod combo", "Soft-close door hinges", "Water-resistant lamination board", "Child-friendly handles"]
  },
  "Wardrobe Triple Door": {
    price: 30000,
    dimensions: { length: 6, width: 4, height: 2 },
    material: "Lamination Board",
    ageGroup: "Kids",
    finish: "Non-toxic Paint",
    description: "Our largest storage solution! The Triple Door Wardrobe provides extensive compartmentalized space, hanging racks, and drawers for all your kids' essentials.",
    features: ["3-Door mega storage capacity", "Multiple shelves & dual hanging rods", "Heavy-duty lamination board", "Modern non-toxic paint finish"]
  }
};

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB.');

    const products = await Product.find({});
    console.log(`Found ${products.length} products to update...`);

    let updatedCount = 0;

    for (const p of products) {
      let specKey = null;

      const catLower = p.category.toLowerCase();
      const nameLower = p.name.toLowerCase();

      // Category / Subcategory matching logic
      if (catLower.includes('triple door')) specKey = "Wardrobe Triple Door";
      else if (catLower.includes('double door')) {
        if (nameLower.includes('full')) specKey = "Wardrobe Full Double Door";
        else specKey = "Wardrobe Double Door";
      }
      else if (catLower.includes('long mirror')) specKey = "Dressing table Long Mirror";
      else if (catLower.includes('round mirror')) specKey = "Dressing table Round Mirror";
      else if (catLower.includes('single chair')) specKey = "Study Table Single Chair";
      else if (catLower.includes('double chair')) specKey = "Study Table Double Chair";
      else if (catLower.includes('baby cot') || catLower.includes('crib')) {
        if (nameLower.includes('cabin')) specKey = "Babycot With Cabin";
        else specKey = "Babycot Without Cabin";
      }
      else if (catLower.includes('car bed') || catLower.includes('racer') || catLower.includes('sports car')) specKey = "Car Bed";
      else if (catLower.includes('single bed')) specKey = "Single Bed";
      else if (catLower.includes('double bed')) specKey = "Double Bed";
      else if (catLower.includes('bunk')) {
        if (catLower.includes('triple') || nameLower.includes('queen')) specKey = "Queen Size Bunk Bed";
        else if (catLower.includes('storage') || nameLower.includes('tub') || nameLower.includes('drawer')) specKey = "Tub Bunk Bed";
        else if (catLower.includes('theme') || catLower.includes('castle') || nameLower.includes('hut') || nameLower.includes('castle')) specKey = "Car Hut Bunk Bed";
        else if (catLower.includes('l-shape') || nameLower.includes('pilor') || nameLower.includes('pillar')) specKey = "Pilors Bunk Bed";
        else specKey = "Simple Bunk Bed";
      }

      // Default fallback
      if (!specKey) {
        if (nameLower.includes('bunk')) specKey = "Simple Bunk Bed";
        else if (nameLower.includes('car')) specKey = "Car Bed";
        else if (nameLower.includes('door') || nameLower.includes('wardrobe')) specKey = "Wardrobe Double Door";
        else if (nameLower.includes('study') || nameLower.includes('desk')) specKey = "Study Table Single Chair";
        else if (nameLower.includes('mirror') || nameLower.includes('dressing')) specKey = "Dressing table Round Mirror";
        else specKey = "Single Bed";
      }

      const spec = specsMap[specKey];
      if (spec) {
        p.price = spec.price;
        p.dimensions = spec.dimensions;
        p.material = spec.material;
        p.finish = spec.finish;
        p.ageGroup = spec.ageGroup;
        p.description = spec.description;
        p.features = spec.features;
        await p.save();
        updatedCount++;
      }
    }

    console.log(`Successfully updated ${updatedCount} products with real specs, prices, descriptions, and features!`);
    mongoose.disconnect();
  } catch (err) {
    console.error('Error updating products:', err);
    process.exit(1);
  }
}

run();
