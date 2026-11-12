import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Flame, CheckCircle, Award, Target, Sparkles, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

export const DailyChallengeView: React.FC = () => {
  const { stats, addXp, navigateTo } = useApp();
  const [completedChallenges, setCompletedChallenges] = useState<string[]>(['ch-1']);

  const challenges = [
    {
      id: 'ch-1',
      title: 'একটি আরবি কথোপকথন শুনুন',
      xp: 25,
      route: '/listening',
      isDone: completedChallenges.includes('ch-1'),
    },
    {
      id: 'ch-2',
      title: 'মাইক্রোফোনে অন্তত ৩টি আরবি বাক্য উচ্চারণ করুন',
      xp: 35,
      route: '/speaking',
      isDone: completedChallenges.includes('ch-2'),
    },
    {
      id: 'ch-3',
      title: 'নাহবের একটি পাঠ সমাপ্ত করুন',
      xp: 30,
      route: '/grammar',
      isDone: completedChallenges.includes('ch-3'),
    },
    {
      id: 'ch-4',
      title: 'এআই শিক্ষকের কাছে একটি ব্যাকরণিক প্রশ্ন জিজ্ঞাসা করুন',
      xp: 20,
      route: '/ai-teacher',
      isDone: completedChallenges.includes('ch-4'),
    },
    {
      id: 'ch-5',
      title: 'কুইজে অংশগ্রহণ করে ৮০%+ স্কোর অর্জন করুন',
      xp: 40,
      route: '/quiz',
      isDone: completedChallenges.includes('ch-5'),
    },
  ];

  const handleClaim = (id: string, xpReward: number) => {
    if (completedChallenges.includes(id)) return;
    setCompletedChallenges((prev) => [...prev, id]);
    addXp(xpReward);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md flex items-center justify-between">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300">
            <Flame className="h-4 w-4 fill-amber-500" />
            <span>দৈনিক মিশন ও চ্যালেঞ্জ</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            আজকের বিশেষ চ্যালেঞ্জসমূহ
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            প্রতিটি মিশন সম্পন্ন করে বোনাস এক্সপি এবং স্ট্রিক বৃদ্ধি করুন।
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-950/80 p-4 border border-slate-800">
          <span className="text-xs text-slate-400">স্ট্রিক ফ্লেম</span>
          <span className="text-2xl font-black text-amber-400">{stats.streak} দিন</span>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {challenges.map((c, idx) => (
          <div
            key={c.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 gap-4 hover:border-amber-500/40 transition-all shadow-md"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                  c.isDone
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {c.isDone ? <CheckCircle className="h-5 w-5" /> : idx + 1}
              </div>

              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white">{c.title}</h4>
                <span className="text-xs text-amber-400 font-semibold">+{c.xp} XP পুরস্কার</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigateTo(c.route)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                অনুশীলনে যান
              </button>

              {c.isDone ? (
                <span className="rounded-xl bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-400 border border-emerald-500/30">
                  পুরস্কার সংগৃহীত
                </span>
              ) : (
                <button
                  onClick={() => handleClaim(c.id, c.xp)}
                  className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md"
                >
                  দাবি করুন (+{c.xp} XP)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
