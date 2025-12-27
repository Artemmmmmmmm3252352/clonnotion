import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { 
  ChevronRight, Plus, Star, MoreHorizontal, Home, FileText, Database, Trash2, Search, 
  Copy, Edit2, Sparkles, Inbox, Calendar, Mail, Settings, Store, Users, Video
} from "lucide-react";
import { useWorkspace } from "../../store";
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

  const handleRename = () => {
    if (newTitle.trim()) {
      updatePage(page.id, { title: newTitle.trim() });
    }
    setIsRenaming(false);
    onClose();
  };

  const handleDuplicate = () => {
    const newPage = duplicatePage(page.id);
    if (newPage) {
      navigate(`/page/${newPage.id}`);
    }
    onClose();
  };

  const handleDelete = () => {
    deletePage(page.id);
    navigate("/");
    onClose();
  };

  const handleFavorite = () => {
    toggleFavorite(page.id);
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
        Rename
      </button>
      <button
        onClick={handleDuplicate}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#37352f] hover:bg-[#efefec] text-left"
      >
        <Copy className="w-4 h-4" />
        Duplicate
      </button>
      <button
        onClick={handleFavorite}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#37352f] hover:bg-[#efefec] text-left"
      >
        <Star className={`w-4 h-4 ${page.isFavorite ? "fill-[#f5c518] text-[#f5c518]" : ""}`} />
        {page.isFavorite ? "Remove from favorites" : "Add to favorites"}
      </button>
      <div className="h-px bg-[#e6e4df] my-1" />
      <button
        onClick={handleDelete}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#eb5757] hover:bg-[#efefec] text-left"
      >
        <Trash2 className="w-4 h-4" />
        Delete
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
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(page.id);
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
    { id: 'tasks', name: 'Tasks Tracker', icon: '✅', description: 'Track your tasks and to-dos' },
    { id: 'projects', name: 'Projects', icon: '📊', description: 'Manage your projects' },
    { id: 'notes', name: 'Meeting Notes', icon: '📝', description: 'Keep meeting notes organized' },
    { id: 'docs', name: 'Document Hub', icon: '📚', description: 'Central place for documents' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-[#e6e4df]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[#37352f]">Add new page</h2>
            <button onClick={onClose} className="text-[#9b9a97] hover:text-[#37352f]">✕</button>
          </div>
          <input 
            type="text" 
            placeholder="Search templates..." 
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
              <span className="text-sm font-medium text-[#37352f]">Empty page</span>
            </button>
            <button 
              onClick={() => onCreate('database')}
              className="flex flex-col items-center p-4 border border-[#e6e4df] rounded-lg hover:bg-[#f7f6f3] transition-colors"
            >
              <Database className="w-8 h-8 text-[#9b9a97] mb-2" />
              <span className="text-sm font-medium text-[#37352f]">Empty database</span>
            </button>
            <button 
              onClick={() => onCreate('page')}
              className="flex flex-col items-center p-4 border border-[#e6e4df] rounded-lg hover:bg-[#f7f6f3] transition-colors"
            >
              <Sparkles className="w-8 h-8 text-[#9b9a97] mb-2" />
              <span className="text-sm font-medium text-[#37352f]">Build with AI</span>
            </button>
          </div>

          <div>
            <h3 className="text-xs font-medium text-[#9b9a97] uppercase tracking-wide mb-3">Suggested</h3>
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
  const { workspace, getRootPages, getFavoritePages, getArchivedPages, createPage, setCurrentPageId, createDatabase } = useWorkspace();
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  const rootPages = getRootPages();
  const favoritePages = getFavoritePages();
  const archivedPages = getArchivedPages();

  const handleCreatePage = () => {
    const newPage = createPage("Untitled");
    setCurrentPageId(newPage.id);
    navigate(`/page/${newPage.id}`);
  };

  const handleTemplateCreate = (type: 'page' | 'database' | 'template', templateId?: string) => {
    setShowTemplateModal(false);
    if (type === 'page') {
      const newPage = createPage("Untitled");
      setCurrentPageId(newPage.id);
      navigate(`/page/${newPage.id}`);
    } else if (type === 'database') {
      const newDb = createDatabase("Untitled Database");
      navigate(`/database/${newDb.id}`);
    } else if (type === 'template' && templateId) {
      const newPage = createPage(templateId === 'tasks' ? 'Tasks Tracker' : templateId === 'projects' ? 'Projects' : templateId === 'notes' ? 'Meeting Notes' : 'Document Hub');
      setCurrentPageId(newPage.id);
      navigate(`/page/${newPage.id}`);
    }
  };

  const topNavItems = [
    { id: "search", label: "Search", icon: Search, path: "/search" },
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "meetings", label: "Meetings", icon: Video, path: "/meetings" },
    { id: "ai", label: "NoteZero AI", icon: Sparkles, path: "/ai" },
    { id: "inbox", label: "Inbox", icon: Inbox, path: "/inbox" },
  ];

  const appItems = [
    { id: "mail", label: "NoteZero Mail", icon: Mail, path: "/mail" },
    { id: "calendar", label: "NoteZero Calendar", icon: Calendar, path: "/calendar" },
  ];

  const bottomItems = [
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
    { id: "marketplace", label: "Marketplace", icon: Store, path: "/marketplace" },
    { id: "trash", label: "Trash", icon: Trash2, path: "/trash" },
  ];

  return (
    <aside className="w-60 h-full flex flex-col bg-[#f7f6f3] border-r border-[#e6e4df] overflow-hidden">
      <header className="flex items-center gap-2 px-3 py-3 border-b border-[#e6e4df]">
        <span className="text-lg">📝</span>
        <h1 className="text-sm font-semibold text-[#37352f] flex-1">NoteZero</h1>
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
              Private
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
              <span className="text-sm text-[#9b9a97]">Add new</span>
            </button>
          </div>
        </div>

        <div className="mb-2">
          <div className="px-4 py-1">
            <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
              Shared
            </span>
          </div>
          <div className="px-2">
            <button
              onClick={() => {}}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors hover:bg-[#efefec]"
            >
              <Plus className="w-4 h-4 text-[#9b9a97]" />
              <span className="text-sm text-[#9b9a97]">Start collaborating</span>
            </button>
          </div>
        </div>

        {favoritePages.length > 0 && (
          <div className="mb-2">
            <div className="px-4 py-1">
              <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
                Favorites
              </span>
            </div>
            <div className="px-2">
              {favoritePages.map(page => (
                <PageItem key={page.id} page={page} level={0} />
              ))}
            </div>
          </div>
        )}

        <div className="mb-2">
          <div className="px-4 py-1">
            <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
              NoteZero Apps
            </span>
          </div>
          <div className="px-2">
            {appItems.map((item) => {
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
        </div>

        {workspace.databases.length > 0 && (
          <div className="mb-2">
            <div className="px-4 py-1">
              <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
                Databases
              </span>
            </div>
            <div className="px-2">
              {workspace.databases.map(db => (
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

      <div className="px-3 py-3 border-t border-[#e6e4df]">
        <button
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg bg-[#f0f0ee] hover:bg-[#e6e4df] text-left transition-colors"
        >
          <Users className="w-4 h-4 text-[#9b9a97]" />
          <div className="flex-1">
            <div className="text-xs text-[#9b9a97]">Invite members</div>
            <div className="text-[10px] text-[#9b9a97]">Collaborate with your team</div>
          </div>
        </button>
      </div>

      {showTemplateModal && (
        <TemplateModal 
          onClose={() => setShowTemplateModal(false)} 
          onCreate={handleTemplateCreate}
        />
      )}
    </aside>
  );
};
