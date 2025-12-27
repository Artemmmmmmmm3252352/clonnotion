import { useState } from "react";
import { Sparkles, Send, Globe, Search as SearchIcon } from "lucide-react";

export const AIPage = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"auto" | "research" | "all">("auto");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("AI query:", query, "mode:", mode);
      setQuery("");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="px-6 py-4 flex justify-end">
        <button className="text-sm text-[#9b9a97] hover:text-[#37352f]">
          Personalize
        </button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-16 h-16 mb-6 bg-[#f7f6f3] rounded-lg flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#9b9a97]" />
        </div>
        
        <h1 className="text-2xl font-semibold text-[#37352f] mb-8">
          How can I help you today?
        </h1>

        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="border border-[#e6e4df] rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-xs text-[#9b9a97]">
              <Sparkles className="w-4 h-4" />
              <span>Add context</span>
            </div>
            
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask, search, or make anything..."
              className="w-full text-[#37352f] placeholder-[#9b9a97] outline-none text-sm mb-4"
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode("auto")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
                    mode === "auto" ? "bg-[#efefec] text-[#37352f]" : "text-[#9b9a97] hover:bg-[#efefec]"
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  Auto
                </button>
                <button
                  type="button"
                  onClick={() => setMode("research")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
                    mode === "research" ? "bg-[#efefec] text-[#37352f]" : "text-[#9b9a97] hover:bg-[#efefec]"
                  }`}
                >
                  <SearchIcon className="w-3 h-3" />
                  Research
                </button>
                <button
                  type="button"
                  onClick={() => setMode("all")}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-colors ${
                    mode === "all" ? "bg-[#efefec] text-[#37352f]" : "text-[#9b9a97] hover:bg-[#efefec]"
                  }`}
                >
                  <Globe className="w-3 h-3" />
                  All sources
                </button>
              </div>

              <button
                type="submit"
                disabled={!query.trim()}
                className="w-8 h-8 rounded-full bg-[#2383e2] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#1a6fc9] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-[#9b9a97]">Get better answers from your apps</p>
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-[#9b9a97] mb-2">Get started</p>
        </div>
      </main>
    </div>
  );
};
