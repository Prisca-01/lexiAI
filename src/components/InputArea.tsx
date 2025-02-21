'use client';
import { Send, Loader2 } from 'lucide-react';

type InputAreaProps = {
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  maxLength?: number;
};

export const InputArea = ({
  value,
  loading,
  onChange,
  onSubmit,
  maxLength = 500
}: InputAreaProps) => {
  const charCount = value.length;
  const charLimit = maxLength;

  const getCharCountColor = () => {
    if (charCount >= charLimit * 0.9) return 'text-red-400'; // 90%+ (critical)
    if (charCount >= charLimit * 0.8) return 'text-yellow-400'; // 80%+ (warning)
    return 'text-gray-400'; // Normal
  };

  return (
    <div className="relative">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSubmit();
          }
        }}
        placeholder="Enter your text..."
        className="w-full p-4 pr-14 bg-gray-800 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-100"
        rows={4}
        maxLength={maxLength}
      />
      <div className={`absolute bottom-2 left-4 text-sm ${getCharCountColor()}`}>
        {charCount}/{charLimit}
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="absolute bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
      </button>
    </div>
  );
};
