import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  BookOpen,
  Bot,
  Headphones,
  Mic,
  Award,
  ChevronRight,
  CheckCircle2,
  Users,
  Compass,
  Zap,
  Globe2,
  Play,
  Flame,
  Star,
  Layers,
  GraduationCap,
} from 'lucide-react';
import { COURSE_LEVELS } from '../../data/curriculumData';
import { speakArabic } from '../../services/speechService';

export const HomeView: React.FC = () => {
  const { navigateTo, setSelectedLessonId, language } = useApp();

  const handleStartLearning = () => {
    setSelectedLessonId('beg-1-1');
    navigateTo('/courses');
  };

  const handlePlaySampleAudio = () => {
    speakArabic('بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ. مَرْحَبًا بِكُمْ فِي أَكَادِيمِيَّةِ الْعَرَبِيَّةِ');
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24">
        {/* Glow ambient background lights */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />
        <div className="pointer-events-none absolute top-40 right-10 -z-10 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-4 py-1.5 text-xs font-semibold text-emerald-300 shadow-sm backdrop-blur-md">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>বাংলাদেশে প্রথম এআই চালিত সর্বাধুনিক আরবি শিক্ষা একাডেমি</span>
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                সহজ পদ্ধতিতে শিখুন{' '}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                  কুরআনিক ও আধুনিক
                </span>{' '}
                আরবি ভাষা
              </h1>

              {/* Subheading */}
              <p className="text-base text-slate-300 sm:text-lg leading-relaxed">
                স্কুল, কলেজ, বিশ্ববিদ্যালয় ও মাদরাসার শিক্ষার্থী এবং সাধারণ অনুরাগীদের জন্য তৈরি ১০০০ লেসনের পূর্ণাঙ্গ পাঠ্যক্রম, ২৪/৭ পার্সোনালাইজড জেমিনাই এআই শিক্ষক এবং মাইক্রোফোন ভয়েস উচ্চারণ অনুশীলন।
              </p>

              {/* Arabic Calligraphy Accent */}
              <div className="flex items-center justify-center gap-3 rounded-2xl border border-amber-500/20 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-emerald-950/30 p-3 sm:justify-start">
                <span className="font-arabic text-xl sm:text-2xl text-amber-300" dir="rtl">
                  تَعَلَّمُوا الْعَرَبِيَّةَ فَإِنَّهَا تُثَبِّتُ الْعَقْلَ
                </span>
                <button
                  onClick={handlePlaySampleAudio}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 hover:bg-amber-500/40 transition-colors"
                  title="আরবি উচ্চারণ শুনুন"
                >
                  <Play className="h-4 w-4 fill-amber-400" />
                </button>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={handleStartLearning}
                  className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/40 transition-all hover:from-emerald-500 hover:to-teal-500 hover:scale-[1.02] focus:outline-none"
                >
                  <GraduationCap className="h-5 w-5" />
                  <span>এখনই শেখা শুরু করুন</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={() => navigateTo('/ai-teacher')}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-7 py-3.5 text-sm font-semibold text-slate-200 transition-all hover:border-emerald-500/50 hover:bg-slate-850 hover:text-white"
                >
                  <Bot className="h-5 w-5 text-amber-400" />
                  <span>এআই ওস্তাদের সাথে কথা বলুন</span>
                </button>
              </div>

              {/* Key Features Bullet Pills */}
              <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>সম্পূর্ণ হরকত ও উচ্চারণ</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>বাংলা মাধ্যমে বিস্তারিত ব্যাখ্যা</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>রিয়েল-টাইম অডিও ও স্পিকিং</span>
                </div>
              </div>
            </div>

            {/* Right Interactive Teaser Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-slate-900/90 to-slate-950 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                      <Bot className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">উস্তাযা এআই (AI Tutor)</h4>
                      <p className="text-[11px] text-emerald-400">অনলাইন • ২৪ ঘণ্টা পাঠদানরত</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-500/20 px-2.5 py-1 text-[11px] font-semibold text-amber-400">
                    Gemini 3.8
                  </span>
                </div>

                {/* Simulated Conversation Bubble */}
                <div className="my-4 space-y-3 text-xs">
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-none bg-emerald-600/30 p-3 text-emerald-200 border border-emerald-500/30">
                      ছাত্র: ওস্তাদজি, "كَتَبَ" এবং "يَكْتُبُ" এর মাঝে পার্থক্য কী?
                    </div>
                  </div>

                  <div className="flex justify-start">
                    <div className="max-w-[90%] rounded-2xl rounded-tl-none bg-slate-800/90 p-3.5 text-slate-200 border border-slate-700/60 space-y-2">
                      <div className="font-semibold text-amber-300">
                        মাশাআল্লাহ! চমৎকার ব্যাকরণগত প্রশ্ন:
                      </div>
                      <div className="rounded-lg bg-slate-900/90 p-2 font-arabic text-sm text-emerald-300" dir="rtl">
                        كَتَبَ (فِعْلٌ مَاضٍ) = সে লিখেছে (অতীতকাল)<br />
                        يَكْتُبُ (فِعْلٌ مُضَارِعٌ) = সে লিখছে বা লিখবে (বর্তমান/ভবিষ্যৎ)
                      </div>
                      <p className="text-[11px] text-slate-300">
                        মূল ধাতু: ك - ت - ب (কা-তা-বা)।
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigateTo('/ai-teacher')}
                  className="w-full rounded-xl bg-slate-800/80 hover:bg-slate-750 py-2.5 text-xs font-semibold text-emerald-300 border border-emerald-500/30 transition-colors flex items-center justify-center gap-2"
                >
                  <span>সম্পূর্ণ এআই চ্যাটে প্রবেশ করুন</span>
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Platform Statistics Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:grid-cols-4 sm:p-8 backdrop-blur-sm">
          <div className="text-center">
            <div className="text-2xl font-black text-emerald-400 sm:text-4xl">১,০০০+</div>
            <div className="mt-1 text-xs text-slate-400">পরিকল্পিত পাঠ (Lessons)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-amber-400 sm:text-4xl">১০০</div>
            <div className="mt-1 text-xs text-slate-400">সুশৃঙ্খল অধ্যায় (Chapters)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-cyan-400 sm:text-4xl">৬টি</div>
            <div className="mt-1 text-xs text-slate-400">দক্ষতা স্তর (Levels)</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-black text-rose-400 sm:text-4xl">১০০%</div>
            <div className="mt-1 text-xs text-slate-400">বাংলা উচ্চারণ ও অর্থসহ</div>
          </div>
        </div>
      </section>

      {/* 3. Course Levels Breakdown */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            পাঠ্যক্রমের স্তরবিন্যাস
          </span>
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            প্রাথমিক বর্ণমালা থেকে প্রাতিষ্ঠানিক ও কুরআনিক পাণ্ডিত্য
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            প্রতিটি স্তর সুনির্দিষ্ট উদ্দেশ্য ও শিখনফল অনুযায়ী প্রস্তুত করা হয়েছে।
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {COURSE_LEVELS.map((level) => (
            <div
              key={level.id}
              className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-emerald-500/40 hover:bg-slate-900/80 shadow-md flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-emerald-500/20 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    লেভেল {level.levelNumber}
                  </span>
                  <span className="font-arabic text-sm text-amber-400" dir="rtl">
                    {level.nameAr}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {level.nameBn}
                </h3>

                <p className="text-xs leading-relaxed text-slate-400">
                  {level.description}
                </p>
              </div>

              <div className="mt-6 border-t border-slate-800/80 pt-4 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {level.chaptersCount} অধ্যায় • {level.lessonsCount} পাঠ
                </span>
                <button
                  onClick={() => {
                    setSelectedLessonId(level.chapters[0]?.lessons[0]?.id || 'beg-1-1');
                    navigateTo('/courses');
                  }}
                  className="flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:underline"
                >
                  <span>অধ্যায়সমূহ দেখুন</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            কেন AI Arabic Academy অনন্য?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            প্রচলিত বইয়ের সীমাবদ্ধতা অতিক্রম করে আধুনিক প্রযুক্তি ও বিশুদ্ধ ব্যাকরণের মেলবন্ধন।
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <Bot className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white">বুদ্ধিমান এআই ওস্তাদ</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              যেকোনো আরবি বাক্য দিলে সাথে সাথে তার নাহব ও সরফের তারকীব (I'rab) এবং বিশ্লেষণ করে দেয়।
            </p>
            <button
              onClick={() => navigateTo('/ai-teacher')}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              এআই শিক্ষক ব্যবহার করুন →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400">
              <Mic className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white">ভয়েস স্পিকিং টেস্ট</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              মাইক্রোফোনে আরবি পড়ে নিজের উচ্চারণ ও মাখরাজ যাচাই করুন। স্কোর ও নির্ভুল নির্দেশনা পান।
            </p>
            <button
              onClick={() => navigateTo('/speaking')}
              className="text-xs font-semibold text-amber-400 hover:underline"
            >
              উচ্চারণ প্র্যাকটিস করুন →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
              <Sparkles className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white">শব্দে শব্দে কুরআনিক আরবি</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              কুরআনের প্রতিটি আয়াতের শব্দভিত্তিক ধাতু (Root), ব্যাকরণিক পদ ও ভাবার্থের গভীর শিক্ষা।
            </p>
            <button
              onClick={() => navigateTo('/quranic-arabic')}
              className="text-xs font-semibold text-cyan-400 hover:underline"
            >
              কুরআনিক সেকশনে যান →
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 space-y-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-purple-400">
              <Headphones className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-white">ধীরগতির অডিও প্লেয়ার</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              স্বাভাবিক এবং ধীরগতিতে (0.65x) নিখুঁত আরবি অডিও প্লেব্যাক সুবিধা।
            </p>
            <button
              onClick={() => navigateTo('/listening')}
              className="text-xs font-semibold text-purple-400 hover:underline"
            >
              লিসেনিং ল্যাবে যান →
            </button>
          </div>
        </div>
      </section>

      {/* 5. Quranic Arabic Showcase Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-r from-emerald-950 via-slate-900 to-amber-950/40 p-8 sm:p-12">
          <div className="relative z-10 space-y-6 max-w-2xl">
            <span className="rounded-full bg-amber-400/20 px-3.5 py-1 text-xs font-bold text-amber-300">
              বিশেষায়িত কুরআন মডিউল
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              পবিত্র কুরআনের শব্দভাণ্ডার ও ব্যাকরণ সরাসরি আয়াতের আলোতে
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              অর্থ বুঝে সালাত ও তিলাওয়াত উপভোগ করুন। প্রতিটি আয়াতের শব্দে শব্দে ধাতু বিশ্লেষণ ও রূপতাত্ত্বিক গবেষণা নিয়ে প্রস্তুত করা হয়েছে আমাদের কুরআন প্রশিক্ষণ বিভাগ।
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigateTo('/quranic-arabic')}
                className="rounded-xl bg-amber-500 px-6 py-3 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-colors shadow-lg"
              >
                কুরআনিক আরবি ক্লাসে প্রবেশ করুন
              </button>
              <button
                onClick={() => navigateTo('/grammar')}
                className="rounded-xl border border-slate-700 bg-slate-900/60 px-6 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-800 transition-colors"
              >
                নাহব ও সরফ দেখুন
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white">শিক্ষার্থীদের প্রতিক্রিয়া</h2>
          <p className="text-xs text-slate-400 mt-1">
            মাদরাসা, বিশ্ববিদ্যালয় ও জেনারেল শিক্ষার্থীদের বাস্তব অনুভূতি
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              "আমি একটি কওমি মাদরাসার ফযিলত জামাতের ছাত্র। এখানে নাহব-সরফের নিয়ম যেভাবে এআই দিয়ে প্র্যাকটিক্যালি তুলে ধরা হয়েছে তা সত্যিই অভূতপূর্ব!"
            </p>
            <div>
              <h5 className="text-xs font-bold text-white">মাওলানা আবরারুল হক</h5>
              <p className="text-[11px] text-slate-400">মাদরাসা শিক্ষক ও আরবি শিক্ষার্থী</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              "ঢাকা বিশ্ববিদ্যালয়ে ইংরেজি সাহিত্যের ছাত্র হিসেবে সবসময় ইচ্ছা ছিল কুরআনের ভাষা শেখার। এই প্ল্যাটফর্মের বাংলা উচ্চারণ ও অডিও আমার শেখাকে ১০ গুণ সহজ করেছে।"
            </p>
            <div>
              <h5 className="text-xs font-bold text-white">তানভীর আহমেদ</h5>
              <p className="text-[11px] text-slate-400">বিশ্ববিদ্যালয় শিক্ষার্থী</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 space-y-4">
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-400" />
              ))}
            </div>
            <p className="text-xs leading-relaxed text-slate-300">
              "আমি সম্পূর্ণ শূন্য থেকে শুরু করেছিলাম। এখন আমি আলহামদুলিল্লাহ সহজে আরবি বাক্য পড়তে পারি এবং প্রতিদিন এআই ওস্তাদের সাথে আরবিতে বার্তা বিনিময় করি।"
            </p>
            <div>
              <h5 className="text-xs font-bold text-white">নুসরাত জাহান</h5>
              <p className="text-[11px] text-slate-400">গৃহিণী ও শিক্ষানবিস</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Bottom Call to Action */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/40 to-slate-950 p-8 sm:p-12 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            আজই শুরু করুন আপনার আরবি ভাষার স্বর্ণালী যাত্রা
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            কোনো রেজিস্ট্রেশন ফি নেই। সম্পূর্ণ বিনামূল্যে এবং উন্মুক্তভাবে শিখুন কুরআনের পবিত্র ভাষা।
          </p>
          <div className="pt-2">
            <button
              onClick={handleStartLearning}
              className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-8 py-3.5 text-sm font-bold text-slate-950 transition-all shadow-lg shadow-emerald-950/50"
            >
              প্রথম পাঠে প্রবেশ করুন (বিনামূল্যে)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
