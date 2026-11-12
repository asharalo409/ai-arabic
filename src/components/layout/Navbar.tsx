import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BookOpen,
  Sparkles,
  Bot,
  Headphones,
  Mic,
  Bookmark,
  Award,
  BarChart2,
  Menu,
  X,
  Flame,
  Globe,
  Palette,
  CheckCircle,
  GraduationCap,
  PenTool,
  Trophy,
} from 'lucide-react';
import { Theme, Language } from '../../types';

export const Navbar: React.FC = () => {
  const {
    currentRoute,
    navigateTo,
    theme,
    setTheme,
    language,
    setLanguage,
    stats,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navLinks = [
    { route: '/', labelBn: 'হোম', labelEn: 'Home', labelAr: 'الرئيسية', icon: BookOpen },
    { route: '/courses', labelBn: 'কোর্সসমূহ', labelEn: 'Courses', labelAr: 'الدورات', icon: GraduationCap },
    { route: '/ai-teacher', labelBn: 'এআই ওস্তাদ', labelEn: 'AI Teacher', labelAr: 'المعلم الذكي', icon: Bot, isHighlight: true },
    { route: '/quranic-arabic', labelBn: 'কুরআনিক আরবি', labelEn: 'Quranic Arabic', labelAr: 'العربية القرآنية', icon: Sparkles },
    { route: '/grammar', labelBn: 'নাহব ও সরফ', labelEn: 'Grammar', labelAr: 'النحو والصرف', icon: BookOpen },
    { route: '/vocabulary', labelBn: 'শব্দভাণ্ডার', labelEn: 'Vocabulary', labelAr: 'المفردات', icon: Bookmark },
    { route: '/listening', labelBn: 'শ্রবণচর্চা', labelEn: 'Listening', labelAr: 'الاستماع', icon: Headphones },
    { route: '/speaking', labelBn: 'উচ্চারণচর্চা', labelEn: 'Speaking', labelAr: 'المحادثة', icon: Mic },
    { route: '/quiz', labelBn: 'পরীক্ষা', labelEn: 'Exams', labelAr: 'الاختبارات', icon: Award },
    { route: '/practice', labelBn: 'অনুশীলন', labelEn: 'Practice', labelAr: 'التدريب', icon: PenTool },
    { route: '/dashboard', labelBn: 'ড্যাশবোর্ড', labelEn: 'Dashboard', labelAr: 'لوحة الطالب', icon: BarChart2 },
  ];

  const handleNav = (route: string) => {
    navigateTo(route);
    setMobileMenuOpen(false);
  };

  const getLabel = (item: (typeof navLinks)[0]) => {
    if (language === 'ar') return item.labelAr;
    if (language === 'en') return item.labelEn;
    return item.labelBn;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-emerald-900/30 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="group flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 p-0.5 shadow-lg shadow-emerald-950/50 transition-transform group-hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950/90">
                <span className="font-arabic text-2xl font-bold text-amber-400">ع</span>
              </div>
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-amber-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-wide text-white">
                  AI ARABIC <span className="text-emerald-400">ACADEMY</span>
                </span>
                <span className="hidden rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-300 sm:inline-block">
                  PRO
                </span>
              </div>
              <p className="font-arabic text-xs font-medium text-amber-400/90" dir="rtl">
                الأَكَادِيمِيَّةُ العَرَبِيَّةُ بِالذَّكَاءِ الاصْطِنَاعِيِّ
              </p>
            </div>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden items-center gap-1 xl:flex">
            {navLinks.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                      : item.isHighlight
                      ? 'text-amber-300 hover:bg-amber-500/10 hover:text-amber-200'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{getLabel(item)}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* XP & Streak Indicator */}
            <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 shadow-inner">
              <div className="flex items-center gap-1 text-amber-400" title="দৈনিক স্ট্রিক">
                <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span className="text-xs font-bold">{stats.streak}</span>
              </div>
              <div className="h-3 w-px bg-slate-700" />
              <div className="flex items-center gap-1 text-emerald-400" title="সর্বমোট এক্সপি (XP)">
                <Award className="h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold">{stats.xp} XP</span>
              </div>
            </div>

            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setLangDropdownOpen(!langDropdownOpen);
                  setThemeDropdownOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
                title="ভাষা পরিবর্তন / Switch Language"
              >
                <Globe className="h-4 w-4" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-xl backdrop-blur-md">
                  <button
                    onClick={() => {
                      setLanguage('bn');
                      setLangDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                      language === 'bn' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>বাংলা (Bengali)</span>
                    {language === 'bn' && <CheckCircle className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium ${
                      language === 'en' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <CheckCircle className="h-3.5 w-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('ar');
                      setLangDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium font-arabic ${
                      language === 'ar' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>العربية (Arabic)</span>
                    {language === 'ar' && <CheckCircle className="h-3.5 w-3.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Switcher Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setThemeDropdownOpen(!themeDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white"
                title="থিম পরিবর্তন / Switch Theme"
              >
                <Palette className="h-4 w-4" />
              </button>

              {themeDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-xl border border-slate-800 bg-slate-900/95 p-1.5 shadow-xl backdrop-blur-md">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400">থিম নির্বাচন করুন</div>
                  <button
                    onClick={() => {
                      setTheme('emerald');
                      setThemeDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                      theme === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span>Islamic Emerald</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('midnight');
                      setThemeDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                      theme === 'midnight' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    <span>Midnight Dark</span>
                  </button>
                  <button
                    onClick={() => {
                      setTheme('academic');
                      setThemeDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium ${
                      theme === 'academic' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span>Light Academic</span>
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 xl:hidden hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-800 bg-slate-950/98 px-4 py-5 shadow-2xl xl:hidden">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleNav(item.route)}
                  className={`flex items-center gap-2 rounded-xl p-3 text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900/60 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4 text-emerald-400" />
                  <span>{getLabel(item)}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-800 pt-3">
            <button
              onClick={() => handleNav('/leaderboard')}
              className="flex items-center gap-1.5 text-xs text-amber-400 hover:underline"
            >
              <Trophy className="h-4 w-4" />
              <span>লিডারবোর্ড</span>
            </button>
            <button
              onClick={() => handleNav('/certificates')}
              className="flex items-center gap-1.5 text-xs text-emerald-400 hover:underline"
            >
              <Award className="h-4 w-4" />
              <span>সার্টিফিকেট</span>
            </button>
            <button
              onClick={() => handleNav('/profile')}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
            >
              <span>প্রোফাইল</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
