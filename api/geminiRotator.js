import { GoogleGenerativeAI } from '@google/generative-ai';

// Global variable to track current key index
let currentKeyIndex = 0;

// List of potential Gemini model names in order of preference
const FALLBACK_MODELS = [
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-pro'
];

/**
 * Automatically rotates through provided Gemini API keys and tries fallback models if 404/429/503 happens.
 */
export const generateWithKeyRotation = async (promptData, preferredModel = 'gemini-1.5-flash') => {
  const keysStr = process.env.GEMINI_API_KEY || '';
  const keys = keysStr.split(',').map(k => k.trim()).filter(k => k.length > 0);

  if (keys.length === 0) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Create unique ordered list of models to try, starting with preferredModel
  const modelsToTry = [preferredModel, ...FALLBACK_MODELS.filter(m => m !== preferredModel)];

  let lastError = null;
  let attempts = 0;

  while (attempts < keys.length) {
    const currentKey = keys[currentKeyIndex];
    const genAI = new GoogleGenerativeAI(currentKey);

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Gemini] Attempting generation with key #${currentKeyIndex + 1} and model '${modelName}'...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(promptData);
        const response = await result.response;
        const text = response.text();
        console.log(`[Gemini] Success with model '${modelName}'!`);
        return text;
      } catch (error) {
        lastError = error;
        const errMsg = error?.message || '';
        console.warn(`[Gemini] Key #${currentKeyIndex + 1} with model '${modelName}' failed: ${errMsg}`);

        // If limit is 0 or model not supported/404, try the NEXT model on this same key!
        if (errMsg.includes('limit: 0') || errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('not supported')) {
          continue; // try next model for this key
        }

        // If standard temporary rate limit / Quota reached, continue to try other models or next key
        continue;
      }
    }

    // Move to the next key
    console.warn(`[Gemini] Switching from key #${currentKeyIndex + 1} to next key...`);
    currentKeyIndex = (currentKeyIndex + 1) % keys.length;
    attempts++;
  }

  // If all keys and all models failed, throw the last error or helpful message
  throw new Error(lastError ? lastError.message : 'ALL_KEYS_EXHAUSTED');
};

