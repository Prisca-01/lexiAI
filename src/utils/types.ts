export type Message = {
    id: string;
    text: string;
    language?: string;
    summary?: string;
    translation?: string;
  };
  
  export type LanguageCode = 'en' | 'pt' | 'es' | 'ru' | 'tr' | 'fr';