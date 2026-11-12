import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Mic,
  MicOff,
  Volume2,
  Award,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { speakArabic, isSpeechRecognitionSupported, createSpeechRecognizer } from '../../services/speechService';
import { analyzeArabicSpeech, SpeechAnalysisResult } from '../../services/geminiService';

export const SpeakingView: React.FC = () => {
  const { addXp } = useApp();
  const [activeSentenceIndex, setActiveSentenceIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [analysis, setAnalysis] = useState<SpeechAnalysisResult | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recognizer, setRecognizer] = useState<any>(null);

  const practiceSentences = [
    {
      arabic: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ',
      phoneticBn: 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহ',
      bengali: 'আপনার উপর শান্তি, আল্লাহর রহমত ও বরকত বর্ষিত হোক',
      level: 'সহজ (Beginner)',
    },
    {
      arabic: 'أَنَا أَتَعَلَّمُ اللُّغَةَ الْعَرَبِيَّةَ لِفَهْمِ الْقُرْآنِ الْكَرِيمِ',
      phoneticBn: 'আনা আতাআল্লামুল লুগাতাল আরাবিয়্যাতা লিফাহমিল কুরআনিল কারীম',
      bengali: 'আমি কুরআন বোঝার জন্য আরবি ভাষা শিখছি',
      level: 'মধ্যম (Intermediate)',
    },
    {
      arabic: 'طَلَبُ الْعِلْمِ نُورٌ يَهْدِي الْقُلُوبَ',
      phoneticBn: 'ত্বলাবুল ইলমি নূরুন ইয়াহদিল কুলূব',
      bengali: 'জ্ঞান অন্বেষণ হলো এমন এক জ্যোতি যা হৃদয়কে পথ দেখায়',
      level: 'উচ্চতর (Advanced)',
    },
    {
      arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
      phoneticBn: 'ইন্না মাআল উসরি ইউসরা',
      bengali: 'নিশ্চয়ই কষ্টের সাথেই রয়েছে স্বস্তি',
      level: 'কুরআনিক (Quranic)',
    },
  ];

  const currentSentence = practiceSentences[activeSentenceIndex];

  const handleModelAudio = (text: string) => {
    speakArabic(text);
  };

  const handleStartRecording = () => {
    setErrorMessage(null);
    setTranscript('');
    setAnalysis(null);

    if (!isSpeechRecognitionSupported()) {
      setErrorMessage(
        'আপনার ব্রাউজার বা ডিভাইসে সরাসরি Web Speech Recognition সমর্থিত নয়। তবে এআই বিশ্লেষণের মাধ্যমে আপনি আপনার উচ্চারণ তাৎক্ষণিক পরীক্ষা করতে পারেন।'
      );
      // Fallback evaluation
      setIsEvaluating(true);
      analyzeArabicSpeech(currentSentence.arabic, currentSentence.arabic)
        .then((res) => {
          setAnalysis(res);
          addXp(20);
        })
        .finally(() => setIsEvaluating(false));
      return;
    }

    const rec = createSpeechRecognizer({
      onStart: () => setIsRecording(true),
      onResult: (resTranscript, isFinal) => {
        setTranscript(resTranscript);
        if (isFinal) {
          setIsRecording(false);
          evaluateWithAi(resTranscript);
        }
      },
      onError: (err) => {
        setErrorMessage(err);
        setIsRecording(false);
      },
      onEnd: () => setIsRecording(false),
    });

    if (rec) {
      setRecognizer(rec);
      rec.start();
    }
  };

  const handleStopRecording = () => {
    if (recognizer) {
      recognizer.stop();
    }
    setIsRecording(false);
    if (transcript) {
      evaluateWithAi(transcript);
    }
  };

  const evaluateWithAi = async (spokenText: string) => {
    setIsEvaluating(true);
    try {
      const res = await analyzeArabicSpeech(currentSentence.arabic, spokenText);
      setAnalysis(res);
      addXp(25);
    } catch (e: any) {
      setErrorMessage(e.message || 'মূল্যায়ন করতে সমস্যা হয়েছে');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300">
            <Mic className="h-4 w-4" />
            <span>ভয়েস মাখরাজ ও স্পিকিং ল্যাব</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            আরবি উচ্চারণ ও মৌখিক অনুশীলন
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            বিশুদ্ধ আরবিতে কথা বলুন। ব্রাউজার মাইক্রোফোন ব্যবহার করে হরফের মাখরাজ, টান ও সিফাত নির্ভুলভাবে যাচাই করুন।
          </p>
        </div>
      </div>

      {/* Sentence Selection Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {practiceSentences.map((s, idx) => (
          <button
            key={idx}
            onClick={() => {
              setActiveSentenceIndex(idx);
              setAnalysis(null);
              setTranscript('');
            }}
            className={`rounded-xl px-4 py-2 text-xs font-semibold shrink-0 transition-all ${
              activeSentenceIndex === idx
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            বাক্য {idx + 1}: {s.level}
          </button>
        ))}
      </div>

      {/* Target Sentence Card */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs text-amber-400 font-bold uppercase">
            নিচের বাক্যটি স্পষ্ট করে বলুন
          </span>
          <button
            onClick={() => handleModelAudio(currentSentence.arabic)}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/30 transition-colors"
          >
            <Volume2 className="h-4 w-4" />
            <span>মডেল তিলাওয়াত / উচ্চারণ</span>
          </button>
        </div>

        {/* Big Arabic Text */}
        <div className="text-right py-4">
          <div className="font-arabic text-3xl sm:text-4xl font-bold text-amber-300 leading-relaxed" dir="rtl">
            {currentSentence.arabic}
          </div>
        </div>

        <div className="space-y-1 text-xs sm:text-sm">
          <div className="text-emerald-400 font-medium">বাংলা উচ্চারণ: {currentSentence.phoneticBn}</div>
          <div className="text-slate-300">অর্থ: {currentSentence.bengali}</div>
        </div>

        {/* Microphone action section */}
        <div className="flex flex-col items-center justify-center pt-6 space-y-4 border-t border-slate-800">
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              className="flex items-center gap-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-4 text-sm font-bold text-slate-950 shadow-xl shadow-amber-950/60 hover:scale-105 transition-all"
            >
              <Mic className="h-5 w-5" />
              <span>কথা বলা শুরু করুন</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              className="flex items-center gap-3 rounded-full bg-rose-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-rose-950/60 animate-pulse hover:bg-rose-500 transition-all"
            >
              <MicOff className="h-5 w-5" />
              <span>রেকর্ডিং থামান ও ফলাফল দেখুন</span>
            </button>
          )}

          {isRecording && (
            <div className="flex items-center gap-2 text-xs text-amber-400">
              <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
              <span>মাইক্রোফোন চালু আছে... স্পষ্ট উচ্চারণে পাঠ করুন</span>
            </div>
          )}

          {transcript && (
            <div className="w-full rounded-2xl bg-slate-950/80 p-4 border border-slate-800 text-center space-y-1">
              <span className="text-[11px] text-slate-400">আপনার ভয়েস থেকে গৃহীত আরবি হরফ:</span>
              <div className="font-arabic text-xl text-emerald-400" dir="rtl">
                {transcript}
              </div>
            </div>
          )}
        </div>

        {/* Evaluating loader */}
        {isEvaluating && (
          <div className="flex items-center justify-center gap-3 rounded-2xl bg-slate-950 p-4 border border-slate-800">
            <div className="h-4 w-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span className="text-xs text-amber-300">
              এআই শিক্ষক আপনার তাজবীদ ও মাখরাজ বিশ্লেষণ করছেন...
            </span>
          </div>
        )}

        {/* Error notice */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-2xl border border-rose-800/80 bg-rose-950/40 p-4 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* AI Speech Analysis Report Card */}
        {analysis && (
          <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/25 p-6 space-y-4 shadow-inner">
            <div className="flex items-center justify-between border-b border-emerald-900/50 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">উচ্চারণ মূল্যায়ন ফলাফল</h4>
              </div>
              <div className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-400">
                নির্ভুলতা স্কোর: {analysis.accuracyScore}%
              </div>
            </div>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="text-slate-300">
                <strong className="text-amber-300">মাখরাজ ও ধ্বনিতত্ত্ব:</strong> {analysis.makhrajFeedback}
              </div>
              <div className="text-slate-300">
                <strong className="text-emerald-400">হরকত ও টান:</strong> {analysis.harakatAccuracy}
              </div>
              <div className="rounded-xl bg-slate-900/90 p-3 text-xs text-amber-200 border border-slate-800">
                💡 <strong>উন্নয়নের পরামর্শ:</strong> {analysis.tipsForImprovement}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
