import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

async function generateWithRetry(ai: GoogleGenAI, contents: any, systemInstruction?: string) {
  const modelsToTry = ['gemini-3.8-flash', 'gemini-flash-latest'];
  let lastError: any = null;

  for (const model of modelsToTry) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: systemInstruction ? { systemInstruction } : undefined,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err: any) {
      lastError = err;
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  throw lastError || new Error('All model attempts failed');
}

export default async function handler(req: Request, res: Response) {
  // Enable CORS if needed
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const {
      message,
      conversationHistory = [],
      mode = 'general',
      interfaceLanguage = 'bn',
    } = req.body || {};

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables.',
      });
      return;
    }

    const systemInstruction = `You are "Ustadha AI" / "Ustadz AI", the senior master Arabic Language Educator and Scholar at "AI ARABIC ACADEMY" (এআই অ্যারাবিক একাডেমি).
You specialize in both Modern Standard Arabic (ফুসহা - الفصحى) and Classical Quranic Arabic (لغة القرآن).

Your core pedagogical principles:
1. Primary teaching language is Bengali (বাংলা). Even if the user asks in English or Arabic, provide rich Bengali explanations, phonetic pronunciation (বাংলা উচ্চারণ), and Bengali translations, while also matching the user's primary conversational language.
2. ALWAYS provide Arabic words and sentences with complete Harakat (Tashkeel).
3. Format educational responses cleanly:
   - 📌 মূল উত্তর / ব্যাখ্যা
   - 📖 আরবি বাক্য ও হরকত
   - 🗣️ বাংলা উচ্চারণ
   - 💡 বাংলা অর্থ ও শব্দার্থ
   - 🔍 ব্যাকরণগত বিশ্লেষণ (Nahw ও Sarf / I'rab)
   - 🎯 অনুশীলনী বা উদাহরণ
4. Never fabricate Quranic verses or Hadith. Use reliable references.`;

    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];
    const recentHistory = Array.isArray(conversationHistory) ? conversationHistory.slice(-8) : [];

    for (const item of recentHistory) {
      if (item && item.text && (item.role === 'user' || item.role === 'model')) {
        contents.push({
          role: item.role,
          parts: [{ text: item.text }],
        });
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: `[Mode: ${mode}, Interface Lang: ${interfaceLanguage}]\nStudent Question: ${message}` }],
    });

    const reply = await generateWithRetry(ai, contents, systemInstruction);
    res.status(200).json({ reply });
  } catch (err: any) {
    console.error('API Error in /api/ai-teacher:', err);
    res.status(500).json({
      error: 'মডেল সেবা কিছুটা ব্যস্ত রয়েছে। অনুগ্রহ করে কয়েক সেকেন্ড পর পুনরায় চেষ্টা করুন।',
    });
  }
}
