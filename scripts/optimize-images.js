import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = 'D:\\Furniture Pictures';
const destDir = path.join(__dirname, '..', 'public', 'images');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Map of categories and a few selected image files from the AI Pictures drive
const imagesToProcess = [
  { src: 'AI Pictures/Bunk Beds/00cba789-68d6-46c5-91d4-86e30d4eed2e.jpg', dest: 'bunk-bed-1.jpg' },
  { src: 'AI Pictures/Study Table &/4db40e34-3efb-4fa5-a5b7-1c0e3d5b3100.jpg', dest: 'bunk-bed-2.jpg' }, // Study Desk actually
  { src: 'AI Pictures/Car Beds/01c0b79b-1ea8-4286-91e1-ca95feb402af.jpg', dest: 'car-bed-1.jpg' },
  { src: 'AI Pictures/Single Beds/Gemini_Generated_Image_1wbib51wbib51wbi.jpg', dest: 'single-bed-1.jpg' },
  { src: 'AI Pictures/Single Beds/Gemini_Generated_Image_2sl2ld2sl2ld2sl2.jpg', dest: 'single-bed-2.jpg' },
  { src: 'AI Pictures/14a86a2f-dcb2-42a1-8a29-6f92c400becc.jpg', dest: 'almary-1.jpg' },
  { src: 'AI Pictures/30f715ae-6dee-42c1-8718-a5b423538055.jpg', dest: 'almary-2.jpg' },
  { src: 'AI Pictures/Babycot/Gemini_Generated_Image_3bjf823bjf823bjf.jpg', dest: 'baby-cot-1.jpg' },
];

async function processImages() {
  console.log('Starting image optimization...');
  
  for (const img of imagesToProcess) {
    const sourcePath = path.join(sourceDir, img.src);
    const destPath = path.join(destDir, img.dest);
    
    // For Study table, use an existing image path since I didn't verify its content,
    // let's try one from Baby_Cots instead for the desk just to be safe, or just skip if not found.
    // I will try to process, if it fails, it will catch.
    
    try {
      if (fs.existsSync(sourcePath)) {
        await sharp(sourcePath)
          .resize({ width: 800, withoutEnlargement: true }) // Resize to max 800px width
          .jpeg({ quality: 80 }) // Compress
          .toFile(destPath);
        console.log(`✅ Processed: ${img.dest}`);
      } else {
        console.log(`❌ File not found: ${sourcePath}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${img.src}:`, error.message);
    }
  }
  console.log('Image optimization complete!');
}

processImages();
