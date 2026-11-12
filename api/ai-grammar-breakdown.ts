import type { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export default async function handler(req: Request, res: Response) {
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const { sentence } = req.body || {};
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
    res.status(200).json(JSON.parse(raw));
  } catch (err: any) {
    console.error('Grammar API Error:', err);
    res.status(500).json({ error: 'Failed to break down grammar' });
  }
}
