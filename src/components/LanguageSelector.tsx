'use client';
import { LanguageCode } from '../utils/types';

type LanguageSelectorProps = {
  selectedLang: LanguageCode;
  detectedLang?: string;
  onChange: (lang: LanguageCode) => void;
};

const languageNames: Record<LanguageCode, string> = {
  en: 'English',
  pt: 'Portuguese',
  es: 'Spanish',
  ru: 'Russian',
  tr: 'Turkish',
  fr: 'French'
};

export const LanguageSelector = ({
  selectedLang,
  detectedLang,
  onChange
}: LanguageSelectorProps) => {
  const availableLangs: LanguageCode[] = ['en', 'pt', 'es', 'ru', 'tr', 'fr']
    .filter(lang => lang !== detectedLang) as LanguageCode[];

  return (
    <select
      value={selectedLang || ''}
      onChange={(e) => onChange(e.target.value as LanguageCode)}
      className="p-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="" disabled className="text-gray-500">
        Select Language:
      </option>
      {availableLangs.map((lang) => (
        <option key={lang} value={lang} className="bg-gray-800 text-white">
          {languageNames[lang]}
        </option>
      ))}
    </select>
  );
};
