declare global {
    interface Window {
      ai?: {
        languageModel?: {
          detectLanguage: (text: string) => Promise<{ language: string; }[]>;
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

  export const summarizeText = async (text: string): Promise<string> => {
      if (!window.ai || !window.ai.summarizer) {
      console.error('AI summarizer is not available');
      throw new Error('AI summarizer is not available');
    }
    const summary = await window.ai.summarizer.summarize(text);
    return summary;
  };
  