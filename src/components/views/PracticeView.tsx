import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  PenTool,
  CheckCircle,
  RotateCcw,
  Sparkles,
  Award,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { speakArabic } from '../../services/speechService';
import confetti from 'canvas-confetti';

export const PracticeView: React.FC = () => {
  const { addXp } = useApp();

  // Drill 1: Word Reordering to form correct sentence
  // Sentence: "الْعِلْمُ نُورٌ فِي القَلْبِ" (জ্ঞান অন্তরের জ্যোতি)
  const [jumbledWords, setJumbledWords] = useState(['فِي', 'نُورٌ', 'القَلْبِ', 'الْعِلْمُ']);
  const [assembledWords, setAssembledWords] = useState<string[]>([]);
  const [isReorderCorrect, setIsReorderCorrect] = useState<boolean | null>(null);

  // Drill 2: Typing Drill
  const targetTypingSentence = 'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ';
  const [typedInput, setTypedInput] = useState('');

  const handleWordClick = (word: string) => {
    setJumbledWords((prev) => prev.filter((w) => w !== word));
    setAssembledWords((prev) => [...prev, word]);
    setIsReorderCorrect(null);
  };

  const handleRemoveWord = (word: string) => {
    setAssembledWords((prev) => prev.filter((w) => w !== word));
    setJumbledWords((prev) => [...prev, word]);
    setIsReorderCorrect(null);
  };

  const handleCheckSentence = () => {
    const joined = assembledWords.join(' ');
    // Correct order: الْعِلْمُ نُورٌ فِي القَلْبِ
    if (joined === 'الْعِلْمُ نُورٌ فِي القَلْبِ') {
      setIsReorderCorrect(true);
      addXp(30);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      setIsReorderCorrect(false);
    }
  };

  const handleResetReorder = () => {
    setJumbledWords(['فِي', 'نُورٌ', 'القَلْبِ', 'الْعِلْمُ']);
    setAssembledWords([]);
    setIsReorderCorrect(null);
  };

  const arabicKeys = ['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'َ', 'ِ', 'ُ', 'ً', 'ٍ', 'ٌ', 'ْ', 'ّ'];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-teal-500/30 bg-gradient-to-r from-teal-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/20 px-3.5 py-1 text-xs font-semibold text-teal-300">
            <PenTool className="h-4 w-4" />
            <span>ইন্টারেক্টিভ ড্রিল ও লেখনী ল্যাব</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            আরবি ড্রিল ও বাক্য গঠন অনুশীলন
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            শব্দ সাজিয়ে বাক্য তৈরি করুন এবং ভার্চুয়াল আরবি কিবোর্ড দিয়ে টাইপিং দক্ষতা বৃদ্ধি করুন।
          </p>
        </div>
      </div>

      {/* Drill 1: Word Reordering */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-amber-400 uppercase">ড্রিল ১: বাক্য বিন্যাস</span>
          <h3 className="text-base font-bold text-white mt-1">
            নিচের এলোমেলো শব্দগুলো সাজিয়ে অর্থপূর্ণ বাক্য গঠন করুন
          </h3>
          <p className="text-xs text-slate-400">লক্ষ্য অর্থ: "জ্ঞান হলো অন্তরের জ্যোতি"</p>
        </div>

        {/* Assembled sentence drop zone */}
        <div className="rounded-2xl border-2 border-dashed border-slate-700 bg-slate-950/80 p-6 min-h-[90px] flex items-center justify-center flex-wrap gap-2 text-right" dir="rtl">
          {assembledWords.length > 0 ? (
            assembledWords.map((word, i) => (
              <button
                key={i}
                onClick={() => handleRemoveWord(word)}
                className="rounded-xl bg-emerald-600/40 border border-emerald-500/50 px-4 py-2 font-arabic text-xl font-bold text-emerald-200 hover:bg-rose-950/60 hover:border-rose-800 hover:text-rose-300 transition-colors shadow-sm"
              >
                {word}
              </button>
            ))
          ) : (
            <span className="text-xs text-slate-500">শব্দগুলোতে ক্লিক করে এখানে বাক্য তৈরি করুন</span>
          )}
        </div>

        {/* Jumbled Words Pool */}
        <div className="flex flex-wrap items-center justify-center gap-3" dir="rtl">
          {jumbledWords.map((word, i) => (
            <button
              key={i}
              onClick={() => handleWordClick(word)}
              className="rounded-xl border border-slate-700 bg-slate-800 px-5 py-2.5 font-arabic text-xl font-bold text-amber-300 hover:bg-emerald-600 hover:text-white transition-all shadow-md"
            >
              {word}
            </button>
          ))}
        </div>

        {/* Action and feedback */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <button
            onClick={handleResetReorder}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="h-4 w-4" />
            <span>রিসেট করুন</span>
          </button>

          <button
            onClick={handleCheckSentence}
            disabled={assembledWords.length === 0}
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-2.5 text-xs font-bold text-white hover:from-emerald-500 hover:to-teal-500 transition-all disabled:opacity-50"
          >
            যাচাই করুন
          </button>
        </div>

        {isReorderCorrect === true && (
          <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-400" />
              <span>মাশাআল্লাহ! বাক্যটি সম্পূর্ণ সঠিক হয়েছে। (+৩০ XP)</span>
            </div>
            <button
              onClick={() => speakArabic('الْعِلْمُ نُورٌ فِي القَلْبِ')}
              className="underline text-amber-400"
            >
              শুনুন
            </button>
          </div>
        )}

        {isReorderCorrect === false && (
          <div className="rounded-xl border border-rose-800 bg-rose-950/40 p-4 text-xs text-rose-300">
            বাক্যের ক্রম সঠিক হয়নি। মুবতাদা দিয়ে শুরু করার চেষ্টা করুন: "الْعِلْمُ..."
          </div>
        )}
      </div>

      {/* Drill 2: Arabic Typing & Harakat Drill */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-teal-400 uppercase">ড্রিল ২: টাইপিং ও হরকত ড্রিল</span>
          <h3 className="text-base font-bold text-white mt-1">
            নিচের পবিত্র বাক্যটি দেখে দেখে নিখুঁতভাবে টাইপ করুন
          </h3>
          <div className="mt-3 rounded-2xl bg-slate-950 p-4 text-center border border-slate-800">
            <span className="font-arabic text-2xl sm:text-3xl font-bold text-amber-300" dir="rtl">
              {targetTypingSentence}
            </span>
          </div>
        </div>

        {/* Input box */}
        <div className="space-y-3">
          <textarea
            rows={3}
            value={typedInput}
            onChange={(e) => setTypedInput(e.target.value)}
            placeholder="নিচের কিবোর্ড বা আপনার কীবোর্ড দিয়ে টাইপ করুন..."
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 font-arabic text-xl text-white placeholder-slate-600 focus:border-teal-500 focus:outline-none text-right"
            dir="rtl"
          />

          {/* Virtual Arabic Keyboard */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400">আরবি কীবোর্ড প্যাড:</span>
            <div className="flex flex-wrap gap-1.5 justify-center" dir="rtl">
              {arabicKeys.map((k, i) => (
                <button
                  key={i}
                  onClick={() => setTypedInput((prev) => prev + k)}
                  className="h-9 w-9 rounded-xl bg-slate-800 font-arabic text-sm text-slate-200 hover:bg-teal-600 hover:text-white transition-colors"
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
