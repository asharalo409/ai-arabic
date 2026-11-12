export interface FullQuizQuestion {
  id: string;
  type:
    | 'mcq'
    | 'fill_blank'
    | 'ar_to_bn'
    | 'bn_to_ar'
    | 'grammar'
    | 'vocab'
    | 'listening'
    | 'writing';
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  audioArabic?: string;
  arabicPrompt?: string;
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
  points: number;
}

export const QUIZ_BANK: FullQuizQuestion[] = [
  {
    id: 'qz-1',
    type: 'mcq',
    category: 'মৌলিক সম্ভাষণ',
    difficulty: 'easy',
    question: 'সকাল বেলার অভিবাদন হিসেবে আরবিতে কোনটি বলা হয়?',
    options: ['مَسَاءُ الْخَيْرِ', 'صَبَاحُ الْخَيْرِ', 'تُصْبِحُ عَلَى خَيْرٍ', 'مَعَ السَّلَامَةِ'],
    correctAnswer: 1,
    explanation: 'صَبَاحُ الْخَيْرِ (সাবাহুল খাইর) অর্থ "শুভ সকাল"।',
    points: 10,
  },
  {
    id: 'qz-2',
    type: 'ar_to_bn',
    category: 'অনুবাদ',
    difficulty: 'easy',
    arabicPrompt: 'الْعِلْمُ نُورٌ وَالْجَهْلُ ظَلَامٌ',
    question: 'উপরের আরবি প্রবাদটির সঠিক বাংলা অর্থ কোনটি?',
    options: [
      'জ্ঞান শক্তি এবং মূর্খতা দুর্বলতা',
      'জ্ঞান হলো আলো এবং অজ্ঞতা হলো অন্ধকার',
      'বই মানুষের শ্রেষ্ঠ সঙ্গী',
      'আলো ও অন্ধকার আল্লাহর সৃষ্টি',
    ],
    correctAnswer: 1,
    explanation: 'الْعِلْمُ نُورٌ (জ্ঞান আলো) وَ (এবং) الْجَهْلُ ظَلَامٌ (অজ্ঞতা অন্ধকার)।',
    points: 15,
  },
  {
    id: 'qz-3',
    type: 'grammar',
    category: 'নাহব',
    difficulty: 'medium',
    question: '"كَتَبَ الْوَلَدُ الرِّسَالَةَ" বাক্যে "الرِّسَالَةَ" শব্দের ইরাব ও অবস্থান কী?',
    options: [
      'ফায়েল (فاعل) এবং মারফু',
      'মাফঊল বিহি (مفعول به) এবং মানসুব (ফাতহাহযুক্ত)',
      'মুবতাদা (مبتدأ)',
      'মাজরুর কাসরাসহ',
    ],
    correctAnswer: 1,
    explanation: 'الرِّسَالَةَ হলো যার ওপর লেখার কাজটি সম্পন্ন হয়েছে (চিঠি), তাই এটি মাফঊল বিহি এবং মানসুব।',
    points: 20,
  },
  {
    id: 'qz-4',
    type: 'fill_blank',
    category: 'বাক্যপূরণ',
    difficulty: 'easy',
    arabicPrompt: 'الْقَلَمُ _____ الْمَكْتَبِ.',
    question: 'শূন্যস্থানে সঠিক হরফে জার বসিয়ে বাক্যটি পূর্ণ করুন:',
    options: ['فِي', 'عَلَى', 'إِلَى', 'مِنْ'],
    correctAnswer: 1,
    explanation: 'টেবিলের "উপরে" বোঝাতে "عَلَى" (আলা) ব্যবহৃত হয়।',
    points: 15,
  },
  {
    id: 'qz-5',
    type: 'listening',
    category: 'শ্রবণ ও অনুধাবন',
    difficulty: 'medium',
    audioArabic: 'الْحَمْدُ لِلّٰهِ رَبِّ الْعَالَمِينَ',
    question: 'অডিওটি শুনে বলুন, এই আয়াতে আল্লাহর কোন গুণের কথা বলা হয়েছে?',
    options: ['বিচার দিবসের মালিক', 'সমগ্র বিশ্বজগতের প্রতিপালক', 'সর্বশক্তিমান', 'চিরঞ্জীব'],
    correctAnswer: 1,
    explanation: 'رَبِّ الْعَالَمِينَ অর্থ "সমগ্র বিশ্বজগতের প্রতিপালক"।',
    points: 20,
  },
  {
    id: 'qz-6',
    type: 'bn_to_ar',
    category: 'অনুবাদ',
    difficulty: 'medium',
    question: '"আমি আরবি ভাষা শিখতে ভালোবাসি" - এর সঠিক আরবি রূপ কোনটি?',
    options: [
      'أَنَا أُحِبُّ أَنْ أَتَعَلَّمَ اللُّغَةَ الْعَرَبِيَّةَ',
      'أَنَا أَقْرَأُ اللُّغَةَ الْعَرَبِيَّةَ',
      'أَنَا كَتَبْتُ اللُّغَةَ الْعَرَبِيَّةَ',
      'اللُّغَةُ الْعَرَبِيَّةُ سَهْلَةٌ',
    ],
    correctAnswer: 0,
    explanation: 'أُحِبُّ (আমি ভালোবাসি) أَنْ أَتَعَلَّمَ (শিখতে) اللُّغَةَ الْعَرَبِيَّةَ (আরবি ভাষা)।',
    points: 20,
  },
  {
    id: 'qz-7',
    type: 'vocab',
    category: 'কুরআনিক শব্দার্থ',
    difficulty: 'easy',
    arabicPrompt: 'الصِّرَاطَ الْمُسْتَقِيمَ',
    question: 'এই কুরআনিক বাক্যাংশের বাংলা অর্থ কী?',
    options: ['শান্তিময় জীবন', 'সরল-সঠিক পথ', 'আকাশ ও জমিন', 'উত্তম রিজিক'],
    correctAnswer: 1,
    explanation: 'الصِّرَاطَ الْمُسْتَقِيمَ অর্থ "সরল ও সঠিক পথ"।',
    points: 15,
  },
  {
    id: 'qz-8',
    type: 'writing',
    category: 'লেখনী পরীক্ষা',
    difficulty: 'hard',
    question: 'আরবিতে লিখুন: "আল্লাহ পরম দয়ালু" (اللَّهُ رَحِيمٌ)',
    arabicPrompt: 'اللَّهُ رَحِيمٌ',
    correctAnswer: 'اللَّهُ رَحِيمٌ',
    explanation: 'اللَّهُ (মুবতাদা মারফু) رَحِيمٌ (খবর মারফু তানভীনসহ)।',
    points: 25,
  },
];
