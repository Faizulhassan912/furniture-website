# Project Context
- Project Name: S&S Kids Furniture Custom Order Platform
- Tech Stack: MERN (MongoDB, Express, React, Node.js)
- Hosting: Vercel (Serverless Backend)
- AI Tool: Google Gemini API (Free Tier)
- Cart Logic: Multi-product inquiry cart that redirects to WhatsApp.

# Feature Requirement: AI-Powered Semantic Search Bar
We need to replace the standard keyword-based search with an AI-powered Semantic Search. When a user types a natural language query (e.g., "bed for 2 kids in a small room" or Roman Urdu like "chote kamre ke liye bed"), the AI should understand the intent, find the best matching products from the database, and return them.

## Technical Workflow
1. React frontend sends the user's search query to `POST /api/smart-search`.
2. Express backend retrieves a lightweight catalog from MongoDB (e.g., `_id`, `title`, `category`, `description`).
3. Express sends the user query AND the lightweight catalog to the Gemini API.
4. Gemini API analyzes which products match the user's intent.
5. Gemini API returns a STRICT JSON array of matching product `_id`s.
6. Express uses these `_id`s to fetch the full product details from MongoDB and sends the array of products back to React.
7. React updates the UI to display the matching product cards.

## STRICT System Prompting Rules for Gemini (Backend Logic)
When writing the Gemini system prompt, enforce these constraints:
- Role: You are a product matching engine.
- Output Format: You MUST return ONLY a valid JSON array of strings representing the matching product IDs (e.g., `["id1", "id2"]`). 
- Rule 1: Do not include any conversational text, markdown formatting, or explanations in your response. Only the JSON array.
- Rule 2: If no products match the user's query, return an empty array `[]`.
- Rule 3: Only match products that are provided in the context.

## Tasks for Google Antigravity
1. Write the Express.js route (`POST /api/smart-search`). Implement the logic to pass the MongoDB catalog to Gemini and ensure Gemini is configured to output JSON (hint: use `response_mime_type: "application/json"` if supported, or strict prompting).
2. Write the React component for the Semantic Search Bar, including the loading state (e.g., a spinner while AI is thinking) and a beautiful product grid for the results.