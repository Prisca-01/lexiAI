import { LanguageCode } from './types';

export const googleTranslateFallback = async (
  text: string,
  targetLang: LanguageCode
): Promise<string> => {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data[0]?.map((t: any[]) => t[0]).join('') || text;
  } catch (error) {
    console.error('Translation fallback failed:', error);
    return text;
  }
};

export const googleDetectFallback = async (text: string): Promise<string> => {
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    return data?.[2]?.toLowerCase() || 'unknown';
  } catch (error) {
    console.error('Language detection fallback failed:', error);
    return 'unknown';
  }
};