import { LanguageCode } from './types';
import { googleTranslateFallback } from './fallbacks';

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

export const translateText = async (
  text: string,
  targetLang: LanguageCode
): Promise<string> => {
  if (!text.trim()) throw new Error('Text cannot be empty');
  
  if (window.ai?.translator?.translate) {
    return await window.ai.translator.translate(text, targetLang);
  }
  
  return await googleTranslateFallback(text, targetLang);
};