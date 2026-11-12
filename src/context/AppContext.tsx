import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language, Theme, StudentStats, CourseLevelId } from '../types';

interface AppContextType {
  // Navigation
  currentRoute: string;
  navigateTo: (route: string) => void;
  selectedLessonId: string | null;
  setSelectedLessonId: (id: string | null) => void;

  // Preferences
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;

  // Student progress
  stats: StudentStats;
  addXp: (amount: number) => void;
  completeLesson: (lessonId: string, xpReward?: number) => void;
  toggleFavoriteWord: (wordId: string) => void;
  saveQuizScore: (quizId: string, score: number, total: number) => void;
  updateStudentName: (name: string) => void;
  resetProgress: () => void;
}

const DEFAULT_STATS: StudentStats = {
  name: 'ত্বহা আহমাদ (Taha Ahmad)',
  email: 'student@ai-arabic-academy.edu',
  xp: 320,
  streak: 5,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessonIds: ['beg-1-1'],
  favoriteWordIds: ['voc-q-1', 'voc-q-2', 'voc-e-1'],
  savedNotes: {},
  studyMinutes: 145,
  dailyGoalMinutes: 30,
  currentLevel: 'beginner',
  quizScores: [
    {
      quizId: 'general-placement',
      score: 85,
      total: 100,
      date: new Date().toISOString().split('T')[0],
    },
  ],
  badges: ['বটবৃক্ষ বীজ', 'প্রথম পাঠ সমাপ্ত', 'শব্দ সংগ্রাহক'],
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation state (synced with window.location.pathname)
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [selectedLessonId, setSelectedLessonId] = useState<string | null>('beg-1-1');

  // Theme
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aaa_theme') as Theme;
      if (saved && ['emerald', 'midnight', 'academic'].includes(saved)) {
        return saved;
      }
    }
    return 'emerald';
  });

  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('aaa_lang') as Language;
      if (saved && ['bn', 'en', 'ar'].includes(saved)) {
        return saved;
      }
    }
    return 'bn';
  });

  // Student progress
  const [stats, setStats] = useState<StudentStats>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aaa_stats');
        if (saved) return JSON.parse(saved);
      } catch (e) {
        console.warn('Error reading stats from storage', e);
      }
    }
    return DEFAULT_STATS;
  });

  // Sync route on popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', route);
    }
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aaa_theme', newTheme);
      document.documentElement.classList.remove('theme-emerald', 'theme-midnight', 'theme-academic');
      document.documentElement.classList.add(`theme-${newTheme}`);
    }
  };

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('aaa_lang', newLang);
      document.documentElement.lang = newLang;
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    }
  };

  // Sync theme and language attributes on mount
  useEffect(() => {
    document.documentElement.classList.remove('theme-emerald', 'theme-midnight', 'theme-academic');
    document.documentElement.classList.add(`theme-${theme}`);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [theme, language]);

  // Save stats to LocalStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('aaa_stats', JSON.stringify(stats));
      } catch (e) {
        console.warn('Error saving stats', e);
      }
    }
  }, [stats]);

  // Study timer (increments active minutes every 60s)
  useEffect(() => {
    const timer = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        studyMinutes: prev.studyMinutes + 1,
      }));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const addXp = (amount: number) => {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + amount,
    }));
  };

  const completeLesson = (lessonId: string, xpReward: number = 50) => {
    setStats((prev) => {
      if (prev.completedLessonIds.includes(lessonId)) {
        return prev;
      }
      return {
        ...prev,
        xp: prev.xp + xpReward,
        completedLessonIds: [...prev.completedLessonIds, lessonId],
      };
    });
  };

  const toggleFavoriteWord = (wordId: string) => {
    setStats((prev) => {
      const exists = prev.favoriteWordIds.includes(wordId);
      return {
        ...prev,
        favoriteWordIds: exists
          ? prev.favoriteWordIds.filter((id) => id !== wordId)
          : [...prev.favoriteWordIds, wordId],
      };
    });
  };

  const saveQuizScore = (quizId: string, score: number, total: number) => {
    setStats((prev) => ({
      ...prev,
      xp: prev.xp + Math.round((score / total) * 50),
      quizScores: [
        {
          quizId,
          score,
          total,
          date: new Date().toISOString().split('T')[0],
        },
        ...prev.quizScores,
      ],
    }));
  };

  const updateStudentName = (name: string) => {
    setStats((prev) => ({ ...prev, name }));
  };

  const resetProgress = () => {
    setStats(DEFAULT_STATS);
  };

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        navigateTo,
        selectedLessonId,
        setSelectedLessonId,
        theme,
        setTheme,
        language,
        setLanguage,
        stats,
        addXp,
        completeLesson,
        toggleFavoriteWord,
        saveQuizScore,
        updateStudentName,
        resetProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
