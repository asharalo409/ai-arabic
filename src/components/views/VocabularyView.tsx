import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VOCABULARY_LIST } from '../../data/vocabularyData';
import {
  Bookmark,
  Volume2,
  Search,
  RotateCw,
  Sparkles,
  Layers,
  Star,
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { speakArabic } from '../../services/speechService';

export const VocabularyView: React.FC = () => {
  const { stats, toggleFavoriteWord, addXp } = useApp();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);

  // Flashcards mode
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const categories = [
    { id: 'all', label: 'সকল শব্দ' },
    { id: 'কুরআনিক ও আধ্যাত্মিক', label: 'কুরআনিক ও আধ্যাত্মিক' },
    { id: 'শিক্ষা ও জ্ঞান', label: 'শিক্ষা ও জ্ঞান' },
    { id: 'পরিবার', label: 'পরিবার ও সম্পর্ক' },
    { id: 'দৈনন্দিন জীবন', label: 'দৈনন্দিন জীবন' },
    { id: 'ক্রিয়াপদ', label: 'জরুরি ক্রিয়াপদ (Verbs)' },
  ];

  const filteredWords = VOCABULARY_LIST.filter((w) => {
    const matchCategory = activeCategory === 'all' || w.category === activeCategory;
    const matchSearch =
      w.bengali.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.arabic.includes(searchQuery) ||
      w.phoneticBn.toLowerCase().includes(searchQuery.toLowerCase());
    const matchFav = !onlyFavorites || stats.favoriteWordIds.includes(w.id);

    return matchCategory && matchSearch && matchFav;
  });

  const currentFlashcard = filteredWords[flashcardIndex] || filteredWords[0];

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const handleSpacedRepetitionGrade = (points: number) => {
    addXp(points);
    handleNextFlashcard();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <Bookmark className="h-4 w-4" />
              <span>মুফরাদাত ও শব্দভাণ্ডার ব্যাংক</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
              আরবি শব্দকোষ ও ফ্ল্যাশকার্ড
            </h1>
            <p className="text-xs sm:text-sm text-slate-300">
              স্পেসড রিপিটেশন (Spaced Repetition) পদ্ধতিতে শব্দের দীর্ঘস্থায়ী স্মৃতি তৈরি করুন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFlashcardMode(!isFlashcardMode)}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-xs font-bold transition-all shadow-md ${
                isFlashcardMode
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <RotateCw className="h-4 w-4" />
              <span>{isFlashcardMode ? 'তালিকা ভিউতে যান' : 'ফ্ল্যাশকার্ড মোড চালু করুন'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Flashcard Mode Interactive View */}
      {isFlashcardMode && filteredWords.length > 0 && (
        <div className="mx-auto max-w-xl space-y-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>
              শব্দ {flashcardIndex + 1} / {filteredWords.length}
            </span>
            <span>কার্ডে ক্লিক করে অর্থ দেখুন</span>
          </div>

          {/* 3D Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="cursor-pointer select-none rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-emerald-950/40 p-8 text-center shadow-2xl transition-all duration-300 hover:border-amber-400 min-h-[300px] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300">
                {currentFlashcard.category}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavoriteWord(currentFlashcard.id);
                }}
                className="text-amber-400 text-sm"
              >
                {stats.favoriteWordIds.includes(currentFlashcard.id) ? '★ প্রিয়' : '☆ সেভ করুন'}
              </button>
            </div>

            <div className="my-6 space-y-3">
              {!isFlipped ? (
                <>
                  <div className="font-arabic text-4xl sm:text-5xl font-bold text-amber-300" dir="rtl">
                    {currentFlashcard.arabic}
                  </div>
                  <p className="text-xs text-slate-400">উচ্চারণ: {currentFlashcard.phoneticBn}</p>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-white">{currentFlashcard.bengali}</div>
                  <div className="text-sm text-slate-400">English: {currentFlashcard.english}</div>
                  {currentFlashcard.rootWord && (
                    <div className="rounded-xl bg-slate-900 p-2 text-xs text-emerald-400 inline-block">
                      ধাতু: {currentFlashcard.rootWord}
                    </div>
                  )}
                  {currentFlashcard.exampleArabic && (
                    <div className="text-xs text-amber-300/90 font-arabic text-right mt-2" dir="rtl">
                      {currentFlashcard.exampleArabic}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  speakArabic(currentFlashcard.arabic);
                }}
                className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"
              >
                <Volume2 className="h-4 w-4" />
                <span>উচ্চারণ শুনুন</span>
              </button>
            </div>
          </div>

          {/* Spaced repetition memory rating buttons */}
          <div className="grid grid-cols-4 gap-2 pt-2">
            <button
              onClick={() => handleSpacedRepetitionGrade(5)}
              className="rounded-xl border border-rose-800 bg-rose-950/40 p-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-900/60"
            >
              আবার দেখান (Again)
            </button>
            <button
              onClick={() => handleSpacedRepetitionGrade(10)}
              className="rounded-xl border border-amber-800 bg-amber-950/40 p-2.5 text-xs font-semibold text-amber-300 hover:bg-amber-900/60"
            >
              কঠিন (Hard)
            </button>
            <button
              onClick={() => handleSpacedRepetitionGrade(15)}
              className="rounded-xl border border-teal-800 bg-teal-950/40 p-2.5 text-xs font-semibold text-teal-300 hover:bg-teal-900/60"
            >
              ভালো (Good)
            </button>
            <button
              onClick={() => handleSpacedRepetitionGrade(20)}
              className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900/60"
            >
              সহজ (Easy)
            </button>
          </div>
        </div>
      )}

      {/* List Mode View */}
      {!isFlashcardMode && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-semibold shrink-0 transition-all ${
                    activeCategory === cat.id
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search and Favorite toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                  onlyFavorites
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Star className="h-4 w-4" />
                <span>প্রিয় শব্দসমূহ ({stats.favoriteWordIds.length})</span>
              </button>

              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="শব্দ বা অর্থ খুঁজুন..."
                  className="rounded-xl border border-slate-800 bg-slate-900 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Words Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredWords.map((word) => {
              const isFav = stats.favoriteWordIds.includes(word.id);
              return (
                <div
                  key={word.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5 space-y-3 hover:border-emerald-500/30 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      {word.category}
                    </span>
                    <button
                      onClick={() => toggleFavoriteWord(word.id)}
                      className={`text-sm ${isFav ? 'text-amber-400' : 'text-slate-600 hover:text-slate-300'}`}
                      title="ফেভারিট সেভ করুন"
                    >
                      {isFav ? '★' : '☆'}
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-arabic text-2xl font-bold text-amber-300" dir="rtl">
                      {word.arabic}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-emerald-400 font-medium">উচ্চারণ: {word.phoneticBn}</div>
                    <div className="text-white font-semibold">অর্থ: {word.bengali}</div>
                    <div className="text-[11px] text-slate-400">English: {word.english}</div>
                  </div>

                  {word.exampleArabic && (
                    <div className="rounded-xl bg-slate-950/80 p-2.5 text-xs border border-slate-800/80 space-y-1">
                      <div className="font-arabic text-sm text-slate-200 text-right" dir="rtl">
                        {word.exampleArabic}
                      </div>
                      <div className="text-[11px] text-slate-400">{word.exampleBengali}</div>
                    </div>
                  )}

                  <button
                    onClick={() => speakArabic(word.arabic)}
                    className="w-full flex items-center justify-center gap-1 rounded-xl bg-slate-800/80 hover:bg-slate-750 py-2 text-xs font-semibold text-emerald-300 transition-colors"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>উচ্চারণ শুনুন</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
