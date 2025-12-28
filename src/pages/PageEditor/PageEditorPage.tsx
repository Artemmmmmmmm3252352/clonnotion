import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, MoreHorizontal, Image, ChevronRight, Lock, Link, Check } from "lucide-react";
import { useWorkspace } from "../../store";
import { BlockEditor } from "../../components/Editor";
import { Button } from "../../components/ui/button";

const SharePanel = ({ onClose }: { onClose: () => void }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

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
          <button className="text-sm font-medium text-[#37352f] border-b-2 border-[#37352f] pb-1">Поделиться</button>
          <button className="text-sm text-[#9b9a97] pb-1">Опубликовать</button>
        </div>
        
        <input
          type="text"
          placeholder="Email или группа, через запятую"
          className="w-full px-3 py-2 text-sm border border-[#e6e4df] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2383e2]"
        />
        <button className="mt-2 px-3 py-1.5 bg-[#2383e2] text-white text-sm rounded-lg hover:bg-[#1a6fc9]">
          Пригласить
        </button>
      </div>

      <div className="p-4 border-b border-[#e6e4df]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-[#2383e2] rounded-full flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
          <div className="flex-1">
            <div className="text-sm text-[#37352f]">Вы</div>
            <div className="text-xs text-[#9b9a97]">user@example.com</div>
          </div>
          <span className="text-xs text-[#9b9a97]">Полный доступ</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-[#37352f] mb-2">
          <Lock className="w-4 h-4 text-[#9b9a97]" />
          <span>Только приглашённые</span>
        </div>
        <button 
          onClick={handleCopyLink}
          className="flex items-center gap-2 text-sm text-[#2383e2] hover:underline"
        >
          {copied ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
          {copied ? "Ссылка скопирована!" : "Скопировать ссылку"}
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
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)",
  "linear-gradient(135deg, #fddb92 0%, #d1fdff 100%)",
  "linear-gradient(135deg, #ff6b6b 0%, #feca57 100%)",
  "linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)",
];

const coverColors = [
  "#e6e4df", "#f5f5f4", "#fef3c7", "#dcfce7", "#dbeafe", "#e0e7ff", "#fce7f3", "#fecaca",
  "#d1fae5", "#fef9c3", "#e9d5ff", "#cffafe"
];

const coverImages = [
  "https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/235994/pexels-photo-235994.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1089438/pexels-photo-1089438.jpeg?auto=compress&cs=tinysrgb&w=1200",
  "https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1200",
];

export const PageEditorPage = (): JSX.Element => {
  const { pageId } = useParams<{ pageId: string }>();
  const navigate = useNavigate();
  const { getPage, updatePage, toggleFavorite, setCurrentPageId, getPagePath, loadBlocks } = useWorkspace();
  
  const page = pageId ? getPage(pageId) : null;
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(page?.title || "Без названия");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showCoverMenu, setShowCoverMenu] = useState(false);
  const [isHoveringCover, setIsHoveringCover] = useState(false);
  const [showSharePanel, setShowSharePanel] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const pagePath = pageId ? getPagePath(pageId) : [];

  useEffect(() => {
    if (pageId) {
      setCurrentPageId(pageId);
      loadBlocks(pageId);
    }
  }, [pageId, setCurrentPageId, loadBlocks]);

  useEffect(() => {
    if (page) {
      setTitle(page.title);
    }
  }, [page]);

  useEffect(() => {
    const handleClickOutside = () => {
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
          <h2 className="text-xl text-[#37352f] mb-2">Страница не найдена</h2>
          <Button onClick={() => navigate("/")}>На главную</Button>
        </div>
      </div>
    );
  }

  const handleTitleChange = async (newTitle: string) => {
    setTitle(newTitle);
    await updatePage(page.id, { title: newTitle || "Без названия" });
  };

  const handleIconChange = async (emoji: string) => {
    await updatePage(page.id, { icon: emoji });
    setShowEmojiPicker(false);
  };

  const handleCoverChange = async (cover: string) => {
    await updatePage(page.id, { cover });
    setShowCoverMenu(false);
  };

  const handleRemoveCover = async () => {
    await updatePage(page.id, { cover: undefined });
    setShowCoverMenu(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        handleCoverChange(`url(${imageUrl})`);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white">
      <main className="flex-1 overflow-y-auto">
        {page.cover ? (
          <div
            className="relative w-full h-[50vh] min-h-[340px]"
            style={{ background: page.cover }}
            onMouseEnter={() => setIsHoveringCover(true)}
            onMouseLeave={() => setIsHoveringCover(false)}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />

            <header className="absolute top-0 left-0 right-0 flex items-center justify-between px-16 py-3">
              <div className="flex items-center gap-1 text-sm">
                {pagePath.map((p, idx) => (
                  <React.Fragment key={p.id}>
                    {idx > 0 && <ChevronRight className="w-3 h-3 text-white/80" />}
                    <button
                      onClick={() => navigate(`/page/${p.id}`)}
                      className="flex items-center gap-1 hover:bg-white/10 rounded px-2 py-1 text-white/90 hover:text-white transition-colors"
                    >
                      <span className="text-sm">{p.icon || "📄"}</span>
                      <span className="max-w-[120px] truncate">{p.title}</span>
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
                    className="h-7 px-3 text-sm text-white hover:bg-white/10"
                  >
                    Поделиться
                  </Button>
                  {showSharePanel && <SharePanel onClose={() => setShowSharePanel(false)} />}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => await toggleFavorite(page.id)}
                  className="h-7 px-2 hover:bg-white/10"
                >
                  <Star className={`w-4 h-4 ${page.isFavorite ? "fill-[#ffd700] text-[#ffd700]" : "text-white/80"}`} />
                </Button>
                <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-white/10">
                  <MoreHorizontal className="w-4 h-4 text-white/80" />
                </Button>
              </div>
            </header>

            {isHoveringCover && (
              <div className="absolute top-3 right-16 flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); setShowCoverMenu(true); }}
                  className="bg-white/95 backdrop-blur-sm hover:bg-white text-[#37352f] text-sm px-3 py-1.5 rounded-md shadow-lg font-medium transition-all"
                >
                  Изменить обложку
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); handleRemoveCover(); }}
                  className="bg-white/95 backdrop-blur-sm hover:bg-white text-[#eb5757] text-sm px-3 py-1.5 rounded-md shadow-lg font-medium transition-all"
                >
                  Удалить
                </button>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 px-16 pb-12">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="text-7xl hover:scale-110 transition-transform mb-4 drop-shadow-lg"
                >
                  {page.icon || "📄"}
                </button>

                {showEmojiPicker && (
                  <div className="absolute left-0 top-full mt-2 bg-white border border-[#e6e4df] rounded-lg shadow-xl p-4 z-50 w-[280px]">
                    <div className="text-xs font-semibold text-[#37352f] mb-3">Выберите иконку</div>
                    <div className="grid grid-cols-7 gap-1">
                      {emojiList.map(emoji => (
                        <button
                          key={emoji}
                          onClick={() => handleIconChange(emoji)}
                          className="text-2xl p-2 hover:bg-[#f7f9fb] rounded transition-all hover:scale-110"
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
                  className="text-5xl font-bold text-white outline-none w-full bg-transparent drop-shadow-lg placeholder:text-white/60"
                  placeholder="Без названия"
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="text-5xl font-bold text-white cursor-text hover:opacity-90 transition-opacity drop-shadow-lg"
                >
                  {page.title || "Без названия"}
                </h1>
              )}
            </div>
          </div>
        ) : (
          <header className="flex items-center justify-between px-16 py-3 border-b border-[#e6e4df]">
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
                  Поделиться
                </Button>
                {showSharePanel && <SharePanel onClose={() => setShowSharePanel(false)} />}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => await toggleFavorite(page.id)}
                className="h-7 px-2"
              >
                <Star className={`w-4 h-4 ${page.isFavorite ? "fill-[#f5c518] text-[#f5c518]" : "text-[#9b9a97]"}`} />
              </Button>
              <Button variant="ghost" size="sm" className="h-7 px-2">
                <MoreHorizontal className="w-4 h-4 text-[#9b9a97]" />
              </Button>
            </div>
          </header>
        )}

        <div className="max-w-3xl mx-auto px-16 py-12">
          {!page.cover && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="text-7xl hover:bg-[#efefec] rounded-lg p-2 transition-colors"
                  >
                    {page.icon || "📄"}
                  </button>

                  {showEmojiPicker && (
                    <div className="absolute left-0 top-full mt-2 bg-white border border-[#e6e4df] rounded-lg shadow-xl p-4 z-50 w-[280px]">
                      <div className="text-xs font-semibold text-[#37352f] mb-3">Выберите иконку</div>
                      <div className="grid grid-cols-7 gap-1">
                        {emojiList.map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleIconChange(emoji)}
                            className="text-2xl p-2 hover:bg-[#f7f9fb] rounded transition-all hover:scale-110"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => { e.stopPropagation(); setShowCoverMenu(true); }}
                  className="text-sm text-[#9b9a97] hover:bg-[#efefec] rounded px-2 py-1 flex items-center gap-1"
                >
                  <Image className="w-4 h-4" />
                  Добавить обложку
                </button>
              </div>

              {isEditingTitle ? (
                <input
                  autoFocus
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  onBlur={() => setIsEditingTitle(false)}
                  onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                  className="text-5xl font-bold text-[#37352f] outline-none w-full bg-transparent"
                  placeholder="Без названия"
                />
              ) : (
                <h1
                  onClick={() => setIsEditingTitle(true)}
                  className="text-5xl font-bold text-[#37352f] cursor-text hover:bg-[#efefec] rounded px-1 -mx-1"
                >
                  {page.title || "Без названия"}
                </h1>
              )}
            </div>
          )}

          {showCoverMenu && (
            <div className="relative mb-8">
              <div
                className="absolute left-0 top-0 bg-white border border-[#e6e4df] rounded-lg shadow-xl p-4 z-50 w-[360px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-semibold text-[#37352f]">Обложка страницы</span>
                  {page.cover && (
                    <button
                      onClick={handleRemoveCover}
                      className="text-xs text-[#eb5757] hover:bg-red-50 px-2 py-1 rounded transition-colors"
                    >
                      Удалить
                    </button>
                  )}
                </div>

                <div className="mb-4">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 border-2 border-dashed border-[#e6e4df] rounded-lg hover:border-[#2383e2] hover:bg-[#f7f9fb] transition-all text-sm text-[#37352f] font-medium flex items-center justify-center gap-2"
                  >
                    <Image className="w-4 h-4" />
                    Загрузить изображение
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                <div className="mb-4">
                  <div className="text-xs font-medium text-[#37352f] mb-2">Готовые изображения</div>
                  <div className="grid grid-cols-3 gap-2">
                    {coverImages.map((image, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCoverChange(`url(${image}) center/cover`)}
                        className="aspect-video rounded border-2 border-[#e6e4df] hover:border-[#2383e2] overflow-hidden transition-all hover:scale-105"
                        style={{
                          backgroundImage: `url(${image})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs font-medium text-[#37352f] mb-2">Градиенты</div>
                  <div className="grid grid-cols-6 gap-2">
                    {coverGradients.map((gradient, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCoverChange(gradient)}
                        className="aspect-video rounded border-2 border-[#e6e4df] hover:border-[#2383e2] transition-all hover:scale-105"
                        style={{ background: gradient }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium text-[#37352f] mb-2">Сплошные цвета</div>
                  <div className="grid grid-cols-8 gap-2">
                    {coverColors.map((color, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleCoverChange(color)}
                        className="w-8 h-8 rounded border-2 border-[#e6e4df] hover:border-[#2383e2] transition-all hover:scale-110"
                        style={{ background: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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
