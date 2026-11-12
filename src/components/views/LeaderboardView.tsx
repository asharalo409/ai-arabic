import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trophy, Medal, Flame, Award, Star, ShieldCheck } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const { stats } = useApp();
  const [tab, setTab] = useState<'weekly' | 'alltime'>('weekly');

  const rankingData = [
    { rank: 1, name: 'মুহাম্মাদ আব্দুল্লাহ', institute: 'জামিয়া ইসলামিয়া', xp: 1420, streak: 28, badge: 'স্বর্ণপদক' },
    { rank: 2, name: 'ত্বহা আহমাদ (আপনি)', institute: 'AI Arabic Academy', xp: stats.xp, streak: stats.streak, badge: 'রৌপ্যপদক', isCurrentUser: true },
    { rank: 3, name: 'মারিয়াম খাতুন', institute: 'ঢাকা বিশ্ববিদ্যালয়', xp: 1180, streak: 19, badge: 'ব্রোঞ্জপদক' },
    { rank: 4, name: 'হাসান আল-বন্না', institute: 'দারুল উলুম', xp: 950, streak: 14, badge: 'ইলমে তৌফিক' },
    { rank: 5, name: 'ফারহানা ইসলাম', institute: 'আইআইইউসি', xp: 870, streak: 11, badge: 'জ্ঞানসাধক' },
    { rank: 6, name: 'ওমর ফারুক', institute: 'মাদরাসা মারকায', xp: 760, streak: 9, badge: 'মুজতাহিদ' },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-semibold text-amber-300">
          <Trophy className="h-4 w-4" />
          <span>শীর্ষ শিক্ষার্থী লিডারবোর্ড</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          গৌরবময় মেধা তালিকা
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          নিয়মিত পাঠ সম্পন্ন ও পরীক্ষায় প্রাপ্ত এক্সপি (XP) পয়েন্টের ভিত্তিতে সাপ্তাহিক ও সামগ্রিক র‍্যাঙ্কিং।
        </p>

        {/* Tab switcher */}
        <div className="pt-4 flex justify-center gap-2">
          <button
            onClick={() => setTab('weekly')}
            className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
              tab === 'weekly'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            সাপ্তাহিক প্রতিযোগিতা
          </button>
          <button
            onClick={() => setTab('alltime')}
            className={`rounded-xl px-5 py-2 text-xs font-bold transition-all ${
              tab === 'alltime'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            সর্বকালের সেরা
          </button>
        </div>
      </div>

      {/* Rankings List */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 shadow-xl space-y-3">
        {rankingData.map((student) => (
          <div
            key={student.rank}
            className={`flex items-center justify-between rounded-2xl p-4 transition-all border ${
              student.isCurrentUser
                ? 'border-emerald-500 bg-emerald-950/30 shadow-md'
                : 'border-slate-800 bg-slate-950/60'
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-black text-sm ${
                  student.rank === 1
                    ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/30'
                    : student.rank === 2
                    ? 'bg-slate-300 text-slate-950'
                    : student.rank === 3
                    ? 'bg-amber-700 text-white'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {student.rank}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-bold text-white">
                    {student.name}
                  </h4>
                  {student.isCurrentUser && (
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      আপনি
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">{student.institute}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Flame className="h-4 w-4 fill-amber-500" />
                <span>{student.streak} দিন</span>
              </div>

              <div className="text-right">
                <div className="text-xs sm:text-sm font-black text-emerald-400">
                  {student.xp} XP
                </div>
                <div className="text-[10px] text-slate-500">{student.badge}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
