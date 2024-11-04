import React from 'react';
import { User, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';
import type { Message } from '../types/chat';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <div className={`py-8 ${message.role === 'assistant' ? 'bg-gray-50' : ''}`}>
      <div className="max-w-3xl mx-auto px-4 flex gap-6">
        <div className="w-8 h-8 flex-shrink-0">
          {message.role === 'user' ? (
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
          ) : (
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
          )}
        </div>
        <div className="prose prose-slate max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || '');
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={atomDark}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, '')}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}