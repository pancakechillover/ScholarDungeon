import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import { AppState } from "../types";

export interface SageAdviceRequest {
  state: AppState;
  prompt?: string;
  history?: { role: 'user' | 'assistant'; content: string }[];
}

export async function getSageAdvice({ state, prompt, history = [] }: SageAdviceRequest): Promise<string> {
  let provider = state.sageApiProvider || 'google';
  let apiKey = state.sageApiKey || process.env.GEMINI_API_KEY;
  let baseUrl = state.sageApiUrl;
  let model = state.sageModelName || (provider === 'google' ? 'gemini-3-flash-preview' : 'gpt-4o-mini');

  if (state.activeSageModelId && state.sageModels) {
    const activeModel = state.sageModels.find(m => m.id === state.activeSageModelId);
    if (activeModel) {
      provider = activeModel.provider;
      apiKey = activeModel.apiKey || process.env.GEMINI_API_KEY;
      baseUrl = activeModel.apiUrl;
      model = activeModel.modelName;
    }
  }

  if (!apiKey && provider === 'openai') {
    throw new Error("Missing Sage API Key for OpenAI. Please configure it in Advice Settings.");
  }

  // Gather user context for the prompt
  const recentLogs = Object.entries(state.dailyLogs || {})
    .sort((a, b) => b[0].localeCompare(a[0]))
    .slice(0, 5) // Last 5 days
    .map(([date, log]) => ({
      date,
      mood: log.mood,
      efficiency: log.rating,
      reflection: log.reflection
    }));

  const systemPrompt = `You are "The Sage", an ancient and wise mentor who lives within "The Scholar's Sanctum". 
Analyze the user's progress and provide deeply personal, mystical, yet strictly structured advice.

Current User Status:
- Level: ${state.level}
- Total Sessions: ${(state.history || []).length}
- Current Streak: ${state.streak}
- Recent Logs: ${JSON.stringify(recentLogs)}

### RESPONSE STRUCTURE GUIDELINES:
1. **The Revelation**: A poetic opening sentence summarizing their current state.
2. **Observations**: A bulleted list of 2-3 specific insights based on their data (efficiency, mood, or trends).
3. **The Path Forward**: 2 actionable steps for their next study session.
4. **Mystic Encouragement**: A short closing blessing.

Keep your tone wise, encouraging, and mystical. Use metaphors related to "Sanctums", "Dungeons", and "Ancient Artifacts". Use Bold text for emphasis.`;

  try {
    if (provider === 'google') {
      const ai = new GoogleGenAI({ apiKey: apiKey! });
      
      // Convert history to Gemini format
      const contents = [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: "I acknowledge my role as the Sage. I am ready to guide the scholar." }] },
        ...history.map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        }))
      ];

      // Add current prompt
      contents.push({ role: 'user', parts: [{ text: prompt || "Sage, I seek your guidance. What path should I take tomorrow?" }] });

      const response = await ai.models.generateContent({
        model,
        contents
      });
      return response.text || "The Sage remains silent...";
    } else {
      const openai = new OpenAI({
        apiKey: apiKey!,
        baseURL: baseUrl,
        dangerouslyAllowBrowser: true 
      });

      const messages: any[] = [
        { role: "system", content: systemPrompt },
        ...history.map(m => ({ role: m.role, content: m.content }))
      ];

      messages.push({ role: "user", content: prompt || "Sage, I seek your guidance. What path should I take tomorrow?" });

      const response = await openai.chat.completions.create({
        model,
        messages,
      });
      return response.choices[0].message.content || "The Sage remains silent...";
    }
  } catch (error: any) {
    console.error("Sage AI Error:", error);
    throw new Error(`The Sage's voice was clouded: ${error.message}`);
  }
}
