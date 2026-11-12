import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart2,
  Award,
  Flame,
  Clock,
  BookOpen,
  CheckCircle,
  Play,
  Bookmark,
  ChevronRight,
  TrendingUp,
  Target,
  Trophy,
  GraduationCap,
} from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { stats, navigateTo, setSelectedLessonId } = useApp();

  const handleContinueLearning = () => {
    setSelectedLessonId('beg-1-1');
    navigateTo('/courses/lesson');
  };

  const hours = Math.floor(stats.studyMinutes / 60);
  const remainingMins = stats.studyMinutes % 60;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner with Student Greeting and Continue Button */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <GraduationCap className="h-4 w-4" />
            <span>শিক্ষার্থী পোর্টাল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            মারহাবা, {stats.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            আজকের আরবি শিক্ষা লক্ষ্য পূরণে আরও ১৫ মিনিট অনুশীলন করুন। ধারাবাহিকতা জ্ঞানের আলো বাড়ায়।
          </p>
        </div>

        <button
          onClick={handleContinueLearning}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-7 py-4 text-xs sm:text-sm font-bold text-white shadow-xl shadow-emerald-950 hover:scale-[1.02] transition-all"
        >
          <Play className="h-4 w-4 fill-white" />
          <span>শেখা চালিয়ে যান (Continue Learning)</span>
        </button>
      </div>

      {/* 4 Key Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Metric 1: XP */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-emerald-400">
            <Award className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase">অর্জিত পয়েন্ট</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.xp}</div>
          <p className="text-[11px] text-slate-400">লেভেল ১ : প্রাথমিক শিক্ষানবিস</p>
        </div>

        {/* Metric 2: Streak */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-amber-500">
            <Flame className="h-5 w-5 fill-amber-500" />
            <span className="text-[11px] font-bold uppercase">দৈনিক স্ট্রিক</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{stats.streak} দিন</div>
          <p className="text-[11px] text-slate-400">প্রতিদিন পড়ার ধারা অব্যাহত রাখুন</p>
        </div>

        {/* Metric 3: Lessons Completed */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-cyan-400">
            <BookOpen className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase">সম্পন্ন পাঠ</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {stats.completedLessonIds.length} টি
          </div>
          <p className="text-[11px] text-slate-400">সর্বমোট ১,০০০ পাঠের মধ্যে</p>
        </div>

        {/* Metric 4: Total Study Time */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
          <div className="flex items-center justify-between text-purple-400">
            <Clock className="h-5 w-5" />
            <span className="text-[11px] font-bold uppercase">মোট সময়</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {hours > 0 ? `${hours} ঘণ্টা ` : ''}{remainingMins} মিনিট
          </div>
          <p className="text-[11px] text-slate-400">সক্রিয় শেখার কাল</p>
        </div>
      </div>

      {/* Main Grid: Learning Target & Progress Bar + Quick Links */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Progress & Daily Target */}
        <div className="lg:col-span-8 space-y-6">
          {/* Daily Goal Card */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">আজকের পড়াশোনার লক্ষ্য</h3>
              </div>
              <span className="text-xs text-amber-300 font-semibold">
                ১৫ / {stats.dailyGoalMinutes} মিনিট (৫০%)
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 w-1/2" />
            </div>

            <p className="text-xs text-slate-400">
              দৈনিক লক্ষ্য পূরণ করলে আরও ৫০ বোনাস এক্সপি এবং স্ট্রিক ফ্লেম অর্জিত হবে।
            </p>
          </div>

          {/* Recent Lessons & Activity */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">সাম্প্রতিক পাঠ ও অগ্রগতি</h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-950/70 p-4 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      সালাম ও প্রারম্ভিক কথোপকথন
                    </h4>
                    <p className="text-[11px] text-slate-400">লেভেল ১ • অধ্যায় ১ • পাঠ ১</p>
                  </div>
                </div>

                <button
                  onClick={handleContinueLearning}
                  className="rounded-xl bg-slate-800 px-3.5 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-slate-700"
                >
                  পুনরায় পড়ুন
                </button>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-950/70 p-4 border border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-slate-400 font-bold">
                    ২
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white">
                      দেশ ও জাতীয়তা (الجنسية والبلد)
                    </h4>
                    <p className="text-[11px] text-slate-400">লেভেল ১ • অধ্যায় ১ • পাঠ ২</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedLessonId('beg-1-2');
                    navigateTo('/courses/lesson');
                  }}
                  className="rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                >
                  শুরু করুন
                </button>
              </div>
            </div>
          </div>

          {/* Exam History Record */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">পরীক্ষার ফলাফল হিস্ট্রি</h3>
              <button
                onClick={() => navigateTo('/quiz')}
                className="text-xs text-emerald-400 hover:underline"
              >
                নতুন পরীক্ষা দিন →
              </button>
            </div>

            <div className="space-y-2">
              {stats.quizScores.map((qs, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 text-xs border border-slate-800"
                >
                  <span className="font-semibold text-white">পরীক্ষা #{i + 1}</span>
                  <span className="text-slate-400">{qs.date}</span>
                  <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-emerald-400 font-bold">
                    {qs.score} / {qs.total} ({Math.round((qs.score / qs.total) * 100)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Saved Vocabulary */}
        <div className="lg:col-span-4 space-y-6">
          {/* Achievement Badges */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center gap-2 text-amber-400">
              <Trophy className="h-5 w-5" />
              <h3 className="text-base font-bold text-white">অর্জিত ব্যাজসমূহ</h3>
            </div>

            <div className="space-y-3">
              {stats.badges.map((badge, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 rounded-2xl bg-slate-950/70 p-3 border border-slate-800"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 font-bold text-xs">
                    ★
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">{badge}</h5>
                    <p className="text-[10px] text-slate-400">ধারাবাহিক অনুশীলনে অর্জিত</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Vocabulary Quick Widget */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400">
                <Bookmark className="h-5 w-5" />
                <h3 className="text-base font-bold text-white">প্রিয় শব্দসমূহ</h3>
              </div>
              <span className="text-xs text-slate-400">{stats.favoriteWordIds.length} টি সংরক্ষিত</span>
            </div>

            <button
              onClick={() => navigateTo('/vocabulary')}
              className="w-full rounded-xl bg-slate-800 p-3 text-xs font-semibold text-emerald-400 hover:bg-slate-750 transition-colors text-center"
            >
              শব্দভাণ্ডারে যান →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
