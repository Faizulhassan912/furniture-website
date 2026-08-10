import express from 'express';
import { generateWithKeyRotation } from '../geminiRotator.js';
import { upload } from '../_config/cloudinary.js';
import { protect, admin } from '../_middleware/auth.js';

const router = express.Router();

router.post('/generate-description', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const imageUrl = req.file.path; // Cloudinary URL
    
    // Check if API key is configured
    if (!process.env.ADMIN_GEMINI_KEY) {
      return res.status(500).json({ message: 'ADMIN_GEMINI_KEY is not configured on the server.' });
    }

    // Fetch the image from Cloudinary to get the ArrayBuffer for Gemini
    const imageResp = await fetch(imageUrl);
    const arrayBuffer = await imageResp.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const mimeType = imageResp.headers.get('content-type') || 'image/jpeg';

    const imageParts = [
      {
        inlineData: {
          data: buffer.toString("base64"),
          mimeType
        }
      }
    ];

    const categoriesStr = req.body.categories || '[]';

    const prompt = `
You are an expert furniture copywriter and analyst.
I have uploaded an image of a kids furniture product.
Please analyze the structural design, shape, colors, and type of furniture in this photo.
DO NOT hallucinate dimensions or features not explicitly visible.

Return a JSON object containing:
1. "title": A highly creative, innovative, aesthetic, and catchy title for the product (MAX 5-7 WORDS). Make it sound premium.
2. "description": An accurate description based ONLY on what is visible. Use plain text bullet points (starting with "- " or "• "), separated by newlines. DO NOT USE ANY HTML TAGS.
3. "category": The main category of the furniture. If possible, choose EXACTLY one from this list of parent categories: ${categoriesStr}. If none fit perfectly, make your best guess.
4. "subCategory": A sub-category if applicable. If you chose a parent category from the list, choose a child category from the same list whose 'parent' matches the chosen 'category'. Otherwise, make your best guess.
5. "material": The primary material visible (e.g., "Lamination Wood Sheet", "Solid Wood"). Default to "Lamination Wood Sheet" if unsure.
6. "finish": The type of finish used (e.g., "Non-Toxic Paint", "Matte", "Glossy"). Default to "Non-Toxic Paint" if unsure.
7. "ageGroup": The target age group (e.g., "3-8 years", "0-2 years", "All Ages") based on the design.
8. "price": A dummy price in numbers (e.g., 15000, 25000) that seems reasonable for this type of furniture in Pakistani Rupees (PKR). Return ONLY the number.
9. "dimensions": An object containing estimated dimensions in inches based on standard sizes for the category. Include "length", "width", and "height" as numbers (e.g., {"length": 78, "width": 42, "height": 65}).

Example JSON output:
{
  "title": "Magical Sky Yellow Bunk Bed",
  "description": "• Sturdy wooden frame\\n• Integrated storage drawers\\n• Safe rounded edges",
  "category": "Beds",
  "subCategory": "Bunk Beds",
  "material": "Lamination Wood Sheet",
  "finish": "Non-Toxic Paint",
  "ageGroup": "3-8 years",
  "price": 25000,
  "dimensions": {
    "length": 78,
    "width": 42,
    "height": 65
  }
}

Provide ONLY the JSON response without markdown formatting like \`\`\`json.
    `;

    const text = await generateWithKeyRotation(
      [prompt, ...imageParts], 
      "gemini-flash-latest", 
      process.env.ADMIN_GEMINI_KEY, 
      "admin"
    );
    
    
    // Parse the JSON. Gemini might wrap it in markdown block.
    let cleanJson = text.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.substring(7);
    }
    if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.substring(3);
    }
    if (cleanJson.endsWith('```')) {
      cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    }

    const parsedData = JSON.parse(cleanJson);
    
    // Add the image url so frontend can use it if they want
    parsedData.imageUrl = imageUrl;

    res.json(parsedData);
  } catch (error) {
    console.error('AI Generation Error:', error);
    res.status(500).json({ message: 'Failed to generate description', error: error.toString(), stack: error.stack });
  }
});

export default router;
