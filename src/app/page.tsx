'use client';
import { useState } from 'react';

declare global {
  interface Window {
    ai: {
      detectLanguage: (text: string) => Promise<{ language: string }[]>;
      summarize: (text: string) => Promise<string>;
      translate: (text: string, lang: string) => Promise<string>;
    };
  }
}
import { Send, Loader2 } from 'lucide-react';

type Message = {
  id: string;
  text: string;
  language?: string;
  summary?: string;
  translation?: string;
};

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLang, setSelectedLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const detectLanguage = async (text: string) => {
    try {
      console.log('Detecting language for:', text);
      const result = await window.ai.detectLanguage(text);
      console.log('Language detection result:', result);
      return result.length > 0 ? result[0].language : 'unknown';
    } catch (err) {
      console.error('Language detection error:', err);
      setError('Language detection failed');
      return 'unknown';
    }
  };
  

  const handleSummarize = async (messageId: string, text: string) => {
    setLoading(true);
    try {
      const summary = await window.ai.summarize(text);
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, summary } : msg
      ));
    } catch (err) {
      setError('Summarization failed');
    }
    setLoading(false);
  };

  const handleTranslate = async (messageId: string, text: string, lang: string) => {
    setLoading(true);
    console.log(`Translating: "${text}" to ${lang}`);
    try {
      const translation = await window.ai.translate(text, lang);
      console.log('Translation result:', translation);
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, translation } : msg
      ));
    } catch (err) {
      console.error('Translation failed:', err);
      setError('Translation failed');
    }
    setLoading(false);
  };
  

  const sendMessage = async () => {
    if (!input.trim()) {
      setError('Please enter some text');
      return;
    }

    setLoading(true);
    try {
      const language = await detectLanguage(input);
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        language,
      };
      setMessages([...messages, newMessage]);
      setInput('');
      setError(null);
    } catch (err) {
      setError('Failed to process message');
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-800 mb-2">{message.text}</p>
            
            {message.language && (
              <p className="text-sm text-gray-500 mb-3">
                Detected language: {message.language}
              </p>
            )}

{message.language && message.text.length > 150 && (
  <button
    onClick={() => handleSummarize(message.id, message.text)}
    disabled={loading}
    className="mr-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
  >
    Summarize
  </button>
)}


            <div className="flex items-center gap-2 mt-2">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="p-1 border rounded"
              >
                {['en', 'pt', 'es', 'ru', 'tr', 'fr'].map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleTranslate(message.id, message.text, selectedLang)}
                disabled={loading}
                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Translate
              </button>
            </div>

            {message.summary && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="font-semibold mb-1">Summary:</p>
                <p className="text-gray-700">{message.summary}</p>
              </div>
            )}

            {message.translation && (
              <div className="mt-3 p-3 bg-gray-50 rounded">
                <p className="font-semibold mb-1">Translation ({selectedLang.toUpperCase()}):</p>
                <p className="text-gray-700">{message.translation}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Enter your text..."
          className="w-full p-3 pr-12 border rounded-lg resize-none"
          rows={3}
          aria-label="Text input field"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50"
          aria-label="Send message"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
          <button
            onClick={() => setError(null)}
            className="ml-2 text-red-700 font-bold"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}