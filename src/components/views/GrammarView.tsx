import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GRAMMAR_TOPICS } from '../../data/grammarData';
import {
  BookOpen,
  Sparkles,
  Search,
  CheckCircle,
  HelpCircle,
  ChevronRight,
  Send,
  Layers,
  Wand2,
  Volume2,
} from 'lucide-react';
import { getGrammarBreakdown, GrammarBreakdownResult } from '../../services/geminiService';
import { speakArabic } from '../../services/speechService';

export const GrammarView: React.FC = () => {
  const { addXp } = useApp();
  const [selectedTopicId, setSelectedTopicId] = useState(GRAMMAR_TOPICS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  // AI Sentence Analyzer State
  const [inputSentence, setInputSentence] = useState('شَرِبَ مُحَمَّدٌ الْمَاءَ الْبَارِدَ');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<GrammarBreakdownResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const currentTopic = GRAMMAR_TOPICS.find((t) => t.id === selectedTopicId) || GRAMMAR_TOPICS[0];

  const filteredTopics = GRAMMAR_TOPICS.filter(
    (t) =>
      t.titleBengali.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.titleArabic.includes(searchQuery)
  );

  const handleRunAiIrab = async () => {
    if (!inputSentence.trim() || isAnalyzing) return;
    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const res = await getGrammarBreakdown(inputSentence);
      setAnalysisResult(res);
      addXp(20);
    } catch (err: any) {
      setAnalysisError(err.message || 'বিশ্লেষণ সম্পন্ন করা সম্ভব হয়নি');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <BookOpen className="h-4 w-4" />
            <span>নাহব ও সরফ কোষ (النحو والصرف)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            আরবি ব্যাকরণ ও ই’রাব কোষাগার
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            শব্দ ও বাক্য গঠনের নিখুঁত মূলনীতি, পেশ-জবর-জেরের অবস্থান নির্ণয় এবং যেকোনো আরবি বাক্যের স্বয়ংক্রিয় কৃত্রিম বুদ্ধিমত্তা তারকীব।
          </p>
        </div>
      </div>

      {/* AI Sentence Analyzer Interactive Banner */}
      <div className="rounded-3xl border border-amber-500/30 bg-slate-900/80 p-6 sm:p-8 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400">
          <Wand2 className="h-5 w-5" />
          <h3 className="text-base font-bold text-white">
            এআই ব্যাকরণ ও ই’রাব বিশ্লেষক (AI I'rab Analyzer)
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          যেকোনো আরবি বাক্য লিখুন; এআই সাথে সাথে তার জুমলার ধরন, প্রতিটি শব্দের ই’রাব (مرفوع / منصوب / مجرور) এবং ব্যাকরণিক পদ (مبتدأ / خبر / فاعل / مفعول) বের করে দিবে।
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={inputSentence}
            onChange={(e) => setInputSentence(e.target.value)}
            placeholder="এখানে আরবি বাক্য লিখুন (যেমন: كَتَبَ الطَّالِبُ الدَّرْسَ)"
            className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-arabic text-lg text-white placeholder-slate-600 focus:border-amber-500 focus:outline-none text-right"
            dir="rtl"
          />
          <button
            onClick={handleRunAiIrab}
            disabled={isAnalyzing}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-6 py-3 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 shadow-md"
          >
            {isAnalyzing ? (
              <span>বিশ্লেষণ চলছে...</span>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>ই’রাব ও ব্যাকরণ বিশ্লেষণ করুন</span>
              </>
            )}
          </button>
        </div>

        {analysisError && (
          <div className="text-xs text-rose-400">{analysisError}</div>
        )}

        {/* Real AI Breakdown Result */}
        {analysisResult && (
          <div className="rounded-2xl border border-emerald-500/40 bg-slate-950/90 p-5 space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[11px] text-emerald-400 font-bold uppercase">
                  বাক্যের ধরন: {analysisResult.sentenceType}
                </span>
                <div className="text-sm font-semibold text-white mt-1">
                  বাংলা অনুবাদ: {analysisResult.bengaliMeaning}
                </div>
              </div>
              <div className="font-arabic text-2xl text-amber-300 font-bold text-right" dir="rtl">
                {analysisResult.sentenceWithHarakat}
              </div>
            </div>

            {/* Word-by-word I'rab Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-900 text-slate-400">
                  <tr>
                    <th className="p-3">শব্দ (Word)</th>
                    <th className="p-3">প্রকার (Type)</th>
                    <th className="p-3">অর্থ (Meaning)</th>
                    <th className="p-3">পদ (Role)</th>
                    <th className="p-3">ই’রাব (I'rab Analysis)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {analysisResult.words.map((w, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-3 font-arabic text-lg font-bold text-amber-300" dir="rtl">
                        {w.word}
                      </td>
                      <td className="p-3 text-emerald-400 font-medium">{w.type}</td>
                      <td className="p-3">{w.meaning}</td>
                      <td className="p-3 font-semibold text-white">{w.role}</td>
                      <td className="p-3 text-slate-300">{w.irab}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-xl bg-slate-900/80 p-3 text-xs text-slate-300 border border-slate-800">
              💡 <strong>সারসংক্ষেপ:</strong> {analysisResult.ruleSummary}
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Topic Selector on left, Topic Detail on right */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Topic List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ব্যাকরণ পাঠ খুঁজুন..."
              className="w-full rounded-2xl border border-slate-800 bg-slate-900/80 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredTopics.map((topic) => {
              const isSelected = selectedTopicId === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-500/15 shadow-md text-white'
                      : 'border-slate-800 bg-slate-900/40 text-slate-300 hover:bg-slate-900/80 hover:text-white'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase text-emerald-400">
                      {topic.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold">{topic.titleBengali}</h4>
                  </div>
                  <span className="font-arabic text-sm text-amber-300" dir="rtl">
                    {topic.titleArabic}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Topic Detail Content */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-bold text-emerald-300">
                {currentTopic.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-white mt-1">
                {currentTopic.titleBengali}
              </h2>
            </div>
            <span className="font-arabic text-2xl font-bold text-amber-300" dir="rtl">
              {currentTopic.titleArabic}
            </span>
          </div>

          {/* Explanation */}
          <div className="rounded-2xl bg-slate-950/70 p-5 text-xs sm:text-sm leading-relaxed text-slate-200 border border-slate-800">
            {currentTopic.bengaliExplanation}
          </div>

          {/* Rules */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-400">মৌলিক নিয়মাবলী (Rules):</h4>
            <ul className="space-y-2">
              {currentTopic.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Practical Examples */}
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-bold text-amber-300">বাস্তব বাক্যের বিশ্লেষণ:</h4>
            {currentTopic.examples.map((ex, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => speakArabic(ex.arabic)}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>উচ্চারণ শুনুন</span>
                  </button>
                  <div className="font-arabic text-xl font-bold text-amber-300" dir="rtl">
                    {ex.arabic}
                  </div>
                </div>
                <div className="text-xs text-emerald-400 font-medium">উচ্চারণ: {ex.phoneticBn}</div>
                <div className="text-xs text-white font-semibold">অর্থ: {ex.bengali}</div>
                {ex.irabBreakdown && (
                  <div className="rounded-xl bg-slate-900 p-2.5 text-xs text-slate-300 border border-slate-800">
                    🔍 {ex.irabBreakdown}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Topic Quiz */}
          {currentTopic.quiz && currentTopic.quiz.length > 0 && (
            <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase">
                <HelpCircle className="h-4 w-4" />
                <span>স্ব-মূল্যায়ন প্রশ্ন</span>
              </div>
              <p className="text-xs font-semibold text-white">{currentTopic.quiz[0].question}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {currentTopic.quiz[0].options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (i === currentTopic.quiz[0].correctAnswerIndex) {
                        alert('মাশাআল্লাহ! সঠিক উত্তর।');
                        addXp(15);
                      } else {
                        alert('সঠিক হয়নি। পুনরায় চেষ্টা করুন।');
                      }
                    }}
                    className="rounded-xl border border-slate-800 bg-slate-900/90 p-2.5 text-xs text-slate-300 hover:border-emerald-500/50 hover:text-white transition-all text-left"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
