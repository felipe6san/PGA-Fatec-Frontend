import ReactMarkdown from 'react-markdown';
import { Message } from './types';

interface ChatBubbleProps {
  message: Message;
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 items-start`}>
      {/* Assistant Avatar Badge */}
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-[#ae0f0a] text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 shadow-sm" aria-hidden="true">
          PGA
        </div>
      )}

      <div
        className={`max-w-[75%] px-4 py-2.5 rounded-lg shadow-sm transition-all duration-200 ${
          isUser
            ? 'bg-[#ae0f0a] text-white rounded-br-none'
            : 'bg-gray-100 text-gray-800 dark:bg-[#262d3a] dark:text-[#e6edf3] rounded-bl-none'
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed break-words whitespace-pre-line">{message.content}</p>
        ) : (
          <ReactMarkdown
            components={{
              p: ({ children }) => <p className="text-sm leading-relaxed mb-1 last:mb-0">{children}</p>,
              strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
              em: ({ children }) => <em className="italic">{children}</em>,
              ul: ({ children }) => <ul className="list-disc list-inside text-sm space-y-0.5 my-1 pl-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside text-sm space-y-0.5 my-1 pl-1">{children}</ol>,
              li: ({ children }) => <li className="leading-relaxed">{children}</li>,
              h1: ({ children }) => <p className="text-sm font-bold leading-relaxed mb-1">{children}</p>,
              h2: ({ children }) => <p className="text-sm font-bold leading-relaxed mb-1">{children}</p>,
              h3: ({ children }) => <p className="text-sm font-semibold leading-relaxed mb-1">{children}</p>,
              code: ({ children }) => <code className="bg-black/10 dark:bg-white/10 rounded px-1 text-xs font-mono">{children}</code>,
            }}
          >
            {message.content}
          </ReactMarkdown>
        )}
        <p
          className={`text-[10px] mt-1 text-right select-none ${
            isUser ? 'text-white/70' : 'text-gray-500 dark:text-[#e6edf3]/50'
          }`}
        >
          {message.timestamp.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
}
