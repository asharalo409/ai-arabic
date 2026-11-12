import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  User,
  Settings,
  Palette,
  Globe,
  RotateCcw,
  CheckCircle,
  Clock,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { Theme, Language } from '../../types';

export const ProfileView: React.FC = () => {
  const { stats, updateStudentName, theme, setTheme, language, setLanguage, resetProgress } = useApp();

  const [name, setName] = useState(stats.name);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateStudentName(name.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleReset = () => {
    if (confirm('আপনি কি সত্যিই আপনার অগ্রগতি ও পয়েন্ট রিসেট করতে চান?')) {
      resetProgress();
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-md flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white text-2xl font-bold shadow-lg shadow-emerald-950">
          <User className="h-8 w-8" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{stats.name}</h1>
          <p className="text-xs text-slate-400">{stats.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Profile Settings */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Settings className="h-4 w-4" />
            <span>ব্যক্তিগত তথ্য ও সেটিংস</span>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                শিক্ষার্থীর পুরো নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                দৈনিক লক্ষ্য (মিনিট)
              </label>
              <input
                type="number"
                disabled
                value={stats.dailyGoalMinutes}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-md flex items-center gap-1.5"
            >
              <CheckCircle className="h-4 w-4" />
              <span>{isSaved ? 'সংরক্ষিত হয়েছে!' : 'পরিবর্তন সংরক্ষণ করুন'}</span>
            </button>
          </form>
        </div>

        {/* Theme and Language Preferences */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-6">
          {/* Theme */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <Palette className="h-4 w-4" />
              <span>থিম নির্বাচন (Theme)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'emerald', label: 'Islamic Emerald', color: 'bg-emerald-500' },
                { id: 'midnight', label: 'Midnight Dark', color: 'bg-indigo-500' },
                { id: 'academic', label: 'Light Academic', color: 'bg-amber-400' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id as Theme)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-[11px] font-semibold transition-all ${
                    theme === t.id
                      ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full mb-1.5 ${t.color}`} />
                  <span>{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Language */}
          <div className="space-y-3 border-t border-slate-800 pt-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <Globe className="h-4 w-4" />
              <span>ইন্টারফেস ভাষা (Language)</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'bn', label: 'বাংলা' },
                { id: 'en', label: 'English' },
                { id: 'ar', label: 'العربية' },
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => setLanguage(l.id as Language)}
                  className={`rounded-xl border p-2.5 text-xs font-semibold transition-all ${
                    language === l.id
                      ? 'border-cyan-500 bg-cyan-500/15 text-cyan-300'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset progress */}
          <div className="border-t border-slate-800 pt-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:underline"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>অগ্রগতি ও পরীক্ষার রেকর্ড রিসেট করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
