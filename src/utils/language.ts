import { LanguageCode } from './types';
import { googleDetectFallback } from './fallbacks';

declare global {
  interface Window {
    ai?: {
      languageModel?: {
        detectLanguage: (text: string) => Promise<Array<{ language: string }>>;
      };
      translator?: {
        translate: (text: string, lang: string) => Promise<string>;
      };
      summarizer?: {
        summarize: (text: string) => Promise<string>;
      };
    };
  }
}

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    if (window.ai?.languageModel?.detectLanguage) {
      const result = await window.ai.languageModel.detectLanguage(text);
      console.log('AI Language Detection Result:', result); // DEBUGGING LINE
      return result[0]?.language?.toLowerCase() || 'unknown';
    }

    console.log('AI Detection not available, using fallback');
    return await googleDetectFallback(text);
  } catch (error) {
    console.error('Language detection failed:', error);
    return 'unknown';
  }
};


export const filterAvailableLanguages = (
  detectedLang: string,
  currentLang: LanguageCode
): LanguageCode[] => {
  const allLangs: LanguageCode[] = ['en', 'pt', 'es', 'ru', 'tr', 'fr'];
  return allLangs.filter(lang => lang !== detectedLang && lang !== currentLang);
};