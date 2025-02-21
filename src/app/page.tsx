'use client';
import { useState, useEffect } from 'react';
import { MessageComponent } from '../components/Message';
import { InputArea } from '../components/InputArea';
import { detectLanguage } from '../utils/language';
import { summarizeText } from '../utils/summarize';
import { translateText } from '../utils/translate';
import { Message, LanguageCode } from '../utils/types';

export default function Home() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedLang, setSelectedLang] = useState<LanguageCode>('en');
  const [loading, setLoading] = useState(false);
  const [isAISupported, setIsAISupported] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAISupport = () => {
      if (!window.ai || !window.ai.languageModel?.detectLanguage) {
        setIsAISupported(false);
      }
    };

    setTimeout(checkAISupport, 500);
  }, []);

  // Auto-clear error messages after 5 seconds
  useEffect(() => {
    if (error) {
      const timeout = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timeout);
    }
  }, [error]);

  const handleSummarize = async (messageId: string) => {
    if (!isAISupported) {
      setError('AI Summarizer is not supported in this browser.');
      return;
    }

    setLoading(true);
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const summary = await summarizeText(message.text);
      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, summary } : m
      ));
    } catch (error) {
      setError('Failed to summarize text.');
    }
    setLoading(false);
  };

  const handleTranslate = async (messageId: string, targetLang: LanguageCode) => {
    if (!isAISupported) {
      setError('Translation service is not available in this browser.');
      return;
    }

    setLoading(true);
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const translation = await translateText(message.text, targetLang);
      setMessages(prev => prev.map(m =>
        m.id === messageId ? { ...m, translation } : m
      ));
    } catch (error) {
      setError('Failed to translate text.');
    }
    setLoading(false);
  };

  const sendMessage = async () => {
    if (!input.trim()) {
      setError('Input cannot be empty');
      return;
    }
  
    setLoading(true);
    try {
      const language = await detectLanguage(input);
      console.log('Detected language for:', input, '=>', language); // DEBUGGING LINE
  
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        language
      };
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    } catch (error) {
      setError('Failed to process message.');
    }
    setLoading(false);
  };
  

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 p-4 max-w-3xl mx-auto">
      <header className="text-center text-3xl font-bold text-blue-600 p-6">
        LexiAI
      </header>

      {/* Shows warning in message space if AI is not supported */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 relative">
        {!isAISupported && (
          <div className="p-4 bg-yellow-100 text-yellow-800 text-center rounded">
            <p>
              AI features are not supported in this browser. Please use Chrome 121+ with
              experimental features enabled: <strong>chrome://flags/#enable-experimental-web-platform-features</strong>
            </p>
          </div>
        )}

        {/* Intro text when no messages exist */}
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-gray-400 text-2xl font-semibold px-6">
            Summarize and Translate texts with LexiAI
          </div>
        )}

        {messages.map((message) => (
          <MessageComponent
            key={message.id}
            message={message}
            selectedLang={selectedLang}
            loading={loading}
            onSummarize={() => handleSummarize(message.id)}
            onTranslate={(lang) => {
              setSelectedLang(lang);
              handleTranslate(message.id, lang);
            }}
          />
        ))}
      </div>

      {error && (
        <div className="flex justify-between mt-4 p-3 bg-red-100 text-red-700 rounded text-xl">
          {error}
          <button onClick={() => setError(null)} className="ml-2 text-red-700 font-bold text-3xl" aria-label="Dismiss error">×</button>
        </div>
      )}

      {/* Input Area */}
      <InputArea
        value={input}
        loading={loading}
        onChange={setInput}
        onSubmit={sendMessage}
      />
    </div>
  );
}
