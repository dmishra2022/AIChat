import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t bg-white">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto p-4">
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            rows={1}
            disabled={disabled}
            className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 pr-12 text-sm focus:border-gray-300 focus:outline-none focus:ring-0 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={disabled || !input.trim()}
            className="absolute right-2 top-2.5 p-1 rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          AI may produce inaccurate information.
        </p>
      </form>
    </div>
  );
}