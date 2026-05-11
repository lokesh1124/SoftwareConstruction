// ─────────────────────────────────────────────────────────────
// MyFitAI — Google Gemini AI Service
// Handles all communication with the Gemini API for AI Coach,
// workout suggestions, and nutrition advice.
// ─────────────────────────────────────────────────────────────

const GEMINI_API_KEY = 'AIzaSyDe0DqZ_begUzzxefh5OJq7WKl_U3eaVgA';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface UserContext {
  name: string;
  age: number;
  gender: string;
  weight: number;
  height: number;
  goal: string;
  dailyCalorieGoal: number;
  dailyStats?: {
    calories: number;
    steps: number;
    water: number;
    sleep: number;
    duration: number;
  };
}

const SYSTEM_PROMPT = `You are MyFitAI Coach — a world-class personal fitness and nutrition coach built into a mobile fitness app. You are friendly, knowledgeable, motivating, and concise.

RULES:
- Keep responses under 150 words. Be direct and actionable.
- Use the user's profile data to personalize advice.
- When giving workout advice, include specific exercises, sets, and reps.
- When giving nutrition advice, include specific foods and amounts.
- Use emoji sparingly (1-2 per response max) to keep it professional.
- Never give medical advice. If asked about injuries or medical conditions, recommend consulting a healthcare professional.
- Be encouraging but honest. Don't sugarcoat feedback.
- Format key numbers in bold when helpful.
- If you don't know something, say so. Don't make up data.

EXPERTISE AREAS:
- Workout programming (strength, hypertrophy, cardio, HIIT)
- Nutrition & macros (meal planning, calorie counting, supplements)
- Recovery (sleep, stretching, deloading)
- Form & technique tips
- Motivation & habit building
- Progress analysis`;

function buildSystemContext(userContext: UserContext): string {
  const heightFeet = Math.floor(userContext.height / 12);
  const heightInches = userContext.height % 12;
  
  let ctx = `${SYSTEM_PROMPT}\n\nUSER PROFILE:\n`;
  ctx += `- Name: ${userContext.name}\n`;
  ctx += `- Age: ${userContext.age}, Gender: ${userContext.gender}\n`;
  ctx += `- Height: ${heightFeet}'${heightInches}", Weight: ${userContext.weight} lbs\n`;
  ctx += `- Goal: ${userContext.goal}\n`;
  ctx += `- Daily Calorie Target: ${userContext.dailyCalorieGoal} kcal\n`;
  
  if (userContext.dailyStats) {
    const s = userContext.dailyStats;
    ctx += `\nTODAY'S ACTIVITY:\n`;
    ctx += `- Calories burned: ${s.calories} kcal\n`;
    ctx += `- Steps: ${s.steps}\n`;
    ctx += `- Water: ${s.water}L\n`;
    ctx += `- Sleep: ${s.sleep} hrs\n`;
    ctx += `- Workout duration: ${s.duration} min\n`;
  }
  
  return ctx;
}

/**
 * Send a message to Gemini and get a streamed/full response.
 */
export async function sendToGemini(
  userMessage: string,
  conversationHistory: GeminiMessage[],
  userContext: UserContext
): Promise<string> {
  const systemContext = buildSystemContext(userContext);
  
  // Build the contents array with conversation history
  const contents: GeminiMessage[] = [
    // System context as the first "user" message
    { role: 'user', parts: [{ text: systemContext + '\n\nRespond with a brief greeting acknowledging you are ready to help.' }] },
    { role: 'model', parts: [{ text: `Hey ${userContext.name}! 👋 Ready to help you crush your ${userContext.goal.toLowerCase()} goals. What's on your mind?` }] },
    // Then the actual conversation
    ...conversationHistory,
    // The new user message
    { role: 'user', parts: [{ text: userMessage }] },
  ];

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        generationConfig: {
          temperature: 0.7,
          topP: 0.9,
          topK: 40,
          maxOutputTokens: 512,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Gemini API error:', response.status, errorData);
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract the text response
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('No response text from Gemini');
    }
    
    return text.trim();
  } catch (error) {
    console.error('Gemini request failed:', error);
    throw error;
  }
}

/**
 * Quick single-shot prompt (no conversation history needed).
 * Useful for generating workout plans, meal suggestions, etc.
 */
export async function quickPrompt(
  prompt: string,
  userContext: UserContext
): Promise<string> {
  return sendToGemini(prompt, [], userContext);
}
