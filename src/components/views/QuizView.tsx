import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { QUIZ_BANK, FullQuizQuestion } from '../../data/quizData';
import {
  Award,
  Clock,
  CheckCircle,
  XCircle,
  HelpCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { speakArabic } from '../../services/speechService';
import confetti from 'canvas-confetti';

export const QuizView: React.FC = () => {
  const { addXp, saveQuizScore, stats } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [qId: string]: any }>({});
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes timer
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Timer countdown
  useEffect(() => {
    if (!isTimerRunning || isExamCompleted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning, isExamCompleted]);

  const currentQuestion = QUIZ_BANK[currentQuestionIndex];

  const handleSelectOption = (answer: any) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleFinishExam = () => {
    setIsTimerRunning(false);
    setIsExamCompleted(true);

    // Calculate score
    let totalScore = 0;
    let maxScore = 0;
    QUIZ_BANK.forEach((q) => {
      maxScore += q.points;
      const userAns = selectedAnswers[q.id];
      if (typeof q.correctAnswer === 'number') {
        if (userAns === q.correctAnswer) totalScore += q.points;
      } else {
        if (typeof userAns === 'string' && userAns.trim() === q.correctAnswer.trim()) {
          totalScore += q.points;
        }
      }
    });

    saveQuizScore('exam-midterm-1', totalScore, maxScore);
    addXp(totalScore);

    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setIsExamCompleted(false);
    setCurrentQuestionIndex(0);
    setTimeLeft(600);
    setIsTimerRunning(true);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Final summary stats
  const totalEarnedPoints = QUIZ_BANK.reduce((acc, q) => {
    const userAns = selectedAnswers[q.id];
    if (typeof q.correctAnswer === 'number') {
      return userAns === q.correctAnswer ? acc + q.points : acc;
    }
    return typeof userAns === 'string' && userAns.trim() === q.correctAnswer.trim()
      ? acc + q.points
      : acc;
  }, 0);

  const totalPossiblePoints = QUIZ_BANK.reduce((acc, q) => acc + q.points, 0);
  const percentage = Math.round((totalEarnedPoints / totalPossiblePoints) * 100);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header with Timer and Progress */}
      <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/60 via-slate-900 to-slate-950 p-6 backdrop-blur-md flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="rounded bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
            আরবি মূল্যায়ন পরীক্ষা
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-white mt-1">
            ৮ ধরনের সমন্বিত আরবি পরীক্ষা পদ্ধতি
          </h1>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-950 px-4 py-2 text-xs font-bold text-amber-400">
            <Clock className="h-4 w-4" />
            <span>
              সময় বাকি: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
          <span className="text-xs text-slate-400">
            প্রশ্ন {currentQuestionIndex + 1} / {QUIZ_BANK.length}
          </span>
        </div>
      </div>

      {!isExamCompleted ? (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 space-y-6 shadow-xl">
          {/* Question category & points */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="rounded-lg bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300">
              {currentQuestion.category} ({currentQuestion.points} পয়েন্ট)
            </span>

            {currentQuestion.audioArabic && (
              <button
                onClick={() => speakArabic(currentQuestion.audioArabic!)}
                className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
              >
                <Volume2 className="h-4 w-4" />
                <span>অডিও শুনুন</span>
              </button>
            )}
          </div>

          {/* Arabic prompt if any */}
          {currentQuestion.arabicPrompt && (
            <div className="rounded-2xl bg-slate-950/80 p-5 text-right border border-slate-800">
              <span className="font-arabic text-3xl font-bold text-amber-300" dir="rtl">
                {currentQuestion.arabicPrompt}
              </span>
            </div>
          )}

          {/* Question title */}
          <h3 className="text-base sm:text-lg font-bold text-white">
            {currentQuestion.question}
          </h3>

          {/* Options (MCQ, Translation, Grammar, Listening, Vocab) */}
          {currentQuestion.options && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`rounded-2xl border p-4 text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/20 text-amber-300 shadow-md'
                        : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:bg-slate-900'
                    }`}
                  >
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Writing test input */}
          {currentQuestion.type === 'writing' && (
            <div className="space-y-3">
              <input
                type="text"
                value={selectedAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleSelectOption(e.target.value)}
                placeholder="এখানে আরবি হরফে সঠিক বাক্যটি লিখুন..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 p-4 font-arabic text-xl text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none text-right"
                dir="rtl"
              />
              <div className="text-[11px] text-slate-400">
                ক্লু: "اللَّهُ رَحِيمٌ"
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-slate-800 pt-6">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white disabled:opacity-40"
            >
              পূর্ববর্তী প্রশ্ন
            </button>

            {currentQuestionIndex < QUIZ_BANK.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="flex items-center gap-1 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                <span>পরবর্তী প্রশ্ন</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleFinishExam}
                className="rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-8 py-2.5 text-xs font-bold text-slate-950 hover:from-amber-400 hover:to-amber-500 transition-all shadow-md"
              >
                পরীক্ষা সমাপ্ত করুন
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Exam Results Summary Card */
        <div className="rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-8 text-center space-y-6 shadow-2xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 text-3xl font-black">
            {percentage}%
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-white">
              {percentage >= 70 ? 'মাশাআল্লাহ! অভিনন্দন!' : 'আলহামদুলিল্লাহ, ভালো চেষ্টা হয়েছে!'}
            </h2>
            <p className="text-xs text-slate-400">
              আপনি সর্বমোট {totalPossiblePoints} পয়েন্টের মধ্যে {totalEarnedPoints} পয়েন্ট অর্জন করেছেন। (+{totalEarnedPoints} XP যোগ হয়েছে)
            </p>
          </div>

          {/* Explanations Review */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950/90 p-5 text-left space-y-4 max-h-[360px] overflow-y-auto">
            <h4 className="text-xs font-bold text-emerald-400 uppercase">
              সকল প্রশ্নের সঠিক উত্তর ও ব্যাখ্যা:
            </h4>
            {QUIZ_BANK.map((q, idx) => {
              const userAns = selectedAnswers[q.id];
              const isCorrect =
                typeof q.correctAnswer === 'number'
                  ? userAns === q.correctAnswer
                  : userAns === q.correctAnswer;
              return (
                <div key={q.id} className="rounded-xl border border-slate-800 p-3 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
                    )}
                    <span className="font-semibold text-white">{q.question}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pl-6">
                    💡 <strong>ব্যাখ্যা:</strong> {q.explanation}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={handleRestart}
            className="rounded-xl bg-emerald-600 px-8 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-md flex items-center gap-2 mx-auto"
          >
            <RotateCcw className="h-4 w-4" />
            <span>পুনরায় পরীক্ষা দিন</span>
          </button>
        </div>
      )}
    </div>
  );
};
