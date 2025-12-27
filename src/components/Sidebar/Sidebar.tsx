import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Star, MoreHorizontal, Home, FileText, Database, Trash2, Search, Copy, Edit2, FolderInput } from "lucide-react";
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

export const Sidebar = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { workspace, getRootPages, getFavoritePages, getArchivedPages, createPage, setCurrentPageId } = useWorkspace();
  
  const rootPages = getRootPages();
  const favoritePages = getFavoritePages();
  const archivedPages = getArchivedPages();

  const handleCreatePage = () => {
    const newPage = createPage("Untitled");
    setCurrentPageId(newPage.id);
    navigate(`/page/${newPage.id}`);
  };

  const navItems = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    { id: "search", label: "Search", icon: Search, path: "/search" },
  ];

  return (
    <aside className="w-60 h-full flex flex-col bg-[#f7f6f3] border-r border-[#e6e4df] overflow-hidden">
      <header className="flex items-center gap-2 px-4 py-4 border-b border-[#e6e4df]">
        <span className="text-xl">📝</span>
        <h1 className="text-sm font-semibold text-[#37352f]">NoteZero</h1>
      </header>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2 mb-4">
          {navItems.map((item) => {
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

        {favoritePages.length > 0 && (
          <div className="mb-4">
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

        <div className="mb-4">
          <div className="px-4 py-1 flex items-center justify-between group">
            <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
              Pages
            </span>
            <button
              onClick={handleCreatePage}
              className="w-5 h-5 flex items-center justify-center rounded hover:bg-[#ddd] opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Plus className="w-3 h-3 text-[#9b9a97]" />
            </button>
          </div>
          <div className="px-2">
            {rootPages.map(page => (
              <PageItem key={page.id} page={page} level={0} />
            ))}
          </div>
        </div>

        <div className="mb-4">
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
                <Database className="w-4 h-4 text-[#9b9a97]" />
                <span className="text-sm text-[#37352f]">{db.name}</span>
              </button>
            ))}
          </div>
        </div>

        {archivedPages.length > 0 && (
          <div>
            <div className="px-4 py-1">
              <span className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">
                Trash
              </span>
            </div>
            <div className="px-2">
              <button
                onClick={() => navigate("/trash")}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                  location.pathname === "/trash" ? "bg-[#efefec]" : "hover:bg-[#efefec]"
                }`}
              >
                <Trash2 className="w-4 h-4 text-[#9b9a97]" />
                <span className="text-sm text-[#37352f]">Trash ({archivedPages.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-2 py-3 border-t border-[#e6e4df]">
        <button
          onClick={handleCreatePage}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-md text-left transition-colors hover:bg-[#efefec]"
        >
          <Plus className="w-4 h-4 text-[#9b9a97]" />
          <span className="text-sm text-[#37352f]">New page</span>
        </button>
      </div>
    </aside>
  );
};
