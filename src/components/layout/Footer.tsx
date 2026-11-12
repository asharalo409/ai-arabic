import React from 'react';
import { useApp } from '../../context/AppContext';
import { BookOpen, Sparkles, ShieldCheck, Heart, Award, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="border-t border-emerald-950/60 bg-slate-950 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950 font-arabic text-xl font-bold text-amber-400">
                  ع
                </div>
              </div>
              <div>
                <span className="font-bold text-white tracking-wide">
                  AI ARABIC <span className="text-emerald-400">ACADEMY</span>
                </span>
                <p className="font-arabic text-xs text-amber-400/80" dir="rtl">
                  الأَكَادِيمِيَّةُ العَرَبِيَّةُ بِالذَّكَاءِ الاصْطِنَاعِيِّ
                </p>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              আধুনিক প্রমিত আরবি (ফুসহা) ও পবিত্র কুরআনের আরবি ভাষা শিক্ষার শীর্ষতম প্ল্যাটফর্ম। স্কুল, কলেজ, বিশ্ববিদ্যালয় ও মাদরাসার শিক্ষার্থীদের জন্য এআই প্রযুক্তির সহায়তায় সহজতম পদ্ধতি।
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>প্রামাণ্য নাহব, সরফ ও তাফসির ভিত্তিক পাঠ্যক্রম</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              মূল বিভাগসমূহ
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('/courses')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ১,০০০ লেসনের পূর্ণাঙ্গ পাঠ্যক্রম
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/ai-teacher')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  এআই আরবি ওস্তাদ (Gemini AI)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/quranic-arabic')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  কুরআনিক আরবি ও ধাতু বিশ্লেষণ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/grammar')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  নাহব ও সরফ ব্যাকরণ কোষ
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/vocabulary')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ফ্ল্যাশকার্ড ও শব্দভাণ্ডার
                </button>
              </li>
            </ul>
          </div>

          {/* Interactive Modules */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              ইন্টারেক্টিভ লার্নিং
            </h4>
            <ul className="mt-4 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigateTo('/listening')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  শ্রবণ ও উচ্চারণ অডিও প্লেয়ার
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/speaking')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  মাইক্রোফোন ভয়েস স্পিকিং টেস্ট
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/quiz')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ৮ ধরনের প্রশ্নসহ অনলাইন পরীক্ষা
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/practice')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  আরবি কিবোর্ড ও লেখনী ড্রিল
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/certificates')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  ভেরিফাইড কোর্স সার্টিফিকেট
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Goal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              আমাদের লক্ষ্য
            </h4>
            <div className="mt-4 rounded-xl border border-emerald-900/40 bg-emerald-950/20 p-4">
              <p className="font-arabic text-sm text-amber-300" dir="rtl">
                إِنَّا أَنزَلْنَاهُ قُرْآنًا عَرَبِيًّا لَّعَلَّكُمْ تَعْقِلُونَ
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-300">
                "নিশ্চয়ই আমি একে আরবি ভাষায় কুরআনরূপে নাজিল করেছি, যাতে তোমরা বুঝতে পারো।" (সূরা ইউসুফ: ২)
              </p>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <span>বাংলাভাষী শিক্ষার্থীদের জন্য এক অনবদ্য উপহার</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between border-t border-slate-900 pt-6 sm:flex-row">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AI Arabic Academy. All rights reserved. Powered by Google Gemini.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-400 sm:mt-0">
            <button onClick={() => navigateTo('/admin')} className="hover:text-emerald-400">
              অ্যাডমিন পোর্টাল
            </button>
            <span>•</span>
            <button onClick={() => navigateTo('/dashboard')} className="hover:text-emerald-400">
              স্টুডেন্ট ড্যাশবোর্ড
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
