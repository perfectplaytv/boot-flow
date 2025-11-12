import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { bootFlowChatAgent, ChatMessage } from '@/modules/ai/chatAgent';
import { useAuth } from '@/contexts/AuthContext';
import { useToastFeedback } from '@/hooks/useToastFeedback.agent';
import ReactMarkdown from 'react-markdown';

export interface BootFlowAIChatProps {
  autoSave?: boolean;
  maxHeight?: string;
  className?: string;
}

export const BootFlowAIChat = ({
  autoSave = true,
  maxHeight = '600px',
  className,
}: BootFlowAIChatProps) => {
  const { user, userRole } = useAuth();
  const { showError } = useToastFeedback();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (autoSave && messages.length > 0) {
      const saved = localStorage.getItem(`bootflow-chat-${user?.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as ChatMessage[];
          setMessages(parsed);
        } catch (error) {
          console.error('Erro ao carregar histórico do chat', error);
        }
      }
    }
  }, [autoSave, user?.id]);

  const saveHistory = (newMessages: ChatMessage[]) => {
    if (autoSave && user?.id) {
      localStorage.setItem(`bootflow-chat-${user.id}`, JSON.stringify(newMessages));
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setSuggestions([]);

    try {
      const response = await bootFlowChatAgent.sendMessage(input.trim(), {
        userId: user?.id,
        userRole: userRole || undefined,
        sessionHistory: updatedMessages,
      });

      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveHistory(finalMessages);

      if (response.suggestions && response.suggestions.length > 0) {
        setSuggestions(response.suggestions);
      }
    } catch (error) {
      showError('Erro ao enviar mensagem', (error as Error).message);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    setMessages([]);
    bootFlowChatAgent.clearHistory();
    if (user?.id) {
      localStorage.removeItem(`bootflow-chat-${user.id}`);
    }
  };

  return (
    <Card className={`flex flex-col ${className ?? ''}`.trim()} style={{ maxHeight }}>
      <CardHeader className="flex-shrink-0 border-b border-slate-800 bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-600/20">
              <Bot className="h-5 w-5 text-violet-400" />
            </div>
            <div>
              <CardTitle className="text-lg text-white">Boot Flow AI</CardTitle>
              <p className="text-xs text-slate-400">Assistente inteligente</p>
            </div>
          </div>
          {messages.length > 0 && (
            <Button variant="ghost" size="sm" onClick={clearHistory} className="text-slate-400 hover:text-white">
              Limpar
            </Button>
          )}
        </div>
      </CardHeader>

      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center py-12 text-center">
            <Sparkles className="mb-4 h-12 w-12 text-violet-400 opacity-50" />
            <p className="mb-2 text-lg font-medium text-slate-200">Olá! Como posso ajudar?</p>
            <p className="text-sm text-slate-400">Faça perguntas sobre a plataforma, métricas ou solicite sugestões.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/20">
                    <Bot className="h-4 w-4 text-violet-400" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white'
                      : 'bg-slate-800 text-slate-100'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-invert prose-sm max-w-none">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
                {msg.role === 'user' && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700">
                    <User className="h-4 w-4 text-slate-300" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-600/20">
                  <Bot className="h-4 w-4 text-violet-400" />
                </div>
                <div className="rounded-lg bg-slate-800 px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-violet-400" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {suggestions.length > 0 && (
        <div className="border-t border-slate-800 bg-slate-900/50 p-3">
          <p className="mb-2 text-xs font-medium text-slate-400">Sugestões:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, idx) => (
              <Button
                key={idx}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestionClick(suggestion)}
                className="h-auto border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:bg-slate-700"
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-shrink-0 border-t border-slate-800 bg-slate-900/50 p-4">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
            disabled={isLoading}
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </Card>
  );
};

