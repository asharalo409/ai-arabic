import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Award, Printer, ShieldCheck, Download, Sparkles, CheckCircle2 } from 'lucide-react';

export const CertificatesView: React.FC = () => {
  const { stats, updateStudentName } = useApp();
  const [studentNameInput, setStudentNameInput] = useState(stats.name);
  const [certificateId] = useState(`AAA-${Math.floor(100000 + Math.random() * 900000)}`);
  const issueDate = new Date().toLocaleDateString('bn-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  const handleUpdateName = (e: React.FormEvent) => {
    e.preventDefault();
    if (studentNameInput.trim()) {
      updateStudentName(studentNameInput.trim());
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300">
            <Award className="h-4 w-4" />
            <span>অফিসিয়াল সার্টিফিকেট পোর্টাল</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            কোর্স সমাপ্তির সনদপত্র
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            আপনার অর্জিত দক্ষতার স্বীকৃতি। নিচে নিজের নাম পরিবর্তন করে সার্টিফিকেট প্রিন্ট বা সেভ করুন।
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-2 rounded-2xl bg-amber-500 px-6 py-3.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-950/50"
        >
          <Printer className="h-4 w-4" />
          <span>সার্টিফিকেট প্রিন্ট / PDF সেভ</span>
        </button>
      </div>

      {/* Name Customization input form */}
      <form onSubmit={handleUpdateName} className="flex gap-2 max-w-md">
        <input
          type="text"
          value={studentNameInput}
          onChange={(e) => setStudentNameInput(e.target.value)}
          placeholder="সার্টিফিকেটে প্রদর্শিত নাম লিখুন"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-slate-750 transition-colors"
        >
          নাম আপডেট করুন
        </button>
      </form>

      {/* Printable Certificate Frame */}
      <div className="printable-certificate relative overflow-hidden rounded-3xl border-8 border-amber-500/60 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-8 sm:p-14 text-center shadow-2xl space-y-8">
        {/* Decorative corner motifs */}
        <div className="pointer-events-none absolute top-4 left-4 h-16 w-16 border-t-2 border-l-2 border-amber-400/80" />
        <div className="pointer-events-none absolute top-4 right-4 h-16 w-16 border-t-2 border-r-2 border-amber-400/80" />
        <div className="pointer-events-none absolute bottom-4 left-4 h-16 w-16 border-b-2 border-l-2 border-amber-400/80" />
        <div className="pointer-events-none absolute bottom-4 right-4 h-16 w-16 border-b-2 border-r-2 border-amber-400/80" />

        {/* Certificate Emblem */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-xl shadow-amber-950/50">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950 font-arabic text-3xl font-bold text-amber-400">
            ع
          </div>
        </div>

        <div className="space-y-1">
          <h4 className="font-arabic text-lg sm:text-xl text-amber-300 tracking-wide" dir="rtl">
            أَكَادِيمِيَّةُ اللُّغَةِ العَرَبِيَّةِ بِالذَّكَاءِ الاصْطِنَاعِيِّ
          </h4>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-widest text-white">
            AI ARABIC ACADEMY
          </h2>
          <p className="text-xs uppercase tracking-widest text-emerald-400 font-semibold">
            CERTIFICATE OF ACADEMIC ACHIEVEMENT
          </p>
        </div>

        <div className="space-y-3 py-4 max-w-2xl mx-auto">
          <p className="text-xs text-slate-300">
            এই মর্মে প্রত্যয়ন করা যাচ্ছে যে,
          </p>
          <div className="font-arabic text-3xl sm:text-4xl font-extrabold text-amber-300 border-b border-amber-500/40 pb-3 inline-block px-8">
            {stats.name}
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
            AI ARABIC ACADEMY-এর তত্ত্বাবধানে আধুনিক প্রমিত আরবি (ফুসহা) ও কুরআনিক ব্যাকরণের{' '}
            <strong className="text-emerald-400">মুসতাওয়া ১ : প্রাথমিক স্তর (Level 1)</strong>-এর যাবতীয় পাঠ, শব্দভাণ্ডার, ১৫-লাইনের সংলাপ ও পরীক্ষা সফলতার সাথে সম্পন্ন করেছেন।
          </p>
        </div>

        {/* Signatures & Seal */}
        <div className="grid grid-cols-2 gap-8 border-t border-slate-800 pt-8 sm:grid-cols-3 max-w-2xl mx-auto items-center">
          <div className="text-center space-y-1">
            <div className="font-arabic text-sm text-amber-300">أُسْتَاذَةُ الذَّكَاءِ الاصْطِنَاعِيِّ</div>
            <div className="text-[11px] text-slate-400">প্রধান এআই প্রশিক্ষক</div>
          </div>

          <div className="hidden sm:flex flex-col items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-400 bg-amber-400/10 text-amber-300 font-bold text-[10px] uppercase tracking-wider">
              VERIFIED
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-xs font-bold text-white">{issueDate}</div>
            <div className="text-[11px] text-slate-400">সনদ নম্বর: {certificateId}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
