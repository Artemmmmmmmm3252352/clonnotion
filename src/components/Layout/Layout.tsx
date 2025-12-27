import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { ChevronsLeft, ChevronsRight, Sparkles, X, Send, Search, FileText, Database } from "lucide-react";
import { useWorkspace } from "../../store";

const AIChat = ({ onClose }: { onClose: () => void }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    setMessage("");
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: "I'm here to help! This is a demo response from NoteZero AI." }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-xl shadow-2xl border border-[#e6e4df] z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#e6e4df] bg-[#f7f6f3]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#9b9a97]" />
          <span className="text-sm font-medium text-[#37352f]">NoteZero AI</span>
        </div>
        <button onClick={onClose} className="text-[#9b9a97] hover:text-[#37352f]">
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-sm text-[#9b9a97] py-8">
            <Sparkles className="w-8 h-8 mx-auto mb-2 text-[#9b9a97]" />
            <p>Your improved NoteZero AI</p>
            <p className="text-xs mt-2">Here are a few things I can do, or ask me anything!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div key={i} className={`text-sm ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`inline-block px-3 py-2 rounded-lg ${
                msg.role === 'user' ? 'bg-[#2383e2] text-white' : 'bg-[#f7f6f3] text-[#37352f]'
              }`}>
                {msg.content}
              </span>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-3 border-t border-[#e6e4df]">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask, search, or make anything..."
            className="flex-1 px-3 py-2 text-sm border border-[#e6e4df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383e2]"
          />
          <button
            type="submit"
            disabled={!message.trim()}
            className="w-8 h-8 bg-[#2383e2] text-white rounded-lg flex items-center justify-center disabled:opacity-50"
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
  const { workspace } = useWorkspace();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filteredPages = workspace.pages.filter(p => 
    !p.isArchived && p.title.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDatabases = workspace.databases.filter(d =>
    d.name.toLowerCase().includes(query.toLowerCase())
  );

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
            placeholder="Search pages and databases..."
            className="flex-1 text-sm outline-none"
          />
          <kbd className="px-2 py-1 bg-[#f7f6f3] rounded text-xs text-[#9b9a97]">ESC</kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2">
          {filteredPages.length === 0 && filteredDatabases.length === 0 && query && (
            <div className="text-center text-sm text-[#9b9a97] py-8">
              No results found for "{query}"
            </div>
          )}

          {filteredPages.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-xs text-[#9b9a97] font-medium">Pages</div>
              {filteredPages.slice(0, 5).map(page => (
                <button
                  key={page.id}
                  onClick={() => handleSelect('page', page.id)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#f7f6f3] text-left"
                >
                  <span className="text-base">{page.icon || '📄'}</span>
                  <span className="text-sm text-[#37352f]">{page.title}</span>
                </button>
              ))}
            </div>
          )}

          {filteredDatabases.length > 0 && (
            <div>
              <div className="px-2 py-1 text-xs text-[#9b9a97] font-medium">Databases</div>
              {filteredDatabases.map(db => (
                <button
                  key={db.id}
                  onClick={() => handleSelect('database', db.id)}
                  className="w-full flex items-center gap-2 px-2 py-2 rounded-md hover:bg-[#f7f6f3] text-left"
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

      <button
        onClick={() => setShowAIChat(!showAIChat)}
        className="fixed bottom-4 right-4 w-12 h-12 bg-white rounded-full shadow-lg border border-[#e6e4df] flex items-center justify-center hover:bg-[#f7f6f3] transition-colors z-40"
      >
        <Sparkles className="w-5 h-5 text-[#9b9a97]" />
      </button>

      {showAIChat && <AIChat onClose={() => setShowAIChat(false)} />}
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}
    </div>
  );
};
