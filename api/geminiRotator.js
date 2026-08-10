import { GoogleGenerativeAI } from '@google/generative-ai';

// Global state to track current key index for different scopes (e.g., 'default', 'admin')
const keyIndexes = {};

// List of potential Gemini model names in order of preference
const FALLBACK_MODELS = [
  'gemini-flash-latest',
  'gemini-1.5-flash-latest',
  'gemini-1.5-flash',
  'gemini-2.0-flash',
  'gemini-2.5-flash',
  'gemini-1.5-flash-8b',
  'gemini-1.5-pro',
  'gemini-2.0-flash-lite',
  'gemini-pro'
];

/**
 * Automatically rotates through provided Gemini API keys and tries fallback models if 404/429/503 happens.
 * @param {Array|String} promptData - The prompt data to send.
 * @param {String} preferredModel - The model to try first.
 * @param {String} customKeyStr - Comma-separated API keys. If null, falls back to process.env.GEMINI_API_KEY.
 * @param {String} scope - A unique string to track rotation state independently (e.g. 'chat', 'admin').
 */
export const generateWithKeyRotation = async (promptData, preferredModel = 'gemini-flash-latest', customKeyStr = null, scope = 'default') => {
  // Get primary keys for this scope
  const primaryKeysStr = customKeyStr || (scope === 'admin' ? process.env.ADMIN_GEMINI_KEY : process.env.GEMINI_API_KEY) || '';
  let keys = primaryKeysStr.split(',').map(k => k.trim()).filter(k => k.length > 0);

  // If primary keys are empty or as backup, combine with any other keys in environment
  if (keys.length === 0) {
    const fallbackAll = [process.env.GEMINI_API_KEY, process.env.ADMIN_GEMINI_KEY].filter(Boolean).join(',');
    keys = fallbackAll.split(',').map(k => k.trim()).filter(k => k.length > 0);
  }

  if (keys.length === 0) {
    throw new Error('No GEMINI API keys found in environment variables.');
  }

  // Also include secondary keys at the end of the rotation list if primary fails
  const secondaryKeyStr = (scope === 'admin' ? process.env.GEMINI_API_KEY : process.env.ADMIN_GEMINI_KEY) || '';
  const secondaryKeys = secondaryKeyStr.split(',').map(k => k.trim()).filter(k => k.length > 0 && !keys.includes(k));
  const allKeys = [...keys, ...secondaryKeys];

  // Initialize scope index if it doesn't exist
  if (keyIndexes[scope] === undefined) {
    keyIndexes[scope] = 0;
  }

  // Ensure index is within bounds
  keyIndexes[scope] = keyIndexes[scope] % allKeys.length;

  // Create unique ordered list of models to try, starting with preferredModel
  const modelsToTry = [preferredModel, ...FALLBACK_MODELS.filter(m => m !== preferredModel)];

  let lastError = null;
  let attempts = 0;

  while (attempts < allKeys.length) {
    const currentKey = allKeys[keyIndexes[scope]];
    const genAI = new GoogleGenerativeAI(currentKey);

    for (const modelName of modelsToTry) {
      try {
        console.log(`[Gemini - ${scope}] Attempting generation with key #${keyIndexes[scope] + 1} and model '${modelName}'...`);
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent(promptData);
        const response = await result.response;
        const text = response.text();
        console.log(`[Gemini - ${scope}] Success with model '${modelName}'!`);
        return text;
      } catch (error) {
        lastError = error;
        const errMsg = error?.message || '';
        console.warn(`[Gemini - ${scope}] Key #${keyIndexes[scope] + 1} with model '${modelName}' failed: ${errMsg}`);

        // If limit is 0 or model not supported/404, try next model on this key
        if (errMsg.includes('limit: 0') || errMsg.includes('404') || errMsg.includes('not found') || errMsg.includes('not supported') || errMsg.includes('Error fetching from')) {
          continue;
        }

        continue;
      }
    }

    // Move to the next key
    console.warn(`[Gemini - ${scope}] Switching from key #${keyIndexes[scope] + 1} to next key...`);
    keyIndexes[scope] = (keyIndexes[scope] + 1) % allKeys.length;
    attempts++;
  }

  // If all keys and all models failed, throw the last error
  throw new Error(lastError ? lastError.message : 'ALL_KEYS_EXHAUSTED');
};

