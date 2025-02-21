'use client';
import { Message, LanguageCode } from '../utils/types';
import { LanguageSelector } from './LanguageSelector';

type MessageProps = {
  message: Message;
  onSummarize: () => void;
  onTranslate: (targetLang: LanguageCode) => void;
  selectedLang: LanguageCode;
  loading: boolean;
};

export const MessageComponent = ({
  message,
  onSummarize,
  onTranslate,
  selectedLang,
  loading
}: MessageProps) => (
  <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4 animate-fade-in">
    <p className="text-gray-100 mb-2 whitespace-pre-wrap">{message.text}</p>
    
    {message.language && (
      <p className="text-sm text-gray-400 mb-3">
        Detected language: {message.language.toUpperCase()}
      </p>
    )}

    <div className="flex flex-wrap gap-3 items-center">
      {message.language === 'en' && message.text.length > 150 && (
        <button
          onClick={onSummarize}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Summarize
        </button>
      )}

      <div className="flex items-center gap-3">
        <LanguageSelector
          selectedLang={selectedLang}
          detectedLang={message.language}
          onChange={onTranslate}
        />
        <button
          onClick={() => onTranslate(selectedLang)}
          disabled={loading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Translate
        </button>
      </div>
    </div>

    {message.summary && (
      <div className="mt-4 p-3 bg-gray-700 rounded-md">
        <p className="text-blue-400 font-semibold mb-2">Summary</p>
        <p className="text-gray-300">{message.summary}</p>
      </div>
    )}

    {message.translation && (
      <div className="mt-4 p-3 bg-gray-700 rounded-md">
        <p className="text-green-400 font-semibold mb-2">
          Translation ({selectedLang.toUpperCase()})
        </p>
        <p className="text-gray-300">{message.translation}</p>
      </div>
    )}
  </div>
);