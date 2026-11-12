import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { COURSE_LEVELS } from '../../data/curriculumData';
import { VOCABULARY_LIST } from '../../data/vocabularyData';
import {
  ShieldAlert,
  PlusCircle,
  FolderPlus,
  BookOpen,
  Bookmark,
  CheckCircle,
  Award,
  Layers,
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chapters' | 'lessons' | 'vocab'>('chapters');

  // Form states
  const [newChapterTitle, setNewChapterTitle] = useState('');
  const [newChapterTitleArabic, setNewChapterTitleArabic] = useState('');
  const [newChapterGoal, setNewChapterGoal] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleCreateChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (newChapterTitle && newChapterTitleArabic) {
      setSuccessMessage(`নতুন অধ্যায় "${newChapterTitle}" সফলভাবে যুক্ত হয়েছে (ডেমো মোড)`);
      setNewChapterTitle('');
      setNewChapterTitleArabic('');
      setNewChapterGoal('');
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Development Prototype Banner as required */}
      <div className="rounded-3xl border border-amber-500/40 bg-amber-950/30 p-6 flex items-start gap-4 text-amber-200">
        <ShieldAlert className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs sm:text-sm">
          <h3 className="font-bold text-amber-300">
            [ডেভেলপমেন্ট প্রোটোটাইপ মোড] কন্টেন্ট ম্যানেজমেন্ট পোর্টাল
          </h3>
          <p className="leading-relaxed text-amber-200/90">
            এই অ্যাডমিন প্যানেলটি পাঠ্যক্রম, ১০০০টি লেসন ও শব্দভাণ্ডার সমৃদ্ধ করার উন্নয়ন কাঠামো হিসেবে প্রস্তুত করা হয়েছে। লাইভ প্রোডাকশনে এটিকে অ্যাডমিন রোল অথেন্টিকেশন দিয়ে সুরক্ষিত রাখতে হবে।
          </p>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        {[
          { id: 'chapters', label: 'অধ্যায় ব্যবস্থাপনা (Chapters)', icon: FolderPlus },
          { id: 'lessons', label: 'পাঠ ব্যবস্থাপনা (Lessons)', icon: BookOpen },
          { id: 'vocab', label: 'শব্দকোষ ব্যবস্থাপনা (Vocabulary)', icon: Bookmark },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {successMessage && (
        <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-4 text-xs font-semibold text-emerald-300 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Chapters Management Tab */}
      {activeTab === 'chapters' && (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Add chapter form */}
          <div className="md:col-span-5 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">নতুন অধ্যায় যুক্ত করুন</h3>
            <form onSubmit={handleCreateChapter} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1">অধ্যায়ের বাংলা নাম</label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="যেমন: পরিচ্ছন্নতা ও অজু"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">অধ্যায়ের আরবি নাম (পূর্ণ হরকতসহ)</label>
                <input
                  type="text"
                  value={newChapterTitleArabic}
                  onChange={(e) => setNewChapterTitleArabic(e.target.value)}
                  placeholder="যেমন: الطَّهَارَةُ وَالوُضُوءُ"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white text-right font-arabic focus:outline-none focus:border-emerald-500"
                  dir="rtl"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-slate-300 mb-1">শিখন লক্ষ্য</label>
                <textarea
                  rows={3}
                  value={newChapterGoal}
                  onChange={(e) => setNewChapterGoal(e.target.value)}
                  placeholder="এই অধ্যায় সম্পন্ন করে শিক্ষার্থী কী শিখবে..."
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-600 p-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-md"
              >
                অধ্যায় সংরক্ষণ করুন
              </button>
            </form>
          </div>

          {/* Existing chapters overview */}
          <div className="md:col-span-7 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white">বর্তমান কারিকুলাম কাঠামোর অধ্যায়সমূহ</h3>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {COURSE_LEVELS[0].chapters.map((ch) => (
                <div
                  key={ch.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-950/70 p-4 border border-slate-800"
                >
                  <div>
                    <span className="text-[10px] text-amber-400 font-bold">
                      অধ্যায় {ch.chapterNumber}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-white">{ch.title}</h4>
                    <p className="text-[11px] text-slate-400">{ch.learningGoal}</p>
                  </div>
                  <span className="font-arabic text-base text-emerald-400 font-bold" dir="rtl">
                    {ch.titleArabic}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lessons Tab */}
      {activeTab === 'lessons' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">পাঠ (Lesson) সংযোজন ও ২২-ফিচার ফ্রেমওয়ার্ক</h3>
          <p className="text-xs text-slate-400">
            প্রতিটি পাঠে ১৫-লাইনের সংলাপ, শব্দভাণ্ডার, হরকত, নাহব ব্যাকরণ এবং স্পিকিং ও কুইজ প্রশ্ন অন্তর্ভুক্ত থাকে।
          </p>
          <div className="rounded-2xl bg-slate-950 p-5 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="font-bold text-emerald-400">বর্তমান সক্রিয় লেসনসমূহ:</div>
            <div>• লেসন ১.১: সালাম ও প্রারম্ভিক কথোপকথন (التَّحِيَّةُ وَالتَّعَارُفُ الأَوَّلُ)</div>
            <div>• লেসন ১.২: দেশ ও জাতীয়তা (مِنْ أَيْنَ أَنْتَ؟ وَالْجِنْسِيَّةُ)</div>
            <div className="pt-2 text-slate-500">
              [উন্নত কারিকুলাম ইঞ্জিনের মাধ্যমে নতুন পাঠ স্বয়ংক্রিয়ভাবে জেনারেট বা যুক্ত করা যাবে]
            </div>
          </div>
        </div>
      )}

      {/* Vocabulary Management Tab */}
      {activeTab === 'vocab' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">
            শব্দকোষ ডেটাবেজ ({VOCABULARY_LIST.length} টি শব্দ সংরক্ষিত)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400">
                <tr>
                  <th className="p-3">আরবি (হরকতসহ)</th>
                  <th className="p-3">বাংলা অর্থ</th>
                  <th className="p-3">ইংরেজি</th>
                  <th className="p-3">ক্যাটাগরি</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {VOCABULARY_LIST.map((w) => (
                  <tr key={w.id}>
                    <td className="p-3 font-arabic text-lg font-bold text-amber-300" dir="rtl">
                      {w.arabic}
                    </td>
                    <td className="p-3 text-white">{w.bengali}</td>
                    <td className="p-3 text-slate-400">{w.english}</td>
                    <td className="p-3 text-emerald-400">{w.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
