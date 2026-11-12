import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSE_LEVELS } from '../../data/curriculumData';
import { CourseLevelId } from '../../types';
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Lock,
  ChevronRight,
  Layers,
  Award,
  Sparkles,
} from 'lucide-react';

export const CoursesView: React.FC = () => {
  const { navigateTo, setSelectedLessonId, stats } = useApp();
  const [selectedLevelId, setSelectedLevelId] = useState<CourseLevelId>('beginner');

  const currentLevel = COURSE_LEVELS.find((l) => l.id === selectedLevelId) || COURSE_LEVELS[0];

  const handleOpenLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    navigateTo('/courses/lesson');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Page Header */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-slate-950 p-6 sm:p-8 backdrop-blur-md">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <GraduationCap className="h-4 w-4" />
            <span>১,০০০ লেসনের পূর্ণাঙ্গ শিক্ষাক্রম</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white">
            কোর্স পাঠ্যক্রম ও অধ্যায়সমূহ
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            মৌলিক বর্ণমালা থেকে আধুনিক প্রমিত আরবি এবং উচ্চতর কুরআনিক ভাষার পরিপূর্ণ কাঠামো। নিচের স্তর ও অধ্যায় নির্বাচন করে কাঙ্ক্ষিত পাঠে প্রবেশ করুন।
          </p>
        </div>
      </div>

      {/* 6 Levels Selector Tabs */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {COURSE_LEVELS.map((lvl) => {
          const isSelected = lvl.id === selectedLevelId;
          return (
            <button
              key={lvl.id}
              onClick={() => setSelectedLevelId(lvl.id)}
              className={`flex flex-col items-center justify-center rounded-2xl p-4 text-center transition-all border ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-lg shadow-emerald-950/50 text-white'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
              }`}
            >
              <span className="text-xs font-bold text-amber-400">লেভেল {lvl.levelNumber}</span>
              <span className="mt-1 font-arabic text-sm font-semibold" dir="rtl">
                {lvl.nameAr}
              </span>
              <span className="mt-1 text-[11px] text-slate-400">
                {lvl.chaptersCount} অধ্যায়
              </span>
            </button>
          );
        })}
      </div>

      {/* Current Level Info Banner */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white">{currentLevel.nameBn}</h3>
          <p className="text-xs text-slate-400">{currentLevel.description}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span className="rounded-lg bg-slate-800 px-3 py-1.5 font-medium">
            সর্বমোট অধ্যায়: {currentLevel.chaptersCount}
          </span>
          <span className="rounded-lg bg-emerald-500/20 text-emerald-300 px-3 py-1.5 font-medium">
            পরিকল্পিত পাঠ: {currentLevel.lessonsCount}
          </span>
        </div>
      </div>

      {/* Chapters & Lessons Listing */}
      <div className="space-y-6">
        {currentLevel.chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="rounded-3xl border border-slate-800 bg-slate-900/40 p-6 shadow-md space-y-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-400">
                    অধ্যায় {chapter.chapterNumber}
                  </span>
                  <h3 className="text-base font-bold text-white">{chapter.title}</h3>
                </div>
                <p className="mt-1 text-xs text-slate-400">{chapter.description}</p>
              </div>
              <span className="font-arabic text-base font-semibold text-emerald-400" dir="rtl">
                {chapter.titleArabic}
              </span>
            </div>

            {/* Lessons Grid within this chapter */}
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {chapter.lessons.length > 0 ? (
                chapter.lessons.map((lesson) => {
                  const isCompleted = stats.completedLessonIds.includes(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className="group flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-emerald-500/50 hover:bg-slate-900/80"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                            isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {isCompleted ? <CheckCircle className="h-5 w-5" /> : lesson.lessonNumber}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                              {lesson.title}
                            </h4>
                          </div>
                          <p className="font-arabic text-xs text-amber-300/80" dir="rtl">
                            {lesson.titleArabic}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleOpenLesson(lesson.id)}
                        className="flex items-center gap-1 rounded-xl bg-emerald-600/20 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      >
                        <PlayCircle className="h-4 w-4" />
                        <span>পাঠ শুরু</span>
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-2 rounded-2xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-500">
                  এই অধ্যায়ের পাঠক্রমটি উন্মুক্ত হচ্ছে। প্রাথমিক অধ্যায়ের পাঠগুলো অনুশীলন করে এগিয়ে যান।
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Scalable curriculum notice */}
        <div className="rounded-2xl border border-emerald-900/30 bg-emerald-950/15 p-5 text-center text-xs text-slate-400">
          <p>
            💡 <strong className="text-emerald-400">১০০০ লেসন কারিকুলাম ফ্রেমওয়ার্ক:</strong> প্রতিটি স্তরের অধ্যায় ও লেসনে ধাপে ধাপে জটিলতা বৃদ্ধি পায় এবং ২২টি সম্পূর্ণ শিক্ষণ উপাদান স্বয়ংক্রিয়ভাবে কার্যকর রয়েছে।
          </p>
        </div>
      </div>
    </div>
  );
};
