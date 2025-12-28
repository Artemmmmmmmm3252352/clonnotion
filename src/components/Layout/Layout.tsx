import { useState, useEffect, useRef, useCallback } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { ChevronsLeft, ChevronsRight, Sparkles, X, Send, Search, Loader2 } from "lucide-react";
import { useWorkspace } from "../../store";

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const aiResponses: Record<string, string[]> = {
  help: [
    "Я могу помочь вам со многими вещами! Попробуйте спросить меня о:",
    "• Создании новых страниц или баз данных",
    "• Организации рабочего пространства",
    "• Использовании горячих клавиш",
    "• Советах по ведению заметок",
  ],
  page: [
    "Чтобы создать новую страницу:",
    "1. Нажмите «Новая страница» в боковой панели",
    "2. Или используйте команду «/» на любой странице",
    "3. Начните вводить содержимое!",
  ],
  shortcut: [
    "Вот несколько полезных сочетаний клавиш:",
    "• Cmd/Ctrl + K: Быстрый поиск",
    "• Cmd/Ctrl + N: Новая страница",
    "• /: Открыть меню блоков",
    "• Esc: Закрыть меню",
  ],
  database: [
    "Базы данных помогают организовать структурированные данные:",
    "• Создавайте таблицы с настраиваемыми свойствами",
    "• Фильтруйте и сортируйте данные",
    "• Используйте разные представления: таблица, доска или список",
  ],
  organize: [
    "Советы по организации рабочего пространства:",
    "• Используйте избранное для быстрого доступа",
    "• Создавайте вложенные страницы для иерархии",
    "• Добавляйте иконки и обложки для визуального различия",
    "• Используйте теги в базах данных для категоризации",
  ],
  default: [
    "Я NoteZero AI, ваш помощник по рабочему пространству!",
    "Я могу помочь вам ориентироваться, организовывать и максимально эффективно использовать NoteZero.",
    "Попробуйте спросить о страницах, горячих клавишах, базах данных или советах по организации!",
  ],
};

const getAIResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('помощь') || lowerMessage.includes('помоги') || lowerMessage.includes('что ты умеешь') || lowerMessage.includes('help')) {
    return aiResponses.help.join('\n');
  }
  if (lowerMessage.includes('страниц') || lowerMessage.includes('создать') || lowerMessage.includes('новую') || lowerMessage.includes('page') || lowerMessage.includes('create')) {
    return aiResponses.page.join('\n');
  }
  if (lowerMessage.includes('клавиш') || lowerMessage.includes('горяч') || lowerMessage.includes('shortcut') || lowerMessage.includes('keyboard')) {
    return aiResponses.shortcut.join('\n');
  }
  if (lowerMessage.includes('база') || lowerMessage.includes('таблиц') || lowerMessage.includes('данн') || lowerMessage.includes('database') || lowerMessage.includes('table')) {
    return aiResponses.database.join('\n');
  }
  if (lowerMessage.includes('организ') || lowerMessage.includes('структур') || lowerMessage.includes('organize') || lowerMessage.includes('arrange')) {
    return aiResponses.organize.join('\n');
  }
  
  return aiResponses.default.join('\n');
};

