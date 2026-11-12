import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { getLessonById } from '../../data/curriculumData';
import {
  Volume2,
  Play,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Mic,
  MicOff,
  PenTool,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { speakArabic, stopSpeech, createSpeechRecognizer, isSpeechRecognitionSupported } from '../../services/speechService';
import { analyzeArabicSpeech } from '../../services/geminiService';
import confetti from 'canvas-confetti';

export const LessonDetailView: React.FC = () => {
  const { selectedLessonId, navigateTo, completeLesson, stats, toggleFavoriteWord } = useApp();

  const lesson = getLessonById(selectedLessonId || 'beg-1-1') || getLessonById('beg-1-1')!;

  // Tabs within lesson
  const [activeTab, setActiveTab] = useState<
    'objectives' | 'vocab' | 'grammar' | 'dialogue' | 'speaking' | 'writing' | 'quiz'
  >('objectives');

  // Audio rate state
  const [slowAudio, setSlowAudio] = useState(false);
  const [playingLineId, setPlayingLineId] = useState<string | null>(null);

  // Speaking state
  const [isRecording, setIsRecording] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [speechEvaluation, setSpeechEvaluation] = useState<any | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [recognizer, setRecognizer] = useState<any>(null);

  // Writing state
  const [userWritingInput, setUserWritingInput] = useState('');
  const [writingChecked, setWritingChecked] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<{ [qId: string]: number }>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const isCompleted = stats.completedLessonIds.includes(lesson.id);

  const handleSpeak = (text: string, lineId?: string) => {
    if (lineId) setPlayingLineId(lineId);
    speakArabic(text, {
      rate: slowAudio ? 0.65 : 0.85,
      onEnd: () => setPlayingLineId(null),
      onError: () => setPlayingLineId(null),
    });
  };

  const handleStartSpeaking = (targetArabic: string) => {
    if (!isSpeechRecognitionSupported()) {
      setSpeechError('আপনার ব্রাউজারে স্পিচ রিকগনিশন সমর্থন করে না। তবে আপনি টাইপ করে অথবা এআই বিশ্লেষণ যাচাই করতে পারেন।');
      // Provide instant evaluation test
      analyzeArabicSpeech(targetArabic, targetArabic).then((res) => {
        setSpeechEvaluation(res);
      });
      return;
    }

    setSpeechError(null);
    setSpokenTranscript('');
    setSpeechEvaluation(null);

    const rec = createSpeechRecognizer({
      onStart: () => setIsRecording(true),
      onResult: (transcript, isFinal) => {
        setSpokenTranscript(transcript);
        if (isFinal) {
          setIsRecording(false);
          // Evaluate with AI
          analyzeArabicSpeech(targetArabic, transcript).then((res) => {
            setSpeechEvaluation(res);
          });
        }
      },
      onError: (err) => {
        setSpeechError(err);
        setIsRecording(false);
      },
      onEnd: () => setIsRecording(false),
    });

    if (rec) {
      setRecognizer(rec);
      rec.start();
    }
  };

  const handleStopSpeaking = () => {
    if (recognizer) {
      recognizer.stop();
    }
    setIsRecording(false);
  };

  const handleFinishLesson = () => {
    completeLesson(lesson.id, lesson.xpReward);
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Confetti fallback
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Navigation breadcrumbs & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => navigateTo('/courses')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors w-fit"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>সকল অধ্যায়ে ফিরে যান</span>
        </button>

        <div className="flex items-center gap-3">
          {/* Slow audio toggle */}
          <button
            onClick={() => setSlowAudio(!slowAudio)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
              slowAudio
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>ধীরগতি প্লেব্যাক (0.65x): {slowAudio ? 'চালু' : 'বন্ধ'}</span>
          </button>

          {isCompleted ? (
            <span className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-400 border border-emerald-500/30">
              <CheckCircle className="h-4 w-4" />
              <span>সম্পন্ন হয়েছে</span>
            </span>
          ) : (
            <button
              onClick={handleFinishLesson}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-1.5 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition-all"
            >
              <Award className="h-4 w-4" />
              <span>পাঠ সমাপ্ত করুন (+{lesson.xpReward} XP)</span>
            </button>
          )}
        </div>
      </div>

      {/* Lesson Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/70 via-slate-900 to-slate-950 p-6 sm:p-8 backdrop-blur-md">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-amber-400/20 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                {lesson.levelId === 'beginner'
                  ? 'লেভেল ১'
                  : lesson.levelId === 'elementary'
                  ? 'লেভেল ২'
                  : lesson.levelId === 'pre-intermediate'
                  ? 'লেভেল ৩'
                  : lesson.levelId === 'intermediate'
                  ? 'লেভেল ৪'
                  : lesson.levelId === 'upper-intermediate'
                  ? 'লেভেল ৫'
                  : 'লেভেল ৬'}{' '}
                • অধ্যায় {lesson.chapterNumber} • পাঠ {lesson.lessonNumber}
              </span>
              <span className="text-xs text-emerald-400">+{lesson.xpReward} XP</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              {lesson.title}
            </h1>
            <p className="text-xs text-slate-300">{lesson.description}</p>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-right">
            <span className="font-arabic text-2xl sm:text-3xl font-bold text-amber-300" dir="rtl">
              {lesson.titleArabic}
            </span>
            <div className="mt-2 flex justify-end">
              <button
                onClick={() => handleSpeak(lesson.titleArabic)}
                className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
              >
                <Volume2 className="h-3.5 w-3.5" />
                <span>আরবি শুনুন</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 22-Feature Module Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-800 pb-2 scrollbar-none">
        {[
          { id: 'objectives', label: '১. শিখনফল' },
          { id: 'vocab', label: '২. শব্দভাণ্ডার ও হরকত' },
          { id: 'grammar', label: '৩. নাহব ব্যাকরণ' },
          { id: 'dialogue', label: '৪. ১৫-লাইনের সংলাপ' },
          { id: 'speaking', label: '৫. স্পিকিং টেস্ট' },
          { id: 'writing', label: '৬. আরবি লেখনী' },
          { id: 'quiz', label: '৭. পরীক্ষা ও কুইজ' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Objectives & Overview */}
      {activeTab === 'objectives' && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400">
              <Sparkles className="h-5 w-5" />
              <h3 className="text-base font-bold text-white">এই পাঠের মূল শিখনফলসমূহ</h3>
            </div>
            <ul className="space-y-3">
              {lesson.objectives.map((obj, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300">
                  <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-amber-400">
                <BookOpen className="h-5 w-5" />
                <h3 className="text-base font-bold text-white">পাঠের কাঠামো ও নির্দেশিকা</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                এই পাঠে আপনি ১৫ লাইনের একটি বাস্তব আরবি কথোপকথন শিখবেন, যাতে ২ থেকে ৪ জন বক্তা অংশ নিয়েছেন। প্রতিটি লাইনের বিশুদ্ধ বাংলা অনুবাদ এবং ধীরগতির অডিও প্লেব্যাক সংযুক্ত আছে।
              </p>
            </div>

            <button
              onClick={() => setActiveTab('vocab')}
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
            >
              <span>পরবর্তী ধাপ: শব্দভাণ্ডার দেখুন</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Vocabulary with Tashkeel, Bengali Pronunciation & Meaning */}
      {activeTab === 'vocab' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">
              নতুন শব্দাবলী (పూర్ణ হরকত ও বাংলা উচ্চারণসহ)
            </h3>
            <span className="text-xs text-slate-400">শব্দে ক্লিক করে অডিও শুনুন</span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {lesson.vocabulary.map((voc) => {
              const isFav = stats.favoriteWordIds.includes(voc.id);
              return (
                <div
                  key={voc.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3 hover:border-emerald-500/40 transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                      {voc.category}
                    </span>
                    <button
                      onClick={() => toggleFavoriteWord(voc.id)}
                      className={`text-xs ${isFav ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
                      title="ফেভারিট তালিকায় যুক্ত করুন"
                    >
                      ★ {isFav ? 'সংরক্ষিত' : 'সংরক্ষণ'}
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-arabic text-2xl font-bold text-amber-300 harakat-text" dir="rtl">
                      {voc.arabic}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="text-emerald-400 font-medium">উচ্চারণ: {voc.phoneticBn}</div>
                    <div className="text-white font-semibold">অর্থ: {voc.bengali}</div>
                    <div className="text-slate-400 text-[11px]">English: {voc.english}</div>
                  </div>

                  {voc.exampleArabic && (
                    <div className="rounded-xl bg-slate-950/80 p-2.5 text-xs border border-slate-800/80 space-y-1">
                      <div className="font-arabic text-sm text-slate-200 text-right" dir="rtl">
                        {voc.exampleArabic}
                      </div>
                      <div className="text-[11px] text-slate-400">{voc.exampleBengali}</div>
                    </div>
                  )}

                  <button
                    onClick={() => handleSpeak(voc.arabic)}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-750 py-2 text-xs font-semibold text-emerald-300 transition-colors"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>উচ্চারণ শুনুন</span>
                  </button>
                </div>
              );
            })}
          </div>

          {/* Previous Revision Vocabulary Section */}
          {lesson.previousRevisionVocabulary && lesson.previousRevisionVocabulary.length > 0 && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/30 p-6 space-y-4">
              <h4 className="text-sm font-bold text-amber-300">
                পূর্ববর্তী পাঠের পুনরাবৃত্তি (Revision Vocabulary)
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {lesson.previousRevisionVocabulary.map((voc) => (
                  <div key={voc.id} className="flex items-center justify-between rounded-xl bg-slate-950/60 p-3 border border-slate-800">
                    <div>
                      <div className="font-arabic text-lg text-emerald-300" dir="rtl">{voc.arabic}</div>
                      <div className="text-xs text-slate-300">{voc.bengali} ({voc.phoneticBn})</div>
                    </div>
                    <button
                      onClick={() => handleSpeak(voc.arabic)}
                      className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                    >
                      <Volume2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Grammar Topic with Bengali Explanation & Sentence Examples */}
      {activeTab === 'grammar' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <span className="text-xs font-bold text-emerald-400 uppercase">ব্যাকরণ পাঠ</span>
            <h3 className="text-xl font-bold text-white mt-1">{lesson.grammarTopic.title}</h3>
            <p className="font-arabic text-lg text-amber-300 mt-1" dir="rtl">
              {lesson.grammarTopic.titleArabic}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-950/70 p-5 text-xs sm:text-sm leading-relaxed text-slate-200 border border-slate-800/80">
            {lesson.grammarTopic.bengaliExplanation}
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-emerald-300">ব্যাকরণগত সূত্রসমূহ (Rules):</h4>
            <ul className="space-y-2">
              {lesson.grammarTopic.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[11px] font-bold text-emerald-400">
                    {idx + 1}
                  </span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-bold text-amber-300">বাস্তব বাক্যের বিশ্লেষণ ও উদাহরণ:</h4>
            <div className="space-y-3">
              {lesson.grammarTopic.examples.map((ex, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => handleSpeak(ex.arabic)}
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>শুনুন</span>
                    </button>
                    <div className="font-arabic text-xl font-bold text-amber-300" dir="rtl">
                      {ex.arabic}
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-white">অর্থ: {ex.bengali}</div>
                  <div className="text-[11px] text-emerald-400 bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-900/30">
                    🔍 বিশ্লেষণ: {ex.analysis}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: 15-Line Multi-Speaker Conversation with Line-by-Line Bengali Translation & Audio */}
      {activeTab === 'dialogue' && (
        <div className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                ১৫ লাইনের পূর্ণাঙ্গ আরবি কথোপকথন (الحوار العربي)
              </h3>
              <p className="text-xs text-slate-400">
                খালেদ, খলিল ও শিক্ষিকার মধ্যকার পারস্পরিক আলোচনা। প্রতিটি লাইনের অডিও শুনুন।
              </p>
            </div>
            <button
              onClick={() => {
                // Play all dialogue sequentially
                const fullText = lesson.dialogue.map((d) => d.arabic).join('. ');
                handleSpeak(fullText);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition-colors w-fit"
            >
              <Play className="h-4 w-4" />
              <span>সম্পূর্ণ সংলাপ শুনুন</span>
            </button>
          </div>

          <div className="space-y-3">
            {lesson.dialogue.map((line, idx) => {
              const isPlaying = playingLineId === line.id;
              return (
                <div
                  key={line.id}
                  className={`rounded-2xl border p-4 transition-all ${
                    isPlaying
                      ? 'border-emerald-500 bg-emerald-950/30 shadow-md'
                      : 'border-slate-800 bg-slate-900/50 hover:bg-slate-900/80'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-400">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-amber-400">{line.speaker}</span>
                    </div>

                    <button
                      onClick={() => handleSpeak(line.arabic, line.id)}
                      className="flex items-center gap-1 rounded-lg bg-slate-800/80 px-2.5 py-1 text-xs text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{isPlaying ? 'বাজছে...' : 'শুনুন'}</span>
                    </button>
                  </div>

                  <div className="mt-3 text-right">
                    <span className="font-arabic text-xl sm:text-2xl font-bold text-slate-100 harakat-text" dir="rtl">
                      {line.arabic}
                    </span>
                  </div>

                  <div className="mt-2 space-y-0.5 text-xs">
                    <div className="text-emerald-400 font-medium">উচ্চারণ: {line.phoneticBn}</div>
                    <div className="text-slate-300 font-semibold">অর্থ: {line.bengali}</div>
                    {line.english && <div className="text-[11px] text-slate-500">English: {line.english}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 5: Speaking Practice with Voice Recognition & AI Feedback */}
      {activeTab === 'speaking' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase">উচ্চারণ ও মৌখিক পরীক্ষা</span>
            <h3 className="text-xl font-bold text-white mt-1">মাইক্রোফোনে আরবি পড়ে উচ্চারণ যাচাই করুন</h3>
            <p className="text-xs text-slate-400 mt-1">
              নিচের বাক্যটি দেখে দেখে স্পষ্ট উচ্চারণে পড়ুন। আমাদের এআই তাজবীদ ও মাখরাজ বিশ্লেষণ করবে।
            </p>
          </div>

          <div className="space-y-4">
            {lesson.speakingPrompts.map((prompt, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                    অনুশীলন {idx + 1}
                  </span>
                  <button
                    onClick={() => handleSpeak(prompt.arabic)}
                    className="flex items-center gap-1 text-xs text-emerald-400 hover:underline"
                  >
                    <Volume2 className="h-3.5 w-3.5" />
                    <span>মডেল উচ্চারণ শুনুন</span>
                  </button>
                </div>

                <div className="text-right">
                  <span className="font-arabic text-2xl font-bold text-amber-300" dir="rtl">
                    {prompt.arabic}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-emerald-400 font-medium">উচ্চারণ:</span> {prompt.phoneticBn}
                  <span className="mx-2">•</span>
                  <span className="text-slate-400">অর্থ:</span> {prompt.bengali}
                </div>

                {/* Voice button */}
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  {!isRecording ? (
                    <button
                      onClick={() => handleStartSpeaking(prompt.arabic)}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-4 py-2.5 text-xs font-bold text-white hover:from-amber-500 hover:to-amber-600 transition-all shadow-md"
                    >
                      <Mic className="h-4 w-4" />
                      <span>মাইক্রোফোন চালু করে বলুন</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopSpeaking}
                      className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-rose-500 transition-all animate-pulse"
                    >
                      <MicOff className="h-4 w-4" />
                      <span>রেকর্ডিং থামান ও ফলাফল দেখুন</span>
                    </button>
                  )}
                </div>

                {/* Recording Live Transcript */}
                {isRecording && (
                  <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-200">
                    🎙️ শুনছি... বলুন: {spokenTranscript || 'উচ্চারণ করুন...'}
                  </div>
                )}

                {/* Speech Error */}
                {speechError && (
                  <div className="text-xs text-rose-400">{speechError}</div>
                )}

                {/* AI Evaluation Result Card */}
                {speechEvaluation && (
                  <div className="mt-3 rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">এআই মূল্যায়ন রিপোর্ট:</span>
                      <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 font-bold text-emerald-400">
                        স্কোর: {speechEvaluation.accuracyScore}%
                      </span>
                    </div>
                    <div className="text-slate-300">
                      <strong>মাখরাজ মূল্যায়ন:</strong> {speechEvaluation.makhrajFeedback}
                    </div>
                    <div className="text-emerald-400">
                      <strong>পরামর্শ:</strong> {speechEvaluation.tipsForImprovement}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Writing Practice with Arabic Keyboard / Virtual Assistance */}
      {activeTab === 'writing' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
          <div>
            <span className="text-xs font-bold text-cyan-400 uppercase">লেখনী অনুশীলন</span>
            <h3 className="text-xl font-bold text-white mt-1">আরবি বাক্য লিখন ড্রিল</h3>
            <p className="text-xs text-slate-400 mt-1">{lesson.writingPrompt.instruction}</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5 space-y-4">
            <div className="text-xs text-slate-300">
              বাংলা সূত্র: <strong className="text-amber-300">{lesson.writingPrompt.sampleBengali}</strong>
            </div>

            <textarea
              rows={3}
              value={userWritingInput}
              onChange={(e) => {
                setUserWritingInput(e.target.value);
                setWritingChecked(false);
              }}
              placeholder="এখানে আরবি হরফে টাইপ করুন..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900 p-3 font-arabic text-xl text-white placeholder-slate-600 focus:border-emerald-500 focus:outline-none text-right"
              dir="rtl"
            />

            {/* Quick Arabic Virtual Letter Chips */}
            <div className="space-y-1">
              <span className="text-[11px] text-slate-400">সহায়ক আরবি হরফ কিবোর্ড:</span>
              <div className="flex flex-wrap gap-1" dir="rtl">
                {['ا', 'ب', 'ت', 'ث', 'ج', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ك', 'ل', 'م', 'ن', 'ه', 'و', 'ي', 'َ', 'ِ', 'ُ', 'ً', 'ٍ', 'ٌ', 'ْ', 'ّ'].map((char, i) => (
                  <button
                    key={i}
                    onClick={() => setUserWritingInput((prev) => prev + char)}
                    className="h-8 w-8 rounded-lg bg-slate-800 font-arabic text-sm text-slate-200 hover:bg-emerald-600 hover:text-white transition-colors"
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setWritingChecked(true)}
                className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-emerald-500 transition-colors"
              >
                উত্তর যাচাই করুন
              </button>
              <button
                onClick={() => setUserWritingInput(lesson.writingPrompt.targetArabic)}
                className="text-xs text-slate-400 hover:text-white underline"
              >
                সঠিক উত্তর দেখুন
              </button>
            </div>

            {writingChecked && (
              <div className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 text-xs space-y-2">
                <div className="font-semibold text-emerald-400">সঠিক লক্ষ্য রূপ:</div>
                <div className="font-arabic text-xl text-amber-300 text-right" dir="rtl">
                  {lesson.writingPrompt.targetArabic}
                </div>
                <p className="text-slate-300">
                  মাশাআল্লাহ! লেখনী অনুশীলন আপনার আরবি বানান ও হরকত স্মৃতিকে দৃঢ় করে।
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 7: Interactive Lesson Quiz & Completion */}
      {activeTab === 'quiz' && (
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-emerald-400 uppercase">পাঠ মূল্যায়ন</span>
              <h3 className="text-xl font-bold text-white mt-1">ইন্টারেক্টিভ কুইজ ও জ্ঞান পরীক্ষা</h3>
            </div>
            <span className="text-xs font-semibold text-amber-400">
              +{lesson.xpReward} XP পুরস্কার
            </span>
          </div>

          <div className="space-y-6">
            {lesson.quiz.map((q, idx) => {
              const selectedOpt = quizAnswers[q.id];
              return (
                <div key={q.id} className="rounded-2xl border border-slate-800 bg-slate-950/70 p-5 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-400">
                      {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-white">{q.question}</h4>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 pt-2">
                    {q.options.map((opt, optIdx) => {
                      const isSelected = selectedOpt === optIdx;
                      const isCorrect = q.correctAnswerIndex === optIdx;
                      let btnStyle = 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800';

                      if (quizSubmitted) {
                        if (isCorrect) {
                          btnStyle = 'border-emerald-500 bg-emerald-950/40 text-emerald-300 font-bold';
                        } else if (isSelected && !isCorrect) {
                          btnStyle = 'border-rose-500 bg-rose-950/40 text-rose-300';
                        }
                      } else if (isSelected) {
                        btnStyle = 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-semibold';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: optIdx }))}
                          className={`flex items-center justify-between rounded-xl border p-3 text-xs transition-all text-left ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && <CheckCircle className="h-4 w-4 text-emerald-400" />}
                        </button>
                      );
                    })}
                  </div>

                  {quizSubmitted && (
                    <div className="rounded-xl bg-slate-900 p-3 text-xs text-slate-300 border border-slate-800">
                      💡 <strong>ব্যাখ্যা:</strong> {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
            {!quizSubmitted ? (
              <button
                onClick={() => setQuizSubmitted(true)}
                className="rounded-xl bg-emerald-600 px-6 py-3 text-xs font-bold text-white hover:bg-emerald-500 transition-colors shadow-md"
              >
                উত্তর সাবমিট করুন
              </button>
            ) : (
              <button
                onClick={handleFinishLesson}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-8 py-3.5 text-xs font-bold text-white shadow-lg shadow-emerald-950/50 hover:from-emerald-400 hover:to-teal-400 transition-all flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                <span>পাঠ সম্পন্ন করুন (+{lesson.xpReward} XP)</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
