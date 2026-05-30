import { useState } from 'react';
import { Send } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-2 p-4 border-t border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#1c2130] transition-colors duration-200"
    >
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Digite sua pergunta..."
        disabled={isLoading}
        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-[#30363d] bg-white dark:bg-[#0d1117] text-gray-800 dark:text-[#e6edf3] placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#ae0f0a] focus:border-[#ae0f0a] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="p-2.5 rounded-lg bg-[#ae0f0a] text-white hover:bg-[#8e0c08] disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center shadow-sm"
        title="Enviar"
        aria-label="Enviar mensagem"
      >
        <Send size={18} />
      </button>
    </form>
  );
}
