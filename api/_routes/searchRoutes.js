import express from 'express';
import Product from '../_models/Product.js';
import { generateWithKeyRotation } from '../geminiRotator.js';
import fs from 'fs';
import path from 'path';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query is required' });
    }

    // 1. Fetch lightweight catalog from DB
    // We only need fields that help AI make a decision, to keep the token size small
    const products = await Product.find({})
      .select('_id name category description price')
      .lean();

    if (!products.length) {
      return res.json({ products: [] });
    }

    // 2. Build the System Prompt for Gemini
    const systemPrompt = `
You are a highly intelligent Semantic Search Engine for a Kids Furniture store.
Your goal is to understand the user's intent and match it with the best products from the catalog.
You must understand natural language, including English and Roman Urdu (e.g., "chote kamre ke liye bed").

USER QUERY: "${query}"

AVAILABLE PRODUCTS CATALOG (JSON format):
${JSON.stringify(products)}

INSTRUCTIONS:
1. Analyze the USER QUERY.
2. Find all products in the catalog that semantically match the user's intent.
3. You MUST return a STRICT JSON array of strings, where each string is the _id of a matching product.
4. DO NOT wrap the array in an object. Return the raw array: ["id1", "id2"].
5. If no products match, return an empty array: [].
6. DO NOT include any markdown, explanations, or conversational text. Output ONLY the valid JSON array.
7. HINT: In Roman Urdu, "2 bachon ka bed" means a bed for 2 kids. Bunk Beds are specifically designed for 2 kids. Strongly consider returning products from Bunk Bed categories for such queries.
`;

    // 3. Call Gemini API
    const responseText = await generateWithKeyRotation(systemPrompt);
    
    // 4. Parse the output (handling potential markdown wrapping)
    let cleanJson = responseText.trim();
    console.log("Raw Gemini Response:", cleanJson);
    fs.writeFileSync(path.join(process.cwd(), 'debug-search.txt'), 'Raw Gemini Response: ' + cleanJson + '\nQuery: ' + query);
    if (cleanJson.startsWith('```json')) cleanJson = cleanJson.substring(7);
    if (cleanJson.startsWith('```')) cleanJson = cleanJson.substring(3);
    if (cleanJson.endsWith('```')) cleanJson = cleanJson.substring(0, cleanJson.length - 3);
    cleanJson = cleanJson.trim();

    let matchedIds = [];
    try {
      matchedIds = JSON.parse(cleanJson);
      if (!Array.isArray(matchedIds)) {
        throw new Error("Gemini did not return an array");
      }
    } catch (parseError) {
      console.error('Failed to parse Gemini semantic search response:', cleanJson);
      fs.appendFileSync(path.join(process.cwd(), 'debug-search.txt'), '\nParse Error: ' + parseError.message);
      // Fallback: Just return empty array if AI messed up the JSON
      return res.json({ products: [] });
    }

    // 5. Fetch full product details for the matched IDs
    if (matchedIds.length === 0) {
      return res.json({ products: [] });
    }

    const matchedProducts = await Product.find({ _id: { $in: matchedIds } }).lean();
    
    // Sort them in the order Gemini returned them (to preserve AI's ranking relevance)
    const sortedProducts = matchedIds
      .map(id => matchedProducts.find(p => p._id.toString() === id))
      .filter(p => p != null);

    res.json({ products: sortedProducts });

  } catch (error) {
    console.warn('Semantic AI failed, falling back to smart keyword search:', error.message);

    // Fallback: Perform multi-keyword regex search in database so user never gets stuck
    try {
      const q = req.body.query.toLowerCase().trim();
      const terms = q.split(/\s+/).filter(t => t.length > 1);

      // Handle common Roman Urdu / semantic keywords
      let searchRegexes = terms.map(t => new RegExp(t, 'i'));
      if (q.includes('2') || q.includes('bachon') || q.includes('kids') || q.includes('bunk')) {
        searchRegexes.push(/bunk/i, /bed/i);
      }

      const fallbackProducts = await Product.find({
        $or: [
          { name: { $in: searchRegexes } },
          { category: { $in: searchRegexes } },
          { description: { $in: searchRegexes } },
          { tags: { $in: searchRegexes } }
        ]
      }).limit(12).lean();

      return res.json({ products: fallbackProducts });
    } catch (fallbackError) {
      console.error('Fallback Search Error:', fallbackError);
      return res.json({ products: [] });
    }
  }
});

export default router;
