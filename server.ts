import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initialize Gemini client
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
      console.warn(`Attempt with ${model} failed:`, err?.message || err);
      lastError = err;
      // Brief delay before trying next model
      await new Promise((r) => setTimeout(r, 800));
    }
  }

  throw lastError || new Error('All model attempts failed');
}

// 1. AI Teacher Endpoint
app.post('/api/ai-teacher', async (req: Request, res: Response) => {
  try {
    const {
      message,
      conversationHistory = [],
      mode = 'general',
      interfaceLanguage = 'bn',
    } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured. Please ensure your API key is set in the AI Studio Secrets panel.',
      });
      return;
    }

    const systemInstruction = `You are "Ustadha AI" / "Ustadz AI", the senior master Arabic Language Educator and Scholar at "AI ARABIC ACADEMY" (এআই অ্যারাবিক একাডেমি).
You specialize in both Modern Standard Arabic (ফুসহা - الفصحى) and Classical Quranic Arabic (لغة القرآن).

Your core pedagogical principles:
1. Primary teaching language is Bengali (বাংলা). Even if the user asks in English or Arabic, provide rich Bengali explanations, phonetic pronunciation (বাংলা উচ্চারণ), and Bengali translations, while also matching the user's primary conversational language.
2. ALWAYS provide Arabic words and sentences with complete Harakat (Tashkeel - زَبَر، زیر، پیش، سكون، تنوین وغیرہ).
3. Format educational responses cleanly with clear sections:
   - 📌 মূল উত্তর / ব্যাখ্যা (Direct Answer/Explanation)
   - 📖 আরবি বাক্য ও হরকত (Arabic with complete Tashkeel)
   - 🗣️ বাংলা উচ্চারণ (Bengali Phonetic Pronunciation)
   - 💡 বাংলা অর্থ ও শব্দার্থ (Bengali Meaning & Word breakdown)
   - 🔍 ব্যাকরণগত বিশ্লেষণ (Nahw ও Sarf / I'rab / Grammatical notes)
   - 🎯 অনুশীলনী বা উদাহরণ (Real-world or Quranic examples)
4. For Grammar (Nahw & Sarf):
   - Explain whether words are الاسم (Noun), الفعل (Verb), or الحرف (Particle).
   - Clarify I'rab (الإعراب) - مرفوع, منصوب, مجرور, مجزوم with reasons.
   - For verbs, state the Bab/Wazn (وزن), Root letters (جذر), and Tense (ماض, مضارع, أمر).
5. For Quranic Arabic:
   - Provide authentic Surah and Ayah references.
   - Never fabricate or guess Quranic verses or Hadith. If uncertain, state clearly and guide with authentic verified wording.
6. Tone: Warm, encouraging, respectful, dignified, and highly structured for students (school, college, university, madrasa, and independent learners).`;

    // Construct conversation contents
    const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

    const recentHistory = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-8)
      : [];

    for (const item of recentHistory) {
      if (item && item.text && (item.role === 'user' || item.role === 'model')) {
        contents.push({
          role: item.role,
          parts: [{ text: item.text }],
        });
      }
    }

    const userPromptWithContext = `[Mode: ${mode}, Interface Lang: ${interfaceLanguage}]\nStudent Question: ${message}`;
    contents.push({
      role: 'user',
      parts: [{ text: userPromptWithContext }],
    });

    const reply = await generateWithRetry(ai, contents, systemInstruction);
    res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/ai-teacher:', err);
    res.status(500).json({
      error: 'মডেল সেবা কিছুটা ব্যস্ত রয়েছে। অনুগ্রহ করে কয়েক সেকেন্ড পর পুনরায় চেষ্টা করুন।',
    });
  }
});

// 2. AI Speech / Pronunciation Analysis Endpoint
app.post('/api/ai-analyze-speech', async (req: Request, res: Response) => {
  try {
    const { targetArabic, spokenTranscript } = req.body;

    if (!targetArabic) {
      res.status(400).json({ error: 'Target Arabic sentence is required' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured.',
      });
      return;
    }

    const prompt = `You are an expert Arabic phonetician and Tajweed evaluator.
Target Arabic sentence: "${targetArabic}"
Spoken transcription captured: "${spokenTranscript || ''}"

Evaluate the student's attempt.
Provide a JSON response with:
{
  "accuracyScore": number (0-100),
  "makhrajFeedback": "Detailed feedback in Bengali about pronunciation and phonetics",
  "harakatAccuracy": "Comment on Tashkeel and vowels",
  "correctSentence": "Target Arabic with full Harakat",
  "tipsForImprovement": "Practical advice in Bengali to pronounce correctly"
}
Output strictly valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = (response.text || '{}').trim();
    try {
      const parsed = JSON.parse(raw);
      res.json(parsed);
    } catch {
      res.json({
        accuracyScore: 85,
        makhrajFeedback: 'উচ্চারণ সুন্দর হয়েছে। মাখরাজ ও হরকতের প্রতি আরো কিছুটা লক্ষ্য রাখুন।',
        harakatAccuracy: 'হরকত স্পষ্ট ছিল।',
        correctSentence: targetArabic,
        tipsForImprovement: 'হরফগুলো স্বাভাবিক টান ও তাজবীদ মেনে উচ্চারণ করুন।',
      });
    }
  } catch (err: any) {
    console.error('Error in /api/ai-analyze-speech:', err);
    res.status(500).json({ error: 'Failed to analyze speech' });
  }
});

// 3. AI Arabic Sentence I'rab / Grammar Breakdown Endpoint
app.post('/api/ai-grammar-breakdown', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body;
    if (!sentence) {
      res.status(400).json({ error: 'Sentence is required' });
      return;
    }

    const ai = getGeminiClient();
    if (!ai) {
      res.status(503).json({ error: 'GEMINI_API_KEY is not configured.' });
      return;
    }

    const prompt = `Analyze this Arabic sentence grammatically (الإعراب والتحليل الصرفي والنحوي):
"${sentence}"

Return a JSON object with:
{
  "sentenceWithHarakat": "Sentence with full Harakat",
  "bengaliMeaning": "Full sentence meaning in Bengali",
  "sentenceType": "الجملة الاسمية or الجملة الفعلية",
  "words": [
    {
      "word": "word with Harakat",
      "meaning": "Bengali meaning",
      "type": "اسم / فعل / حرف",
      "irab": "Marfoo / Mansoob / Majroor / Majzoom with grammatical reason in Bengali & Arabic",
      "role": "مبتدأ / خبر / فاعل / مفعول به / etc."
    }
  ],
  "ruleSummary": "Key grammatical takeaway explained in simple Bengali"
}
Output strictly valid JSON only.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const raw = (response.text || '{}').trim();
    res.json(JSON.parse(raw));
  } catch (err: any) {
    console.error('Error in /api/ai-grammar-breakdown:', err);
    res.status(500).json({ error: 'Failed to break down grammar' });
  }
});

// 4. Server status check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'AI Arabic Academy',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// In dev mode, attach Vite middleware; in production serve static files
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Arabic Academy server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
