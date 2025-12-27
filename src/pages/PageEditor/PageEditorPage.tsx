import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MoreHorizontal, MessageSquare, Clock, Image, X, ChevronRight, Share2, Lock, Link, Copy, Check } from "lucide-react";
import { useWorkspace } from "../../store";
import { BlockEditor } from "../../components/Editor";
import { Button } from "../../components/ui/button";

const SharePanel = ({ onClose }: { onClose: () => void }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [accessLevel, setAccessLevel] = useState("view");

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 top-full mt-2 w-80 bg-white border border-[#e6e4df] rounded-lg shadow-xl z-50"
    >
      <div className="p-4 border-b border-[#e6e4df]">
        <div className="flex gap-4 mb-4">
          <button className="text-sm font-medium text-[#37352f] border-b-2 border-[#37352f] pb-1">Share</button>
          <button className="text-sm text-[#9b9a97] pb-1">Publish</button>
        </div>
        
        <input
          type="text"
          placeholder="Email or group, separated by commas"
          className="w-full px-3 py-2 text-sm border border-[#e6e4df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383e2]"
        />
        <button className="mt-2 px-3 py-1.5 bg-[#2383e2] text-white text-sm rounded-lg hover:bg-[#1a6fc9]">
          Invite
        </button>
      </div>

      <div className="p-4 border-b border-[#e6e4df]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#2383e2] rounded-full flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
          <div className="flex-1">
            <div className="text-sm text-[#37352f]">You</div>
            <div className="text-xs text-[#9b9a97]">user@example.com</div>
          </div>
          <span className="text-xs text-[#9b9a97]">Full access</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-[#37352f] mb-2">
          <Lock className="w-4 h-4 text-[#9b9a97]" />
          <span>Only people invited</span>
        </div>
        <button 
          onClick={handleCopyLink}
          className="flex items-center gap-2 text-sm text-[#2383e2] hover:underline"
        >
          {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
          {copied ? "Link copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
};

const emojiList = ["📄", "📋", "📝", "📌", "🗂️", "📁", "💡", "🎯", "🚀", "⭐", "💼", "📊", "🏠", "✨", "🎨", "📚", "🔥", "💪", "🌟", "🎉"];

const coverGradients = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
];

const coverColors = [
  "#e6e4df", "#f5f5f4", "#fef3c7", "#dcfce7", "#dbeafe", "#e0e7ff", "#fce7f3", "#fecaca"
];

export const PageEditorPage = (): JSX.Element => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { getPage, updatePage, toggleFavorite, setCurrentPageId, getPagePath } = useWorkspace();
  
  const page = pageId ? getPage(pageId) : null;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(page?.title || "Untitled");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [isHoveringCover, setIsHoveringCover] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);

  const pagePath = pageId ? getPagePath(pageId) : [];

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showEmojiPicker || showCoverMenu) {
        setShowEmojiPicker(false);
        setShowCoverMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showEmojiPicker, showCoverMenu]);

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

  const handleCoverChange = (cover: string) => {
    updatePage(page.id, { cover });
    setShowCoverMenu(false);
  };

  const handleRemoveCover = () => {
    updatePage(page.id, { cover: undefined });
    setShowCoverMenu(false);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-2 border-b border-[#e6e4df]">
        <div className="flex items-center gap-1 text-sm text-[#9b9a97]">
          {pagePath.map((p, idx) => (
            <React.Fragment key={p.id}>
              {idx > 0 && <ChevronRight className="w-3 h-3" />}
              <button
                onClick={() => navigate(`/page/${p.id}`)}
                className="flex items-center gap-1 hover:bg-[#efefec] rounded px-1.5 py-0.5"
              >
                <span className="text-sm">{p.icon || "📄"}</span>
                <span className="text-[#37352f] max-w-[120px] truncate">{p.title}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
        
        <div className="flex items-center gap-1 relative">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSharePanel(!showSharePanel)}
              className="h-7 px-3 text-sm text-[#37352f]"
            >
              Share
            </Button>
            {showSharePanel && <SharePanel onClose={() => setShowSharePanel(false)} />}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(page.id)}
            className="h-7 px-2"
          >
            <Star className={`w-4 h-4 ${page.isFavorite ? "fill-[#f5c518] text-[#f5c518]" : "text-[#9b9a97]"}`} />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 px-2">
            <MoreHorizontal className="w-4 h-4 text-[#9b9a97]" />
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {page.cover && (
          <div
            className="relative h-[200px] w-full"
            style={{ background: page.cover }}
            onMouseEnter={() => setIsHoveringCover(true)}
            onMouseLeave={() => setIsHoveringCover(false)}
          >
            {isHoveringCover && (
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowCoverMenu(true); }}
                  className="bg-white/90 hover:bg-white text-[#37352f] text-xs px-3 py-1.5 rounded shadow"
                >
                  Change cover
                </button>
              </div>
            )}
          </div>
        )}

        <div className={`max-w-3xl mx-auto px-16 ${page.cover ? "pt-8" : "pt-12"} pb-12`}>
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`text-6xl hover:bg-[#efefec] rounded-lg p-2 transition-colors ${page.cover ? "-mt-16" : ""}`}
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

              {!page.cover && (
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setShowCoverMenu(!showCoverMenu)}
                    className="text-sm text-[#9b9a97] hover:bg-[#efefec] rounded px-2 py-1 flex items-center gap-1"
                  >
                    <Image className="w-4 h-4" />
                    Add cover
                  </button>
                </div>
              )}
            </div>

            {showCoverMenu && (
              <div 
                className="absolute bg-white border border-[#e6e4df] rounded-lg shadow-lg p-4 z-50 w-[300px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-[#37352f]">Cover</span>
                  {page.cover && (
                    <button onClick={handleRemoveCover} className="text-xs text-[#eb5757] hover:underline">
                      Remove
                    </button>
                  )}
                </div>
                <div className="mb-3">
                  <div className="text-xs text-[#9b9a97] mb-2">Gradients</div>
                  <div className="grid grid-cols-5 gap-2">
                    {coverGradients.map((gradient, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCoverChange(gradient)}
                        className="w-10 h-6 rounded border border-[#e6e4df] hover:ring-2 hover:ring-[#2383e2]"
                        style={{ background: gradient }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-[#9b9a97] mb-2">Colors</div>
                  <div className="grid grid-cols-8 gap-2">
                    {coverColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCoverChange(color)}
                        className="w-6 h-6 rounded border border-[#e6e4df] hover:ring-2 hover:ring-[#2383e2]"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

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
            {page.blocks.map((block, index) => (
              <BlockEditor
                key={block.id}
                pageId={page.id}
                block={block}
                index={index}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
