// Web Speech Synthesis and Speech Recognition Service

let voices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    voices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function getArabicVoice(): SpeechSynthesisVoice | undefined {
  if (!isSpeechSynthesisSupported()) return undefined;
  if (voices.length === 0) {
    voices = window.speechSynthesis.getVoices();
  }
  // Try to find native Arabic voice
  const arabicVoice =
    voices.find((v) => v.lang.startsWith('ar-') || v.lang === 'ar') ||
    voices.find((v) => v.name.toLowerCase().includes('arabic') || v.name.toLowerCase().includes('maged') || v.name.toLowerCase().includes('laila') || v.name.toLowerCase().includes('tarik'));

  return arabicVoice;
}

export function speakArabic(
  text: string,
  options?: {
    rate?: number; // 0.65 for slow, 1.0 for normal
    pitch?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): boolean {
  if (!isSpeechSynthesisSupported()) {
    if (options?.onError) {
      options.onError(new Error('Browser does not support Speech Synthesis'));
    }
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any pending speech

    const cleanText = text.replace(/[*#_~`]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'ar-SA';
    utterance.rate = options?.rate ?? 0.85;
    utterance.pitch = options?.pitch ?? 1.0;

    const voice = getArabicVoice();
    if (voice) {
      utterance.voice = voice;
    }

    if (options?.onStart) utterance.onstart = options.onStart;
    if (options?.onEnd) utterance.onend = options.onEnd;
    if (options?.onError) utterance.onerror = options.onError;

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.warn('Speech synthesis error:', err);
    if (options?.onError) options.onError(err);
    return false;
  }
}

export function stopSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

// Speech Recognition (Web Speech API)
export function isSpeechRecognitionSupported(): boolean {
  return typeof window !== 'undefined' &&
    ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
}

export interface SpeechRecognitionController {
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export function createSpeechRecognizer(callbacks: {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onEnd: () => void;
  onStart?: () => void;
}): SpeechRecognitionController | null {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.lang = 'ar-SA';
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    callbacks.onStart?.();
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    const currentText = finalTranscript || interimTranscript;
    callbacks.onResult(currentText, Boolean(finalTranscript));
  };

  recognition.onerror = (event: any) => {
    callbacks.onError(event.error || 'Speech recognition encountered an issue');
  };

  recognition.onend = () => {
    callbacks.onEnd();
  };

  return {
    start: () => {
      try {
        recognition.start();
      } catch (e) {
        console.warn('Recognition start error:', e);
      }
    },
    stop: () => {
      try {
        recognition.stop();
      } catch (e) {
        console.warn('Recognition stop error:', e);
      }
    },
    abort: () => {
      try {
        recognition.abort();
      } catch (e) {
        console.warn('Recognition abort error:', e);
      }
    },
  };
}
