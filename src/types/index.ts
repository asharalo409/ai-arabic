export type Language = 'bn' | 'en' | 'ar';

export type Theme = 'emerald' | 'midnight' | 'academic';

export type CourseLevelId = 'beginner' | 'elementary' | 'pre-intermediate' | 'intermediate' | 'upper-intermediate' | 'advanced';

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole?: string;
  arabic: string;
  bengali: string;
  english?: string;
  phoneticBn: string;
}

export interface VocabularyItem {
  id: string;
  arabic: string;
  bengali: string;
  english: string;
  phoneticBn: string;
  rootWord?: string;
  wordType: 'اسم' | 'فعل' | 'حرف';
  category: string;
  exampleArabic?: string;
  exampleBengali?: string;
  isQuranic?: boolean;
}

export interface LessonQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  levelId: CourseLevelId;
  chapterNumber: number;
  lessonNumber: number;
  title: string;
  titleArabic: string;
  description: string;
  objectives: string[];
  vocabulary: VocabularyItem[];
  previousRevisionVocabulary?: VocabularyItem[];
  grammarTopic: {
    title: string;
    titleArabic: string;
    bengaliExplanation: string;
    rules: string[];
    examples: {
      arabic: string;
      bengali: string;
      analysis: string;
    }[];
  };
  dialogue: DialogueLine[];
  speakingPrompts: {
    arabic: string;
    phoneticBn: string;
    bengali: string;
  }[];
  writingPrompt: {
    instruction: string;
    targetArabic: string;
    sampleBengali: string;
  };
  quiz: LessonQuizQuestion[];
  xpReward: number;
}

export interface Chapter {
  id: string;
  levelId: CourseLevelId;
  chapterNumber: number;
  title: string;
  titleArabic: string;
  description: string;
  learningGoal: string;
  totalLessons: number;
  lessons: Lesson[];
}

export interface CourseLevel {
  id: CourseLevelId;
  levelNumber: number;
  nameBn: string;
  nameAr: string;
  nameEn: string;
  description: string;
  chaptersCount: number;
  lessonsCount: number;
  color: string;
  badge: string;
  chapters: Chapter[];
}

export interface GrammarTopic {
  id: string;
  titleArabic: string;
  titleBengali: string;
  category: 'النحو' | 'الصرف' | 'البلاغة';
  summary: string;
  bengaliExplanation: string;
  rules: string[];
  examples: {
    arabic: string;
    phoneticBn: string;
    bengali: string;
    irabBreakdown?: string;
  }[];
  quiz: LessonQuizQuestion[];
}

export interface QuranicWordAnalysis {
  id: string;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  surahNameArabic: string;
  fullAyahArabic: string;
  fullAyahBengali: string;
  words: {
    arabic: string;
    bengali: string;
    root: string;
    morphology: string;
    grammarNote: string;
  }[];
  tafsirSummary: string;
}

export interface StudentStats {
  name: string;
  email: string;
  xp: number;
  streak: number;
  lastActiveDate: string;
  completedLessonIds: string[];
  favoriteWordIds: string[];
  savedNotes: { [lessonId: string]: string };
  studyMinutes: number;
  dailyGoalMinutes: number;
  currentLevel: CourseLevelId;
  quizScores: {
    quizId: string;
    score: number;
    total: number;
    date: string;
  }[];
  badges: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  mode?: string;
}
