import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '..', 'public', 'images');

async function convertImages() {
  console.log('Converting public/images JPEGs to WebP...');
  const files = fs.readdirSync(imagesDir);

  for (const file of files) {
    if (file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')) {
      const inputPath = path.join(imagesDir, file);
      const webpName = file.replace(/\.(jpg|jpeg|png)$/, '.webp');
      const outputPath = path.join(imagesDir, webpName);

      try {
        await sharp(inputPath)
          .resize({ width: 800, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toFile(outputPath);

        const oldStats = fs.statSync(inputPath);
        const newStats = fs.statSync(outputPath);
        console.log(`✅ Converted ${file} (${Math.round(oldStats.size/1024)}KB) -> ${webpName} (${Math.round(newStats.size/1024)}KB)`);
      } catch (err) {
        console.error(`❌ Error converting ${file}:`, err.message);
      }
    }
  }
  console.log('WebP conversion complete!');
}

convertImages();
