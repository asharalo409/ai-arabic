import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Headphones,
  Play,
  RotateCcw,
  Volume2,
  CheckCircle,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import { speakArabic, stopSpeech } from '../../services/speechService';

export const ListeningView: React.FC = () => {
  const { addXp } = useApp();
  const [slowPlayback, setSlowPlayback] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [comprehensionAnswers, setComprehensionAnswers] = useState<{ [id: string]: number }>({});
  const [showResult, setShowResult] = useState(false);

  const listeningItems = [
    {
      id: 'list-1',
      type: 'শব্দ (Word)',
      arabic: 'المَسْجِدُ النَّبَوِيُّ',
      phoneticBn: 'আল-মাসজিদুন নাবাবিয়্যু',
      bengali: 'নবীজীর (সাল্লাল্লাহু আলাইহি ওয়া সাল্লাম) মসজিদ',
      question: 'আপনি অডিওতে কোন পবিত্র স্থানের নাম শুনেছেন?',
      options: ['মসজিদুল হারাম', 'মসজিদুন নববী', 'মসজিদুল আকসা', 'মসজিদে কুবা'],
      correctIndex: 1,
      explanation: 'المَسْجِدُ النَّبَوِيُّ অর্থ মদিনা মুনাওয়ারায় অবস্থিত মসজিদে নববী।',
    },
    {
      id: 'list-2',
      type: 'বাক্য (Sentence)',
      arabic: 'طَلَبُ العِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ',
      phoneticBn: 'ত্বলাবুল ইলমি ফারিদাতুন আলা কুল্লি মুসলিম',
      bengali: 'জ্ঞান অন্বেষণ করা প্রত্যেক মুসলিমের উপর আবশ্যক',
      question: 'এই বাক্যে কোন কাজের আবশ্যকতার কথা বলা হয়েছে?',
      options: ['ব্যবসা করা', 'জ্ঞান অর্জন করা', 'ভ্রমণ করা', 'দান করা'],
      correctIndex: 1,
      explanation: 'طَلَبُ العِلْمِ অর্থ জ্ঞান অন্বেষণ করা।',
    },
    {
      id: 'list-3',
      type: 'কথোপকথন (Dialogue)',
      arabic: 'صَبَاحُ الخَيْرِ، كَيْفَ أَصْبَحْتَ الْيَوْمَ؟',
      phoneticBn: 'সাবাহুল খাইর, কাইফা আসবাহতাল ইয়াওম?',
      bengali: 'শুভ সকাল, আজ তোমার সকাল কেমন কেটেছে?',
      question: 'বক্তা দিনের কোন ভাগে কুশল বিনিময় করছেন?',
      options: ['দুপুরে', 'সন্ধ্যায়', 'সকালে', 'রাত্রে'],
      correctIndex: 2,
      explanation: 'صَبَاحُ الخَيْرِ সকালের অভিবাদন।',
    },
    {
      id: 'list-4',
      type: 'কুরআনিক তিলাওয়াত (Quranic Ayah)',
      arabic: 'وَقُل رَّبِّ زِدْنِي عِلْمًا',
      phoneticBn: 'ওয়া কুল রাব্বি যিদনী ইলমা',
      bengali: 'এবং বলুন: হে আমার প্রতিপালক, আমার জ্ঞান বৃদ্ধি করে দিন।',
      question: 'এই দোয়ায় আল্লাহর কাছে কী বৃদ্ধির প্রার্থনা করা হয়েছে?',
      options: ['সম্পদ', 'সুস্থতা', 'জ্ঞান (ইলম)', 'দীর্ঘায়ু'],
      correctIndex: 2,
      explanation: 'عِلْمًا অর্থ জ্ঞান বা প্রজ্ঞা।',
    },
  ];

  const handlePlayAudio = (id: string, text: string) => {
    setPlayingId(id);
    speakArabic(text, {
      rate: slowPlayback ? 0.65 : 0.85,
      onEnd: () => setPlayingId(null),
      onError: () => setPlayingId(null),
    });
  };

  const handleCheckComprehension = () => {
    setShowResult(true);
    addXp(30);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
              <Headphones className="h-4 w-4" />
              <span>শ্রবণ দক্ষতা উন্নয়ন ল্যাব</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              আরবি লিসেনিং প্র্যাকটিস
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              বিশুদ্ধ আরবি মাখরাজ ও হরকত শুনে বোঝার ক্ষমতা বৃদ্ধি করুন। প্রতিটি বাক্যের ধীরগতির প্লেব্যাক ও বোধগম্যতা কুইজ।
            </p>
          </div>

          <button
            onClick={() => setSlowPlayback(!slowPlayback)}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all shadow-md ${
              slowPlayback
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
            }`}
          >
            <Volume2 className="h-4 w-4" />
            <span>ধীরগতি মোড (0.65x): {slowPlayback ? 'চালু' : 'বন্ধ'}</span>
          </button>
        </div>
      </div>

      {/* Audio Cards */}
      <div className="space-y-6">
        {listeningItems.map((item, idx) => {
          const isPlaying = playingId === item.id;
          const userAns = comprehensionAnswers[item.id];
          return (
            <div
              key={item.id}
              className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 shadow-md space-y-4 hover:border-purple-500/30 transition-all"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <span className="rounded-md bg-purple-500/20 px-2.5 py-0.5 text-xs font-bold text-purple-300">
                  {item.type}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(item.id, item.arabic)}
                    className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-purple-500 transition-colors shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>{isPlaying ? 'বাজছে...' : 'অডিও শুনুন'}</span>
                  </button>
                  <button
                    onClick={() => handlePlayAudio(item.id, item.arabic)}
                    className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                    title="পুনরায় শুনুন"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Arabic with Harakat */}
              <div className="text-right py-2">
                <span className="font-arabic text-2xl sm:text-3xl font-bold text-amber-300" dir="rtl">
                  {item.arabic}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <div className="text-emerald-400 font-medium">বাংলা উচ্চারণ: {item.phoneticBn}</div>
                <div className="text-slate-300">বাংলা অর্থ: {item.bengali}</div>
              </div>

              {/* Comprehension Question */}
              <div className="rounded-2xl bg-slate-950/70 p-4 border border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                  <HelpCircle className="h-4 w-4 text-amber-400" />
                  <span>শ্রবণ বোধগম্যতা প্রশ্ন: {item.question}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {item.options.map((opt, oIdx) => {
                    const isSelected = userAns === oIdx;
                    const isCorrect = item.correctIndex === oIdx;
                    let style = 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800';

                    if (showResult) {
                      if (isCorrect) style = 'border-emerald-500 bg-emerald-950/50 text-emerald-300 font-bold';
                      else if (isSelected && !isCorrect) style = 'border-rose-500 bg-rose-950/50 text-rose-300';
                    } else if (isSelected) {
                      style = 'border-purple-500 bg-purple-500/20 text-purple-300 font-semibold';
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() =>
                          setComprehensionAnswers((prev) => ({ ...prev, [item.id]: oIdx }))
                        }
                        className={`rounded-xl border p-2.5 text-xs transition-all ${style}`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {showResult && (
                  <div className="text-[11px] text-slate-400 pt-1">
                    💡 <strong>ব্যাখ্যা:</strong> {item.explanation}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={handleCheckComprehension}
          className="rounded-xl bg-purple-600 px-7 py-3 text-xs font-bold text-white hover:bg-purple-500 transition-colors shadow-lg shadow-purple-950"
        >
          শ্রবণ পরীক্ষা ফলাফল যাচাই করুন
        </button>
      </div>
    </div>
  );
};
