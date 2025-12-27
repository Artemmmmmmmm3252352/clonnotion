import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MoreHorizontal, MessageSquare, Clock } from "lucide-react";
import { useWorkspace } from "../../store";
import { BlockEditor } from "../../components/Editor";
import { Button } from "../../components/ui/button";

const emojiList = ["📄", "📋", "📝", "📌", "🗂️", "📁", "💡", "🎯", "🚀", "⭐", "💼", "📊", "🏠", "✨"];

export const PageEditorPage = (): JSX.Element => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { getPage, updatePage, toggleFavorite, setCurrentPageId } = useWorkspace();
  
  const page = pageId ? getPage(pageId) : null;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(page?.title || "Untitled");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (pageId) {
      setCurrentPageId(pageId);
    }
  }, [pageId, setCurrentPageId]);

  useEffect(() => {
    if (page) {
      setTitle(page.title);
    }
  }, [page]);

  if (!page) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl text-[#37352f] mb-2">Page not found</h2>
          <Button onClick={() => navigate("/")}>Go home</Button>
        </div>
      </div>
    );
  }

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    updatePage(page.id, { title: newTitle || "Untitled" });
  };

  const handleIconChange = (emoji: string) => {
    updatePage(page.id, { icon: emoji });
    setShowEmojiPicker(false);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="flex items-center justify-between px-6 py-3 border-b border-[#e6e4df]">
        <div className="flex items-center gap-2 text-sm text-[#9b9a97]">
          <span>{page.icon || "📄"}</span>
          <span className="text-[#37352f]">{page.title}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(page.id)}
            className="h-8 px-2"
          >
            <Star className={`w-4 h-4 ${page.isFavorite ? "fill-[#f5c518] text-[#f5c518]" : "text-[#9b9a97]"}`} />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <Clock className="w-4 h-4 text-[#9b9a97]" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <MessageSquare className="w-4 h-4 text-[#9b9a97]" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2">
            <MoreHorizontal className="w-4 h-4 text-[#9b9a97]" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-16 py-12">
          <div className="mb-8">
            <div className="relative inline-block mb-4">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="text-6xl hover:bg-[#efefec] rounded-lg p-2 transition-colors"
              >
                {page.icon || "📄"}
              </button>
              
              {showEmojiPicker && (
                <div className="absolute left-0 top-full mt-2 bg-white border border-[#e6e4df] rounded-lg shadow-lg p-3 z-50">
                  <div className="grid grid-cols-7 gap-1">
                    {emojiList.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => handleIconChange(emoji)}
                        className="text-2xl p-2 hover:bg-[#efefec] rounded"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {isEditingTitle ? (
              <input
                autoFocus
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                className="text-4xl font-bold text-[#37352f] outline-none w-full bg-transparent"
                placeholder="Untitled"
              />
            ) : (
              <h1
                onClick={() => setIsEditingTitle(true)}
                className="text-4xl font-bold text-[#37352f] cursor-text hover:bg-[#efefec] rounded px-1 -mx-1"
              >
                {page.title || "Untitled"}
              </h1>
            )}
          </div>

          <div className="space-y-1">
            {page.blocks.map((block) => (
              <BlockEditor
                key={block.id}
                pageId={page.id}
                block={block}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
