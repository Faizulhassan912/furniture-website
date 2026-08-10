# Project Context
- Project Name: S. Kids Furniture Custom Order Platform
- Tech Stack: MERN (MongoDB, Express, React, Node.js)
- Hosting: Vercel (Serverless Backend)
- AI Tool: Google Gemini Vision API (Free Tier)
- Image Storage: Cloudinary (to avoid Vercel temporary storage and 10-second timeout issues)

# Feature Requirement: AI Auto-Description for Admin Panel
We need to build a feature where the admin uploads a furniture image (e.g., baby cots, wardrobes, bunk beds), and the system automatically generates an accurate, SEO-friendly product description using the Gemini Vision API.

## Technical Workflow
1. React Admin frontend accepts an image file and sends it to the Express backend.
2. Express backend securely uploads this image to Cloudinary and retrieves a public URL.
3. Express backend sends this Cloudinary image URL to the Gemini Vision API.
4. Gemini API analyzes the image and returns a JSON response with the generated title and description.
5. The React frontend displays this data in editable text fields before the admin saves it to MongoDB.

## STRICT AI Prompting Rules (Crucial for the Gemini API Call)
When writing the system prompt for the Gemini API inside the Express route, you MUST enforce the following constraints:
- Analyze the exact structural design, shape, and colors of the furniture in the uploaded reference photo.
- DO NOT hallucinate, guess, or add features, dimensions, or aesthetic details that are not explicitly visible in the image. 
- Retain the exact product characteristics. Accuracy is the highest priority.

## Tasks for Google Antigravity
1. Provide the setup and Express.js route code (`POST /api/generate-description`) including Cloudinary upload logic and the Gemini API call.
2. Provide the React component code for the Admin Panel (handling file upload, loading states, and displaying the AI response).
3. List all the required environment variables (`.env`) for this feature.