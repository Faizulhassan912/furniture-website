import express from 'express';
import { generateWithKeyRotation } from '../geminiRotator.js';
import Product from '../_models/Product.js';

const router = express.Router();

// Simple in-memory cache for products to speed up chat
let cachedProductContext = null;
let lastCacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Invalid messages format' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'GEMINI_API_KEY is not configured on the server.' });
    }

    // Check if we have cached products, if not fetch from DB
    if (!cachedProductContext || Date.now() - lastCacheTime > CACHE_DURATION) {
      const products = await Product.find({}).select('name category description price dimensions material finish ageGroup images slug -_id');
      
      let context = "Here is the list of our available products:\n\n";
      products.forEach(p => {
        context += `Product: ${p.name}\n`;
        context += `Category: ${p.category}\n`;
        if (p.price) context += `Price: Rs ${p.price}\n`;
        if (p.material) context += `Material: ${p.material}\n`;
        if (p.finish) context += `Finish: ${p.finish}\n`;
        if (p.dimensions && (p.dimensions.length || p.dimensions.width)) {
          context += `Dimensions: ${p.dimensions.length}" x ${p.dimensions.width}" x ${p.dimensions.height || 0}"\n`;
        }
        if (p.images && p.images.length > 0) context += `Image: ${p.images[0]}\n`;
        if (p.slug) context += `Link: /collection/${p.slug}\n`;
        context += `Description: ${p.description}\n\n`;
      });
      
      cachedProductContext = context;
      lastCacheTime = Date.now();
    }
    
    const productContext = cachedProductContext;

    const systemPrompt = `
You are a friendly, highly professional, and helpful sales assistant for S. Kids Furniture named "S. Support".
Your goal is to help customers find the perfect furniture for their kids' bedroom.

CRITICAL RULES FOR PRODUCTS & IMAGES (YOU MUST FOLLOW THIS):
1. ONLY recommend products that are provided in the context below. Do not invent products.
2. YOU ARE FULLY CAPABLE OF SHARING IMAGES AND LINKS in this chat window. The chat interface supports Markdown. NEVER say you cannot share images or links. NEVER tell the user to go to the website to see pictures. 
3. When recommending or mentioning a specific product, you MUST ALWAYS include its image and a link in Markdown format exactly like this:
   ![Product Name](IMAGE_URL)
   [View Product Details](LINK_URL)
4. Call to Action: Guide the user to add items to cart and click "Order on WhatsApp" to finalize custom sizes/colors.

COMPANY POLICIES, FAQs & VOCABULARY (ONLY mention these if the user explicitly asks about them. DO NOT volunteer this information unprompted):
- Vocabulary Rule: If the user asks for "Babycots", "Baby cots", "Cribs", or similar, YOU MUST recommend products from the "With Cabin" and "Without Cabin" categories, as these are our cabin beds/babycots.
- Delivery Methods: We offer Cargo and Personal Delivery. Inside Lahore, we offer Personal Delivery. Outside Lahore, both Personal Delivery and Cargo are available. Delivery charges are separate and not included in the product price. Tell them to contact WhatsApp for EXACT delivery charges.
- Delivery Time: Standard products take about 1 week to be ready. Custom-built products (custom sizes/colors) take a maximum of 10 days.
- Payment Terms: We require a 50% advance payment to start manufacturing custom orders. The remaining 50% is paid upon delivery or dispatch.
- Material & Quality: We use premium quality Lamination Board with non-toxic paint. It is highly durable and 100% safe for kids.
- Water Damage: If water spills on the furniture, wipe it dry immediately. It will not swell immediately as it is high quality, but avoid standing water.
- Installation/Assembly: If asked about installation, tell them to contact our team on WhatsApp to discuss installation details.
- Unknown Questions: If the user asks a question not covered here, politely tell them to contact our team and we will guide them further.

Keep your responses concise, friendly, and use simple formatting. Do not list all your policies at once.

--- PRODUCT CONTEXT ---
${productContext}
-----------------------
`;

    // Manually format the conversation history into a single prompt string
    let fullPrompt = `SYSTEM PROMPT (Internal Rules):\n${systemPrompt}\n\n`;
    
    if (messages.length > 1) {
      fullPrompt += "--- PREVIOUS CHAT HISTORY ---\n";
      for (let i = 0; i < messages.length - 1; i++) {
        const msg = messages[i];
        const roleName = msg.role === 'ai' ? 'S. Support' : 'Customer';
        fullPrompt += `${roleName}: ${msg.text}\n`;
      }
      fullPrompt += "-----------------------------\n\n";
    }

    const lastMessage = messages[messages.length - 1];
    fullPrompt += `CUSTOMER (Current Message): ${lastMessage.text}\n\nS. Support:`;

    const text = await generateWithKeyRotation(fullPrompt);

    res.json({ reply: text });
  } catch (error) {
    console.error('Chat AI Error:', error);

    // Smart fallback if AI is down or rate-limited
    try {
      const userText = (messages[messages.length - 1]?.text || '').toLowerCase();

      // If it's a greeting
      if (userText.includes('hello') || userText.includes('hi') || userText.includes('salam') || userText.includes('aoa')) {
        return res.json({
          reply: "Hello! Welcome to S. Kids Furniture! 👋 How can I assist you with your kids' bedroom furniture today? Feel free to ask about our Beds, Cabin Beds, Wardrobes, or custom orders! 😊"
        });
      }

      // If they asked about products, fetch top products to recommend
      const sampleProducts = await Product.find({}).limit(2).lean();
      let reply = "I am currently assisting many customers! Here are some of our popular products:\n\n";
      sampleProducts.forEach(p => {
        if (p.images && p.images[0]) {
          reply += `![${p.name}](${p.images[0]})\n`;
        }
        reply += `**${p.name}** - Rs ${p.price || 'N/A'}\n[View Product Details](/collection/${p.slug || ''})\n\n`;
      });
      reply += "For custom designs and instant quotes, you can also contact us directly on WhatsApp! 📱";

      return res.json({ reply });
    } catch (fallbackErr) {
      return res.json({
        reply: "Hello! Thank you for reaching out to S. Kids Furniture. How can I help you find the perfect furniture for your little one today? 😊"
      });
    }
  }
});

export default router;
