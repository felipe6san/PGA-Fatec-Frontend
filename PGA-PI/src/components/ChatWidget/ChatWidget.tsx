import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X } from 'lucide-react';
import api from '@lib/api';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { Message, ChatState } from './types';

export function ChatWidget() {
  const [state, setState] = useState<ChatState>({
    isOpen: false,
    messages: [],
    isLoading: false,
    error: null,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom whenever messages change
  useEffect(() => {
    if (state.isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.messages, state.isOpen]);

  // Handle message post to NestJS backend
  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    // Optimistically update message state locally
    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const response = await api.post('/chat', {
        messages: [...state.messages, userMessage].map((m) => ({
          role: m.role,
          content: m.content,
        })),
      });

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.reply,
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Erro ao conectar com o servidor do chatbot';

      setState((prev) => ({
        ...prev,
        error: errorMsg,
        isLoading: false,
      }));

      console.error('Erro ao enviar mensagem para o chatbot:', error);
    }
  };

  const toggleChat = () => {
    setState((prev) => ({
      ...prev,
      isOpen: !prev.isOpen,
    }));
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[#ae0f0a] text-white shadow-xl hover:bg-[#8e0c08] active:scale-95 hover:scale-105 transition-all duration-200 z-40 flex items-center justify-center ${
          state.isOpen ? 'opacity-0 scale-75 pointer-events-none' : 'opacity-100 scale-100'
        }`}
        title="Abrir chat de dúvidas"
        aria-label="Abrir assistente inteligente de dúvidas"
      >
        <MessageCircle size={26} />
      </button>

      {/* Left Sidebar Chat Panel */}
      <div
        className={`fixed left-0 top-0 h-screen w-full sm:w-96 bg-white dark:bg-[#1c2130] border-r border-gray-200 dark:border-[#30363d] shadow-2xl transition-transform duration-300 ease-in-out z-50 flex flex-col ${
          state.isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Panel */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#30363d] bg-gray-50 dark:bg-[#0d1117] transition-colors duration-200">
          <div>
            <h2 className="text-base font-semibold text-gray-800 dark:text-[#e6edf3]">
              Assistente PGA
            </h2>
            <p className="text-xs text-gray-500 dark:text-[#e6edf3]/60">
              Tire suas dúvidas sobre preenchimento e regras
            </p>
          </div>
          <button
            onClick={toggleChat}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md transition-colors text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            title="Fechar chat"
            aria-label="Fechar chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages list scrollbox */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white dark:bg-[#1c2130] transition-colors duration-200">
          {state.messages.length === 0 && (
            <div className="flex items-center justify-center h-full text-center p-4">
              <div className="max-w-[80%]">
                <MessageCircle size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-3 animate-pulse" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-[#e6edf3] mb-1">
                  Olá! Como posso ajudar hoje?
                </h3>
                <p className="text-gray-400 dark:text-gray-500 text-xs leading-relaxed">
                  Faça qualquer pergunta sobre regras de HAE, eixos temáticos, orçamentos ou preenchimento do Plano de Gestão.
                </p>
              </div>
            </div>
          )}

          {state.messages.map((message) => (
            <ChatBubble key={message.id} message={message} />
          ))}

          {/* Loading Indicator */}
          {state.isLoading && (
            <div className="flex justify-start items-center mb-4">
              <div className="w-8 h-8 rounded-full bg-[#ae0f0a] text-white flex items-center justify-center text-xs font-bold mr-2 flex-shrink-0 shadow-sm select-none">
                PGA
              </div>
              <div className="flex gap-1.5 px-4 py-3 bg-gray-100 dark:bg-[#262d3a] rounded-lg rounded-bl-none shadow-sm">
                <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-[#e6edf3]/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-[#e6edf3]/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2.5 h-2.5 bg-gray-400 dark:bg-[#e6edf3]/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          {/* Error Message Box */}
          {state.error && (
            <div className="p-3 bg-red-100 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 rounded-lg text-xs leading-relaxed">
              <p className="font-semibold mb-0.5">Falha na Comunicação</p>
              <p>{state.error}</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input submission form */}
        <ChatInput onSend={handleSendMessage} isLoading={state.isLoading} />
      </div>

      {/* Dimmed Overlay background to close the chat on outside click */}
      {state.isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 backdrop-blur-[1px]"
          onClick={toggleChat}
          aria-hidden="true"
        />
      )}
    </>
  );
}
