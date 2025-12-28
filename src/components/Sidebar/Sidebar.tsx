import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Star, MoveHorizontal as MoreHorizontal, Chrome as Home, FileText, Database, Trash2, Search, Copy, CreditCard as Edit2, Inbox, Settings, Users, Share2, LogOut } from "lucide-react";
import { useWorkspace } from "../../store";
import { useAuth } from "../../contexts/AuthContext";
import { useWorkspaces } from "../../hooks/useWorkspaces";
import { WorkspaceSwitcher } from "../WorkspaceSwitcher";
import { ShareModal } from "../ShareModal";
import { Page } from "../../store/types";

interface PageMenuProps {
  page: Page;
  onClose: () => void;
  position: { x: number; y: number };
}

const PageMenu = ({ page, onClose, position }: PageMenuProps) => {
  const { deletePage, duplicatePage, toggleFavorite, updatePage } = useWorkspace();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(page.title);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleRename = async () => {
    if (newTitle.trim()) {
      await updatePage(page.id, { title: newTitle.trim() });
    }
    setIsRenaming(false);
    onClose();
  };

  const handleDuplicate = async () => {
    const newPage = await duplicatePage(page.id);
    if (newPage) {
      navigate(`/page/${newPage.id}`);
    }
    onClose();
  };

  const handleDelete = async () => {
    await deletePage(page.id);
    navigate("/");
    onClose();
  };

  const handleFavorite = async () => {
    await toggleFavorite(page.id);
    onClose();
  };

  if (isRenaming) {
    return (
      <div
        ref={menuRef}
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-[#e6e4df] p-2 min-w-[200px]"
        style={{ left: position.x, top: position.y }}
      >
        <input
          autoFocus
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename();
            if (e.key === "Escape") onClose();
          }}
          className="w-full px-2 py-1 text-sm border border-[#e6e4df] rounded focus:outline-none focus:ring-2 focus:ring-[#2383e2]"
        />
      </div>
    );
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-[#e6e4df] py-1 min-w-[160px]"
      style={{ left: position.x, top: position.y }}
    >
      <button
        onClick={() => setIsRenaming(true)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#37352f] hover:bg-[#efefec] text-left"
      >
        <Edit2 className="w-4 h-4" />
        Переименовать
      </button>
      <button
        onClick={handleDuplicate}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#37352f] hover:bg-[#efefec] text-left"
      >
        <Copy className="w-4 h-4" />
        Дублировать
      </button>
      <button
        onClick={handleFavorite}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#37352f] hover:bg-[#efefec] text-left"
      >
        <Star className={`w-4 h-4 ${page.isFavorite ? "fill-[#f5c518] text-[#f5c518]" : ""}`} />
        {page.isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
      </button>
      <div className="h-px bg-[#e6e4df] my-1" />
      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#eb5757] hover:bg-[#efefec] text-left"
      >
        <Trash2 className="w-4 h-4" />
        Удалить
      </button>
    </div>
  );
};

interface PageItemProps {
  page: Page;
  level: number;
}

const PageItem = ({ page, level }: PageItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const { currentPageId, setCurrentPageId, getChildPages, toggleFavorite } = useWorkspace();
  const navigate = useNavigate();
  
  const childPages = getChildPages(page.id);
  const hasChildren = childPages.length > 0;
  const isActive = currentPageId === page.id;

  const handleClick = () => {
    setCurrentPageId(page.id);
    navigate(`/page/${page.id}`);
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ x: rect.right + 4, y: rect.top });
  };

  return (
    <div>
      <div
        className={`flex items-center gap-1 px-2 py-1 rounded-md cursor-pointer transition-colors group ${
          isActive ? "bg-[#efefec]" : "hover:bg-[#efefec]"
        }`}
        style={{ paddingLeft: `${8 + level * 12}px` }}
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button
          className={`w-5 h-5 flex items-center justify-center rounded hover:bg-[#ddd] transition-transform ${
            hasChildren ? "" : "opacity-0"
          } ${isExpanded ? "rotate-90" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
        >
          <ChevronRight className="w-3 h-3 text-[#9b9a97]" />
        </button>
        
        <span className="text-base mr-1">{page.icon || "📄"}</span>
        <span className="text-sm text-[#37352f] flex-1 truncate">{page.title}</span>
        
        {isHovered && (
          <div className="flex items-center gap-0.5">
            <button
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#ddd]"
              onClick={async (e) => {
                e.stopPropagation();
                await toggleFavorite(page.id);
              }}
            >
              <Star className={`w-3 h-3 ${page.isFavorite ? "fill-[#f5c518] text-[#f5c518]" : "text-[#9b9a97]"}`} />
            </button>
            <button 
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#ddd]"
              onClick={handleMenuClick}
            >
              <MoreHorizontal className="w-3 h-3 text-[#9b9a97]" />
            </button>
          </div>
        )}
      </div>
      
      {menuPosition && (
        <PageMenu
          page={page}
          position={menuPosition}
          onClose={() => setMenuPosition(null)}
        />
      )}
      
      {isExpanded && hasChildren && (
        <div>
          {childPages.map(child => (
            <PageItem key={child.id} page={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

interface TemplateModalProps {
  onClose: () => void;
  onCreate: (type: 'page' | 'database' | 'template', templateId?: string) => void;
}

const TemplateModal = ({ onClose, onCreate }: TemplateModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const templates = [
    { id: 'tasks', name: 'Трекер задач', icon: '✅', description: 'Отслеживайте свои задачи' },
    { id: 'projects', name: 'Проекты', icon: '📊', description: 'Управляйте проектами' },
    { id: 'notes', name: 'Заметки встреч', icon: '📝', description: 'Организуйте заметки встреч' },
    { id: 'docs', name: 'Документы', icon: '📚', description: 'Центр документов' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-[#e6e4df]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#37352f]">Создать страницу</h2>
            <button onClick={onClose} className="text-[#9b9a97] hover:text-[#37352f]">✕</button>
          </div>
          <input 
            type="text" 
            placeholder="Поиск шаблонов..." 
            className="w-full px-3 py-2 border border-[#e6e4df] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2383e2]"
          />
        </div>

        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button 
              onClick={() => onCreate('page')}
              className="flex flex-col items-center p-4 border border-[#e6e4df] rounded-lg hover:bg-[#f7f6f3] transition-colors"
            >
              <FileText className="w-8 h-8 text-[#9b9a97] mb-2" />
              <span className="text-sm font-medium text-[#37352f]">Пустая страница</span>
            </button>
            <button 
              onClick={() => onCreate('database')}
              className="flex flex-col items-center p-4 border border-[#e6e4df] rounded-lg hover:bg-[#f7f6f3] transition-colors"
            >
              <Database className="w-8 h-8 text-[#9b9a97] mb-2" />
              <span className="text-sm font-medium text-[#37352f]">Пустая база данных</span>
            </button>
            <button 
              onClick={() => onCreate('page')}
              className="flex flex-col items-center p-4 border border-[#e6e4df] rounded-lg hover:bg-[#f7f6f3] transition-colors"
            >
              <span className="text-2xl mb-2">✨</span>
              <span className="text-sm font-medium text-[#37352f]">Создать с ИИ</span>
            </button>
          </div>

          <div>
            <h3 className="text-xs font-medium text-[#9b9a97] uppercase tracking-wide mb-3">Рекомендуемые</h3>
            <div className="grid grid-cols-2 gap-3">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => onCreate('template', template.id)}
                  className="flex items-start gap-3 p-3 border border-[#e6e4df] rounded-lg hover:bg-[#f7f6f3] transition-colors text-left"
                >
                  <span className="text-2xl">{template.icon}</span>
                  <div>
                    <div className="text-sm font-medium text-[#37352f]">{template.name}</div>
                    <div className="text-xs text-[#9b9a97]">{template.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspace, getRootPages, getFavoritePages, createPage, setCurrentPageId, createDatabase } = useWorkspace();
  const { signOut, profile } = useAuth();
  const { currentWorkspace } = useWorkspaces();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const rootPages = getRootPages();
  const favoritePages = getFavoritePages();

  console.log('[Sidebar] Rendering with', rootPages.length, 'root pages');

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleTemplateCreate = (type: 'page' | 'database' | 'template', templateId?: string) => {
    setShowTemplateModal(false);
    if (type === 'page') {
      const newPage = createPage("Без названия");
      setCurrentPageId(newPage.id);
      navigate(`/page/${newPage.id}`);
    } else if (type === 'database') {
      const newDb = createDatabase("Без названия");
      navigate(`/database/${newDb.id}`);
    } else if (type === 'template' && templateId) {
      const newPage = createPage(templateId === 'tasks' ? 'Трекер задач' : templateId === 'projects' ? 'Проекты' : templateId === 'notes' ? 'Заметки встреч' : 'Документы');
      setCurrentPageId(newPage.id);
      navigate(`/page/${newPage.id}`);
    }
  };

  const topNavItems = [
    { id: "search", label: "Поиск", icon: Search, path: "/search" },
    { id: "home", label: "Главная", icon: Home, path: "/" },
    { id: "inbox", label: "Входящие", icon: Inbox, path: "/inbox" },
  ];

  const bottomItems = [
    { id: "settings", label: "Настройки", icon: Settings, path: "/settings" },
    { id: "trash", label: "Корзина", icon: Trash2, path: "/trash" },
  ];

  return (
    <aside className="w-60 h-full flex flex-col bg-[#f7f6f3] border-r border-[#e6e4df] overflow-hidden">
      <header className="px-3 py-3 border-b border-[#e6e4df] space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">📝</span>
          <h1 className="text-sm font-semibold text-[#37352f] flex-1">NoteZero</h1>
        </div>
        <WorkspaceSwitcher />
      </header>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2 mb-2">
          {topNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  isActive ? "bg-[#efefec]" : "hover:bg-[#efefec]"
                }`}
              >
                <item.icon className="w-4 h-4 text-[#9b9a97]" />
                <span className="text-sm text-[#37352f]">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-2">
          <div className="px-4 py-1">
            <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
              Личное
            </span>
          </div>
          <div className="px-2">
            {rootPages.map(page => (
              <PageItem key={page.id} page={page} level={0} />
            ))}
            <button
              onClick={() => setShowTemplateModal(true)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors hover:bg-[#efefec]"
            >
              <Plus className="w-4 h-4 text-[#9b9a97]" />
              <span className="text-sm text-[#9b9a97]">Добавить</span>
            </button>
          </div>
        </div>

        <div className="mb-2">
          <div className="px-4 py-1">
            <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
              Общее
            </span>
          </div>
          <div className="px-2">
            <button
              onClick={() => {}}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors hover:bg-[#efefec]"
            >
              <Plus className="w-4 h-4 text-[#9b9a97]" />
              <span className="text-sm text-[#9b9a97]">Начать совместную работу</span>
            </button>
          </div>
        </div>

        {favoritePages.length > 0 && (
          <div className="mb-2">
            <div className="px-4 py-1">
              <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
                Избранное
              </span>
            </div>
            <div className="px-2">
              {favoritePages.map(page => (
                <PageItem key={page.id} page={page} level={0} />
              ))}
            </div>
          </div>
        )}

        {false && (
          <div className="mb-2">
            <div className="px-4 py-1">
              <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
                Базы данных
              </span>
            </div>
            <div className="px-2">
              {[].map((db: any) => (
                <button
                  key={db.id}
                  onClick={() => navigate(`/database/${db.id}`)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors hover:bg-[#efefec]"
                >
                  <span className="text-base">{db.icon || "📋"}</span>
                  <span className="text-sm text-[#37352f]">{db.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="px-2 py-2 border-t border-[#e6e4df]">
        {bottomItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                isActive ? "bg-[#efefec]" : "hover:bg-[#efefec]"
              }`}
            >
              <item.icon className="w-4 h-4 text-[#9b9a97]" />
              <span className="text-sm text-[#37352f]">{item.label}</span>
            </button>
          );
        })}
      </div>

      <div className="px-3 py-3 border-t border-[#e6e4df] space-y-2">
        {currentWorkspace && (
          <button
            onClick={() => setShowShareModal(true)}
            className="w-full flex items-center gap-2 px-2 py-2 rounded-lg bg-[#f0f0ee] hover:bg-[#e6e4df] text-left transition-colors"
          >
            <Share2 className="w-4 h-4 text-[#9b9a97]" />
            <div className="flex-1">
              <div className="text-xs text-[#37352f] font-medium">Share workspace</div>
              <div className="text-[10px] text-[#9b9a97]">Invite team members</div>
            </div>
          </button>
        )}

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-[#efefec] text-left transition-colors"
        >
          <LogOut className="w-4 h-4 text-[#9b9a97]" />
          <div className="flex-1">
            <div className="text-xs text-[#37352f]">{profile?.full_name || profile?.email || 'User'}</div>
            <div className="text-[10px] text-[#9b9a97]">Sign out</div>
          </div>
        </button>
      </div>

      {showTemplateModal && (
        <TemplateModal
          onClose={() => setShowTemplateModal(false)}
          onCreate={handleTemplateCreate}
        />
      )}

      {showShareModal && currentWorkspace && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          workspaceId={currentWorkspace.id}
        />
      )}
    </aside>
  );
};