const AIChat = ({ onClose }: { onClose: () => void }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isTyping) return;
    
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);
    
    const typingDelay = 800 + Math.random() * 700;
    
    setTimeout(() => {
      const aiResponse = getAIResponse(userMessage.content);
      const aiMessage: ChatMessage = {
        id: generateId(),
        role: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, typingDelay);
  };

  const suggestedQuestions = [
    "Чем ты можешь мне помочь?",
    "Как создать страницу?",
    "Покажи горячие клавиши",
  ];

  const handleSuggestionClick = (question: string) => {
    setMessage(question);
    inputRef.current?.focus();
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-[#e6e4df] z-50 overflow-hidden flex flex-col max-h-[480px]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e6e4df] bg-[#f7f6f3] flex-shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#2383e2]" />
          <span className="text-sm font-medium text-[#37352f]">NoteZero AI</span>
        </div>
        <button 
          onClick={onClose} 
          className="text-[#9b9a97] hover:text-[#37352f] transition-colors p-1 rounded hover:bg-[#e6e4df]"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px]">
        {messages.length === 0 ? (
          <div className="text-center py-4">
            <Sparkles className="w-8 h-8 mx-auto mb-3 text-[#2383e2]" />
            <p className="text-sm font-medium text-[#37352f] mb-1">Помощник NoteZero AI</p>
            <p className="text-xs text-[#9b9a97] mb-4">Спросите меня о вашем рабочем пространстве!</p>
            
            <div className="space-y-2">
              {suggestedQuestions.map((question, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(question)}
                  className="w-full text-left px-3 py-2 text-xs text-[#37352f] bg-[#f7f6f3] rounded-lg hover:bg-[#efefec] transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm whitespace-pre-line ${
                  msg.role === 'user' 
                    ? 'bg-[#2383e2] text-white' 
                    : 'bg-[#f7f6f3] text-[#37352f]'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#f7f6f3] text-[#37352f] px-3 py-2 rounded-lg flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin text-[#9b9a97]" />
                  <span className="text-xs text-[#9b9a97]">Думаю...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-[#e6e4df] bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Спросите что угодно..."
            disabled={isTyping}
            className="flex-1 px-3 py-2 text-sm border border-[#e6e4df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383e2] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={!message.trim() || isTyping}
            className="w-8 h-8 bg-[#2383e2] text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1a6bc2] transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};

const GlobalSearch = ({ onClose }: { onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const { pages } = useWorkspace();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredPages = pages.filter(p =>
    !p.isArchived && p.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDatabases: any[] = [];

  const handleSelect = (type: 'page' | 'database', id: string) => {
    onClose();
    navigate(type === 'page' ? `/page/${id}` : `/database/${id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center pt-24 z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-xl shadow-2xl w-[560px] max-h-[60vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e6e4df]">
          <Search className="w-5 h-5 text-[#9b9a97]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск страниц и баз данных..."
            className="flex-1 text-sm outline-none"
          />
          <kbd className="px-2 py-1 bg-[#f7f6f3] rounded text-xs text-[#9b9a97]">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredPages.length === 0 && filteredDatabases.length === 0 && query && (
            <div className="text-center text-sm text-[#9b9a97] py-8">
              Ничего не найдено по запросу «{query}»
            </div>
          )}

          {filteredPages.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-xs text-[#9b9a97] font-medium">Страницы</div>
              {filteredPages.slice(0, 5).map(page => (
                <button
                  key={page.id}
                  onClick={() => handleSelect('page', page.id)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#f7f6f3] text-left transition-colors"
                >
                  <span className="text-base">{page.icon || '📄'}</span>
                  <span className="text-sm text-[#37352f]">{page.title}</span>
                </button>
              ))}
            </div>
          )}

          {filteredDatabases.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs text-[#9b9a97] font-medium">Базы данных</div>
              {filteredDatabases.map(db => (
                <button
                  key={db.id}
                  onClick={() => handleSelect('database', db.id)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#f7f6f3] text-left transition-colors"
                >
                  <span className="text-base">{db.icon || '📋'}</span>
                  <span className="text-sm text-[#37352f]">{db.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Layout = (): JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="w-full h-screen flex bg-[#fafaf9]">
      <div 
        className={`relative flex-shrink-0 transition-all duration-300 overflow-hidden ${sidebarCollapsed ? "w-0" : "w-60"}`}
      >
        <div className="w-60 h-full">
          <Sidebar />
        </div>
      </div>
      <button
        onClick={() => setSidebarCollapsed(prev => !prev)}
        className={`absolute top-3 z-50 w-6 h-6 flex items-center justify-center rounded hover:bg-[#e6e4df] text-[#9b9a97] transition-all duration-300 ${sidebarCollapsed ? "left-2" : "left-[232px]"}`}
      >
        {sidebarCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
      </button>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>

      {!showAIChat && (
        <button
          onClick={() => setShowAIChat(true)}
          className="fixed bottom-4 right-4 w-12 h-12 bg-[#2383e2] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#1a6bc2] transition-all z-40 hover:scale-105"
        >
          <Sparkles className="w-5 h-5" />
        </button>
      )}

      {showAIChat && <AIChat onClose={() => setShowAIChat(false)} />}
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
    </div>
  );
};
