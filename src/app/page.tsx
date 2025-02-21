'use client';
import { useState, useEffect } from 'react';
import { MessageComponent } from '../components/Message';
import { InputArea } from '../components/InputArea';
import { detectLanguage } from '../utils/language';
import {summarizeText}  from '../utils/summarize';
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
    if (!window.ai || !window.ai.languageModel?.detectLanguage) {
      setIsAISupported(false);
      setError('AI features not supported in this browser');
    }
  }, []);

  const handleSummarize = async (messageId: string) => {
    setLoading(true);
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const summary = await summarizeText(message.text);
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, summary } : m
      ));
    } catch (error) {
      setError('Failed to summarize text as AI Summarizer is not supported on this browser');
    }
    setLoading(false);
  };

  const handleTranslate = async (messageId: string, targetLang: LanguageCode) => {
    setLoading(true);
    try {
      const message = messages.find(m => m.id === messageId);
      if (!message) return;

      const translation = await translateText(message.text, targetLang);
      setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, translation } : m
      ));
    } catch (error) {
      setError('Translation service is not available');
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
      const newMessage: Message = {
        id: Date.now().toString(),
        text: input,
        language
      };
      setMessages(prev => [...prev, newMessage]);
      setInput('');
    } catch (error) {
      setError('Failed to process message');
    }
    setLoading(false);
  };

  if (!isAISupported) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-red-400 p-8 text-center">
        <div>
          <h1 className="text-2xl mb-4">Browser Compatibility Required</h1>
          <p className="text-red-700">
            Please use Chrome 121+ with experimental Web Platform features enabled.
          </p>
          <p className="text-red-700 mt-2">
            Enable via: chrome://flags/#enable-experimental-web-platform-features
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 p-4 max-w-3xl mx-auto">
      <header className="text-center text-3xl font-bold text-blue-600 p-6">
        LexiAI
      </header>

      {/* Message display area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 relative">
        {/* Show intro text when no messages exist */}
        {messages.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-center text-gray-400 text-2xl font-semibold px-6">
            Summarize and Translate texts with LexiAI
          </div>
        )}

        {/* Display user messages */}
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
      {error && <div className="flex justify-between mt-4 p-3 bg-red-100 text-red-700 rounded text-xl">{error}<button onClick={() => setError(null)} className="ml-2 text-red-700 font-bold text-3xl" aria-label="Dismiss error">×</button></div>}

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

