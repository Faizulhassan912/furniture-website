import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
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
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on the server.' });
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

    const prompt = `
You are an expert furniture copywriter and analyst.
I have uploaded an image of a kids furniture product.
Please analyze the EXACT structural design, shape, and colors of the furniture in this photo.
DO NOT hallucinate, guess, or add features, dimensions, or aesthetic details that are not explicitly visible in the image.
Retain the exact product characteristics. Accuracy is the highest priority.

Return a JSON object containing:
1. "title": A catchy, SEO-friendly title for this product.
2. "description": An accurate product description based ONLY on what is visible in the image. The description MUST be formatted as an HTML unordered list (<ul><li>...</li></ul>) containing bullet points of the features, so it looks good on the frontend.

Example JSON output:
{
  "title": "Magical Sky Bunk Bed",
  "description": "<ul><li>Sturdy wooden frame</li><li>Integrated storage drawers</li></ul>"
}

Provide ONLY the JSON response without markdown formatting like \`\`\`json.
    `;

    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    
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
    res.status(500).json({ message: 'Failed to generate description', error: error.message });
  }
});

export default router;
