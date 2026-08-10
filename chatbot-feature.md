# Project Context
- Project Name: S&S Kids Furniture Custom Order Platform
- Tech Stack: MERN (MongoDB, Express, React, Node.js)
- Hosting: Vercel (Serverless Backend)
- AI Tool: Google Gemini API (Free Tier)
- Business Model: Custom orders via WhatsApp. 
- Cart Logic: The website HAS an "Add to Cart" feature, but it acts as an inquiry builder. Users add multiple products to the cart and then click "Order on WhatsApp" to send the cart data to the admin's WhatsApp for final discussion and pricing.

# Feature Requirement: Smart Lead Generation Chatbot
We need an AI-powered chat interface on the React frontend. When a user asks a question, the backend should fetch relevant product info from MongoDB, pass it to the Gemini API, and return a conversational response.

## Technical Workflow
1. React frontend captures the user's chat message and sends it to `POST /api/chat`.
2. Express backend retrieves relevant product summaries from MongoDB.
3. Express backend constructs a System Prompt for Gemini, injecting the MongoDB product data.
4. Gemini API generates a response based on the prompt and data.
5. Express returns the response to React.

## STRICT System Prompting Rules for Gemini (Backend Logic)
The AI system prompt MUST enforce these rules:
- Role: You are a friendly, helpful sales assistant for S&S Kids Furniture.
- Accuracy: ONLY recommend products that are provided in the MongoDB context. Do not invent products, shapes, or colors. Keep the structural design descriptions exactly as provided.
- Call to Action (CRITICAL): Always guide the user correctly on how to order. Tell them to "Add your favorite items to the cart, and then click the 'Order on WhatsApp' button so we can discuss your custom sizes, colors, and pricing."
- Do not promise exact automatic online checkout, remind them that finalization happens on WhatsApp.

## Tasks for Google Antigravity
1. Write the Express.js route (`POST /api/chat`) that connects to MongoDB, structures the prompt with the new Call to Action logic, and calls the Gemini API.
2. Write the React component for the Chat UI.