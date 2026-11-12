import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QURANIC_ANALYSIS_DATA } from '../../data/quranicData';
import {
  Sparkles,
  BookOpen,
  Volume2,
  CheckCircle,
  HelpCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { speakArabic } from '../../services/speechService';

export const QuranicArabicView: React.FC = () => {
  const { addXp } = useApp();
  const [selectedAyahId, setSelectedAyahId] = useState(QURANIC_ANALYSIS_DATA[0].id);
  const [slowRecitation, setSlowRecitation] = useState(true);

  const currentAyah =
    QURANIC_ANALYSIS_DATA.find((a) => a.id === selectedAyahId) || QURANIC_ANALYSIS_DATA[0];

  const handleRecite = (text: string) => {
    speakArabic(text, {
      rate: slowRecitation ? 0.65 : 0.85,
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300">
              <Sparkles className="h-4 w-4" />
              <span>لُغَةُ الْقُرْآنِ الْكَرِيمِ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              কুরআনিক আরবি ও শব্দভিত্তিক তাহকীক
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              পবিত্র কুরআনের বিশুদ্ধ আয়াতের শব্দে শব্দে ধাতু (Root), রূপতত্ত্ব (Morphology) ও ব্যাকরণিক বিশ্লেষণ।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSlowRecitation(!slowRecitation)}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                slowRecitation
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-300 border-slate-700'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span>ধীর তিলাওয়াত (0.65x): {slowRecitation ? 'অন' : 'অফ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Surah Selector Chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {QURANIC_ANALYSIS_DATA.map((item) => {
          const isSelected = item.id === selectedAyahId;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedAyahId(item.id)}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold shrink-0 transition-all border ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/15 text-amber-300 shadow-md'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
              }`}
            >
              <span className="font-arabic text-sm" dir="rtl">{item.surahNameArabic}</span>
              <span>({item.surahName}: {item.ayahNumber})</span>
            </button>
          );
        })}
      </div>

      {/* Selected Quranic Ayah Full Card */}
      <div className="rounded-3xl border border-amber-500/30 bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-bold text-slate-300">
              {currentAyah.surahName} • আয়াত {currentAyah.ayahNumber}
            </span>
          </div>

          <button
            onClick={() => handleRecite(currentAyah.fullAyahArabic)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md"
          >
            <Play className="h-4 w-4 fill-slate-950" />
            <span>তিলাওয়াত শুনুন</span>
          </button>
        </div>

        {/* Big Ayah Calligraphy text */}
        <div className="rounded-2xl bg-slate-950/80 p-6 text-center border border-slate-800">
          <p className="font-arabic text-3xl sm:text-4xl lg:text-5xl font-bold text-amber-300 leading-relaxed harakat-text" dir="rtl">
            {currentAyah.fullAyahArabic}
          </p>
          <p className="mt-4 text-xs sm:text-sm text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            "{currentAyah.fullAyahBengali}"
          </p>
        </div>

        {/* Tafsir Summary */}
        <div className="rounded-2xl bg-emerald-950/20 p-4 border border-emerald-900/30 text-xs text-slate-300 leading-relaxed">
          📖 <strong className="text-emerald-400">তাফসির সারসংক্ষেপ:</strong> {currentAyah.tafsirSummary}
        </div>

        {/* Word by Word Analysis Grid */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            শব্দে শব্দে অর্থ ও ব্যাকরণিক তাহকীক (Word-by-Word Analysis)
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {currentAyah.words.map((w, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 space-y-3 hover:border-amber-500/40 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                    {idx + 1}
                  </span>
                  <button
                    onClick={() => handleRecite(w.arabic)}
                    className="p-1 rounded-md text-amber-400 hover:text-white"
                    title="শব্দটি শুনুন"
                  >
                    <Volume2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-arabic text-2xl font-bold text-amber-300" dir="rtl">
                    {w.arabic}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="text-white font-semibold">অর্থ: {w.bengali}</div>
                  <div className="rounded-lg bg-slate-900 p-2 text-[11px] text-emerald-400 border border-slate-800">
                    <strong>মূল ধাতু (Root):</strong> {w.root}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <strong>রূপতত্ত্ব:</strong> {w.morphology}
                  </div>
                  <div className="text-[11px] text-amber-200/90">
                    <strong>ই’রাব:</strong> {w.grammarNote}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
