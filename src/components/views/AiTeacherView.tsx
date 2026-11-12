import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  Trash2,
  Volume2,
  Sparkles,
  BookOpen,
  CheckCircle,
  HelpCircle,
  MessageSquare,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  Wand2,
} from 'lucide-react';
import { askAiTeacher } from '../../services/geminiService';
import { speakArabic, stopSpeech } from '../../services/speechService';
import { ChatMessage } from '../../types';

export const AiTeacherView: React.FC = () => {
  const { language, addXp } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'msg-welcome',
        role: 'model',
        text: `السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ وَبَرَكَاتُهُ!
আমি **উস্তাযা এআই (Ustadha AI)**, আপনার ব্যক্তিগত আরবি ভাষা ও ব্যাকরণ শিক্ষক।

আমি আপনাকে যা যা শেখাতে পারি:
১. **নাহব ও সরফ** (আরবি ব্যাকরণ ও শব্দরূপান্তর)
২. **শব্দে শব্দে অর্থ ও উচ্চারণ** (বাংলা উচ্চারণ ও পূর্ণ হরকতসহ)
৩. **কুরআনিক আরবি ও ধাতু (Root Word) বিশ্লেষণ**
৪. **আরবিতে বাক্য রচনা ও ভুল সংশোধন**
৫. **বাস্তব কথোপকথন অনুশীলন**

আপনি যে কোনো প্রশ্ন বাংলা, ইংরেজি বা আরবিতে লিখে আমাকে জিজ্ঞাসা করতে পারেন। আপনার কি কোনো বিষয়ে জানার আছে?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [inputMessage, setInputMessage] = useState('');
  const [selectedMode, setSelectedMode] = useState<
    'general' | 'grammar' | 'translation' | 'sarf_nahw' | 'quranic' | 'sentence_correction'
  >('general');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSlowSpeech, setIsSlowSpeech] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const quickPrompts = [
    { label: '✨ বাক্য শুদ্ধিকরণ', text: 'আমার এই আরবি বাক্যটি কি সঠিক? আমাকে ভুল ধরিয়ে দিন এবং শুদ্ধ হরকতসহ লিখুন: "أنا يذهب إلى السوق"' },
    { label: '📖 নাহব ও সরফের নিয়ম', text: 'মুবতাদা ও খবরের মৌলিক ব্যাকরণগত নিয়ম কী? উদাহরণ ও হরকতসহ বাংলায় বুঝিয়ে বলুন।' },
    { label: '🕌 কুরআনিক তাহকীক', text: 'সূরা ফাতিহার "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ" আয়াতের প্রতিটি শব্দের মূল ধাতু (Root) ও ব্যাকরণিক বিশ্লেষণ দিন।' },
    { label: '🗣️ দৈনন্দিন কথোপকথন', text: 'আসুন আমরা আরবিতে পরিচয় পর্বের ৫ লাইনের একটি প্রাণবন্ত কথোপকথন অনুশীলন করি।' },
    { label: '❓ একটি কুইজ দিন', text: 'আমাকে আরবি প্রাথমিক ব্যাকরণের উপর একটি বহুনির্বাচনী কুইজ প্রশ্ন করুন এবং আমার উত্তরের অপেক্ষা করুন।' },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    setInputMessage('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mode: selectedMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Build conversation history format
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const reply = await askAiTeacher({
        message: text,
        conversationHistory: history,
        mode: selectedMode,
        interfaceLanguage: language,
      });

      const modelMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: selectedMode,
      };

      setMessages((prev) => [...prev, modelMsg]);
      addXp(10); // Reward active learning
    } catch (err: any) {
      setErrorMessage(err.message || 'উস্তাদজির সাথে সংযোগ স্থাপন করতে সমস্যা হচ্ছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    stopSpeech();
    setMessages([
      {
        id: 'msg-welcome-reset',
        role: 'model',
        text: 'সংলাপ মুছে ফেলা হয়েছে। নতুন কোনো আরবি পাঠ বা জিজ্ঞাসা শুরু করতে পারেন!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSpeakText = (rawText: string) => {
    // Extract Arabic parts from message if present or read whole Arabic chunk
    const arabicMatch = rawText.match(/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s.،؟]+/g);
    const textToSpeak = arabicMatch ? arabicMatch.join(' ') : rawText;

    speakArabic(textToSpeak, {
      rate: isSlowSpeech ? 0.65 : 0.85,
      onError: (err) => console.warn(err),
    });
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-4 rounded-3xl border border-emerald-500/30 bg-slate-900/80 p-6 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-950">
            <Bot className="h-7 w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white">এআই আরবি ওস্তাদ (AI Arabic Tutor)</h1>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="font-arabic text-sm text-amber-300" dir="rtl">
              الْمُعَلِّمُ الذَّكِيُّ لِلُّغَةِ الْعَرَبِيَّةِ وَقَوَاعِدِهَا
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Slow Speech toggle */}
          <button
            onClick={() => setIsSlowSpeech(!isSlowSpeech)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
              isSlowSpeech
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-750'
            }`}
            title="ধীরগতির প্লেব্যাক টগল"
          >
            <Volume2 className="h-4 w-4" />
            <span>{isSlowSpeech ? 'ধীর অডিও (0.65x)' : 'স্বাভাবিক অডিও'}</span>
          </button>

          {/* Clear button */}
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-950/40 hover:border-rose-800 transition-colors"
            title="চ্যাট হিস্ট্রি মুছুন"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline">পরিষ্কার করুন</span>
          </button>
        </div>
      </div>

      {/* Modes bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'general', label: 'সাধারণ জিজ্ঞাসা', icon: MessageSquare },
          { id: 'grammar', label: 'নাহব ও সরফ', icon: BookOpen },
          { id: 'translation', label: 'আরবি-বাংলা অনুবাদ', icon: RefreshCw },
          { id: 'quranic', label: 'কুরআনিক শব্দবিশ্লেষণ', icon: Sparkles },
          { id: 'sentence_correction', label: 'বাক্য সংশোধন', icon: CheckCircle },
        ].map((m) => {
          const Icon = m.icon;
          const isSelected = selectedMode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setSelectedMode(m.id as any)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                isSelected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border border-slate-800 hover:bg-slate-800/80 hover:text-slate-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Prompts Chips */}
      <div className="flex flex-wrap gap-2">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(p.text)}
            disabled={isLoading}
            className="rounded-full border border-slate-800 bg-slate-900/90 px-3.5 py-1.5 text-xs text-slate-300 hover:border-emerald-500/40 hover:bg-emerald-950/20 hover:text-emerald-300 transition-colors disabled:opacity-50"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Box */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-4 sm:p-6 shadow-xl min-h-[460px] max-h-[580px] overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
                  isUser
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-br from-amber-500 to-amber-700 text-slate-950 shadow-md'
                }`}
              >
                {isUser ? 'ছাত্র' : 'ع'}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed space-y-2 ${
                  isUser
                    ? 'rounded-tr-none bg-emerald-700/30 border border-emerald-500/30 text-emerald-100'
                    : 'rounded-tl-none bg-slate-900/90 border border-slate-800 text-slate-200 shadow-sm'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                {/* Message footer actions */}
                <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] text-slate-400">
                  <span>{msg.timestamp}</span>

                  {!isUser && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeakText(msg.text)}
                        className="flex items-center gap-1 hover:text-amber-300 transition-colors"
                        title="আরবি উচ্চারণ শুনুন"
                      >
                        <Volume2 className="h-3.5 w-3.5" />
                        <span>শুনুন</span>
                      </button>
                      <span>•</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="flex items-center gap-1 hover:text-emerald-300 transition-colors"
                        title="কপি করুন"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                            <span className="text-emerald-400">কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>কপি</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500 text-slate-950 text-xs font-bold">
              ع
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-900 p-4 border border-slate-800 flex items-center gap-3">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce" />
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]" />
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]" />
              </div>
              <span className="text-xs text-slate-400">উস্তাদজি উত্তর প্রস্তুত করছেন...</span>
            </div>
          </div>
        )}

        {/* Error notice if any */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-800 bg-rose-950/40 p-3 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3 shadow-2xl backdrop-blur-md">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="আপনার প্রশ্ন লিখুন (যেমন: 'مَسَاءُ الْخَيْرِ এর অর্থ কী?' বা 'نَهْو এর নিয়মাবলী')"
            className="flex-1 bg-transparent px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs font-bold text-white transition-all hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <span>পাঠান</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
