import React, { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { GripVertical, Plus, Trash2, Copy, Type, Palette, ChevronRight, ChevronDown, ImageIcon } from "lucide-react";
import { Block, BlockType } from "../../store/types";
import { useWorkspace } from "../../store";
import { Checkbox } from "../ui/checkbox";

interface BlockEditorProps {
  pageId: string;
  block: Block;
  index: number;
  onFocus?: () => void;
}

const blockTypeLabels: Record<BlockType, string> = {
  text: "Text",
  heading1: "Heading 1",
  heading2: "Heading 2",
  heading3: "Heading 3",
  bulleted_list: "Bulleted list",
  numbered_list: "Numbered list",
  todo: "To-do",
  quote: "Quote",
  divider: "Divider",
  code: "Code",
  callout: "Callout",
  toggle: "Toggle",
  image: "Image",
  page: "Page",
};

const blockColors = [
  { id: "default", label: "Default", bg: "", text: "" },
  { id: "gray", label: "Gray", bg: "bg-[#f1f1ef]", text: "text-[#787774]" },
  { id: "brown", label: "Brown", bg: "bg-[#f4eeee]", text: "text-[#9f6b53]" },
  { id: "orange", label: "Orange", bg: "bg-[#fbecdd]", text: "text-[#d9730d]" },
  { id: "yellow", label: "Yellow", bg: "bg-[#fbf3db]", text: "text-[#cb912f]" },
  { id: "green", label: "Green", bg: "bg-[#edf3ec]", text: "text-[#448361]" },
  { id: "blue", label: "Blue", bg: "bg-[#e7f3f8]", text: "text-[#337ea9]" },
  { id: "purple", label: "Purple", bg: "bg-[#f6f3f9]", text: "text-[#9065b0]" },
  { id: "pink", label: "Pink", bg: "bg-[#faf1f5]", text: "text-[#c14c8a]" },
  { id: "red", label: "Red", bg: "bg-[#fdebec]", text: "text-[#d44c47]" },
];

const SlashMenu = ({ 
  onSelect, 
  filter,
  onClose 
}: { 
  onSelect: (type: BlockType) => void;
  filter: string;
  onClose: () => void;
}) => {
  const types: BlockType[] = [
    "text", "heading1", "heading2", "heading3",
    "bulleted_list", "numbered_list", "todo", "quote", "divider",
    "code", "callout", "toggle"
  ];

  const filteredTypes = types.filter(type => 
    blockTypeLabels[type].toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="absolute left-0 top-full mt-1 w-64 bg-white border border-[#e6e4df] rounded-lg shadow-lg z-50 py-2">
      <div className="px-3 py-1 text-xs text-[#9b9a97] font-medium uppercase">
        Basic blocks
      </div>
      {filteredTypes.map(type => (
        <button
          key={type}
          className="w-full px-3 py-2 text-left text-sm text-[#37352f] hover:bg-[#efefec] flex items-center gap-2"
          onClick={() => {
            onSelect(type);
            onClose();
          }}
        >
          {blockTypeLabels[type]}
        </button>
      ))}
      {filteredTypes.length === 0 && (
        <div className="px-3 py-2 text-sm text-[#9b9a97]">No results</div>
      )}
    </div>
  );
};

interface BlockMenuProps {
  pageId: string;
  block: Block;
  onClose: () => void;
  position: { x: number; y: number };
}

const BlockMenu = ({ pageId, block, onClose, position }: BlockMenuProps) => {
  const { deleteBlock, duplicateBlock, updateBlock } = useWorkspace();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showTurnInto, setShowTurnInto] = useState(false);
  const [showColors, setShowColors] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleDuplicate = async () => {
    await duplicateBlock(pageId, block.id);
    onClose();
  };

  const handleDelete = async () => {
    await deleteBlock(pageId, block.id);
    onClose();
  };

  const handleTurnInto = async (type: BlockType) => {
    await updateBlock(pageId, block.id, { type });
    setShowTurnInto(false);
    onClose();
  };

  const handleColorChange = async (colorId: string) => {
    const color = blockColors.find(c => c.id === colorId);
    if (color) {
      await updateBlock(pageId, block.id, { color: colorId });
    }
    setShowColors(false);
    onClose();
  };

  const types: BlockType[] = [
    "text", "heading1", "heading2", "heading3",
    "bulleted_list", "numbered_list", "todo", "quote", "divider",
    "code", "callout", "toggle"
  ];

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-[#e6e4df] py-1 min-w-[200px]"
      style={{ left: position.x, top: position.y }}
    >
      <button
        onClick={handleDuplicate}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-[#37352f] hover:bg-[#efefec] text-left"
      >
        <Copy className="w-4 h-4" />
        Duplicate
      </button>
      
      <div className="relative">
        <button
          onMouseEnter={() => { setShowTurnInto(true); setShowColors(false); }}
          className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-[#37352f] hover:bg-[#efefec] text-left"
        >
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            Turn into
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {showTurnInto && (
          <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-lg border border-[#e6e4df] py-1 min-w-[160px]">
            {types.map(type => (
              <button
                key={type}
                onClick={() => handleTurnInto(type)}
                className={`w-full px-3 py-1.5 text-sm text-left hover:bg-[#efefec] ${
                  block.type === type ? "bg-[#efefec] text-[#2383e2]" : "text-[#37352f]"
                }`}
              >
                {blockTypeLabels[type]}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="relative">
        <button
          onMouseEnter={() => { setShowColors(true); setShowTurnInto(false); }}
          className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-[#37352f] hover:bg-[#efefec] text-left"
        >
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Color
          </div>
          <ChevronRight className="w-4 h-4" />
        </button>
        
        {showColors && (
          <div className="absolute left-full top-0 ml-1 bg-white rounded-lg shadow-lg border border-[#e6e4df] py-1 min-w-[140px]">
            {blockColors.map(color => (
              <button
                key={color.id}
                onClick={() => handleColorChange(color.id)}
                className={`w-full px-3 py-1.5 text-sm text-left hover:bg-[#efefec] flex items-center gap-2 ${
                  block.color === color.id ? "bg-[#efefec]" : ""
                }`}
              >
                <div className={`w-4 h-4 rounded ${color.bg || "border border-[#e6e4df]"}`} />
                <span className={color.text || "text-[#37352f]"}>{color.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      
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

interface ContentEditableBlockProps {
  content: string;
  placeholder: string;
  className: string;
  onContentChange: (content: string) => void;
  onKeyDown: (e: KeyboardEvent<HTMLDivElement>) => void;
  onFocus?: () => void;
  onSlashCommand: (filter: string) => void;
  onSlashClose: () => void;
}

const ContentEditableBlock = React.memo(({ 
  content, 
  placeholder, 
  className, 
  onContentChange, 
  onKeyDown,
  onFocus,
  onSlashCommand,
  onSlashClose
}: ContentEditableBlockProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const initialContentRef = useRef(content);
  const isComposing = useRef(false);

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = initialContentRef.current;
    }
  }, []);

  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      if (ref.current.textContent !== content) {
        ref.current.textContent = content;
      }
    }
  }, [content]);

  const handleInput = useCallback(() => {
    if (ref.current && !isComposing.current) {
      const text = ref.current.textContent || '';
      
      if (text.startsWith('/')) {
        onSlashCommand(text.slice(1));
      } else {
        onSlashClose();
      }
      
      onContentChange(text);
    }
  }, [onContentChange, onSlashCommand, onSlashClose]);

  const handleCompositionStart = useCallback(() => {
    isComposing.current = true;
  }, []);

  const handleCompositionEnd = useCallback(() => {
    isComposing.current = false;
    handleInput();
  }, [handleInput]);

  return (
    <div
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      className={`${className} block-editable`}
      style={{ 
        direction: 'ltr',
        unicodeBidi: 'plaintext',
        textAlign: 'left'
      }}
      onInput={handleInput}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      data-placeholder={placeholder}
    />
  );
});

ContentEditableBlock.displayName = 'ContentEditableBlock';

export const BlockEditor = ({ pageId, block, index, onFocus }: BlockEditorProps) => {
  const { updateBlock, addBlock, moveBlock } = useWorkspace();
  const [isHovered, setIsHovered] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const blockRef = useRef<HTMLDivElement>(null);

  const handleContentChange = useCallback(async (content: string) => {
    await updateBlock(pageId, block.id, { content });
  }, [pageId, block.id, updateBlock]);

  const handleSlashCommand = useCallback((filter: string) => {
    setSlashFilter(filter);
    setShowSlashMenu(true);
  }, []);

  const handleSlashClose = useCallback(() => {
    setShowSlashMenu(false);
    setSlashFilter("");
  }, []);

  const handleKeyDown = useCallback(async (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showSlashMenu) {
        return;
      }
      await addBlock(pageId, { type: "text", content: "" }, block.id);
    }

    if (e.key === "Backspace" && block.content === "" && block.type !== "text") {
      e.preventDefault();
      await updateBlock(pageId, block.id, { type: "text" });
    }

    if (e.key === "Escape") {
      setShowSlashMenu(false);
    }
  }, [showSlashMenu, addBlock, pageId, block.id, block.content, block.type, updateBlock]);

  const handleBlockTypeSelect = useCallback(async (type: BlockType) => {
    const defaults: Partial<Block> = { type, content: "" };
    if (type === "todo") {
      defaults.checked = false;
    }
    await updateBlock(pageId, block.id, defaults);
    setShowSlashMenu(false);
    setSlashFilter("");
  }, [pageId, block.id, updateBlock]);

  const handleCheckboxChange = useCallback(async (checked: boolean) => {
    await updateBlock(pageId, block.id, { checked });
  }, [pageId, block.id, updateBlock]);

  const handleMenuClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom + 4 });
  }, []);

  const handleDragStart = useCallback((e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", JSON.stringify({ blockId: block.id, index }));
    e.dataTransfer.effectAllowed = "move";
  }, [block.id, index]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (data.blockId !== block.id) {
      moveBlock(pageId, data.blockId, index);
    }
  }, [block.id, moveBlock, pageId, index]);

  const colorClass = block.color && block.color !== "default" ? blockColors.find(c => c.id === block.color) : null;
  const bgClass = colorClass?.bg || "";
  const textColorClass = colorClass?.text || "text-[#37352f]";

  const baseClass = `outline-none min-h-[1.5em] w-full`;

  const renderBlockContent = () => {
    switch (block.type) {
      case "heading1":
        return (
          <ContentEditableBlock
            key={block.id}
            content={block.content}
            placeholder="Heading 1"
            className={`${baseClass} text-3xl font-bold ${textColorClass}`}
            onContentChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onSlashCommand={handleSlashCommand}
            onSlashClose={handleSlashClose}
          />
        );
      case "heading2":
        return (
          <ContentEditableBlock
            key={block.id}
            content={block.content}
            placeholder="Heading 2"
            className={`${baseClass} text-2xl font-semibold ${textColorClass}`}
            onContentChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onSlashCommand={handleSlashCommand}
            onSlashClose={handleSlashClose}
          />
        );
      case "heading3":
        return (
          <ContentEditableBlock
            key={block.id}
            content={block.content}
            placeholder="Heading 3"
            className={`${baseClass} text-xl font-medium ${textColorClass}`}
            onContentChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onSlashCommand={handleSlashCommand}
            onSlashClose={handleSlashClose}
          />
        );
      case "bulleted_list":
        return (
          <div className="flex gap-2">
            <span className={`mt-0.5 ${textColorClass}`}>•</span>
            <ContentEditableBlock
              key={block.id}
              content={block.content}
              placeholder="List item"
              className={`${baseClass} text-[15px] ${textColorClass}`}
              onContentChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onSlashCommand={handleSlashCommand}
              onSlashClose={handleSlashClose}
            />
          </div>
        );
      case "numbered_list":
        return (
          <div className="flex gap-2">
            <span className={`mt-0.5 ${textColorClass}`}>1.</span>
            <ContentEditableBlock
              key={block.id}
              content={block.content}
              placeholder="List item"
              className={`${baseClass} text-[15px] ${textColorClass}`}
              onContentChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onSlashCommand={handleSlashCommand}
              onSlashClose={handleSlashClose}
            />
          </div>
        );
      case "todo":
        return (
          <div className="flex gap-2 items-start">
            <Checkbox
              checked={block.checked}
              onCheckedChange={handleCheckboxChange}
              className="mt-1 w-4 h-4 rounded border-2 border-[#d3d1cb] data-[state=checked]:bg-[#2383e2] data-[state=checked]:border-[#2383e2]"
            />
            <ContentEditableBlock
              key={block.id}
              content={block.content}
              placeholder="To-do"
              className={`${baseClass} text-[15px] ${block.checked ? "line-through text-[#9b9a97]" : textColorClass}`}
              onContentChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onSlashCommand={handleSlashCommand}
              onSlashClose={handleSlashClose}
            />
          </div>
        );
      case "quote":
        return (
          <div className="border-l-4 border-[#37352f] pl-4">
            <ContentEditableBlock
              key={block.id}
              content={block.content}
              placeholder="Quote"
              className={`${baseClass} text-[15px] italic ${textColorClass}`}
              onContentChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onSlashCommand={handleSlashCommand}
              onSlashClose={handleSlashClose}
            />
          </div>
        );
      case "divider":
        return <hr className="border-t border-[#e6e4df] my-2" />;
      case "code":
        return (
          <div className="bg-[#f7f6f3] rounded-lg p-4 font-mono text-sm">
            <ContentEditableBlock
              key={block.id}
              content={block.content}
              placeholder="// Write your code here..."
              className="outline-none min-h-[1.5em] whitespace-pre-wrap text-[#37352f]"
              onContentChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onSlashCommand={handleSlashCommand}
              onSlashClose={handleSlashClose}
            />
          </div>
        );
      case "callout":
        return (
          <div className="flex gap-3 p-4 bg-[#f7f6f3] rounded-lg">
            <span className="text-xl">💡</span>
            <ContentEditableBlock
              key={block.id}
              content={block.content}
              placeholder="Type something..."
              className={`${baseClass} text-[15px] ${textColorClass}`}
              onContentChange={handleContentChange}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onSlashCommand={handleSlashCommand}
              onSlashClose={handleSlashClose}
            />
          </div>
        );
      case "toggle":
        return (
          <div>
            <div className="flex items-start gap-1">
              <button className="mt-0.5 p-0.5 hover:bg-[#efefec] rounded transition-colors">
                <ChevronDown className="w-4 h-4 text-[#9b9a97]" />
              </button>
              <ContentEditableBlock
                key={block.id}
                content={block.content}
                placeholder="Toggle"
                className={`${baseClass} text-[15px] font-medium ${textColorClass}`}
                onContentChange={handleContentChange}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                onSlashCommand={handleSlashCommand}
                onSlashClose={handleSlashClose}
              />
            </div>
          </div>
        );
      case "image":
        return (
          <div className="relative bg-[#f7f6f3] rounded-lg p-8 flex items-center justify-center border-2 border-dashed border-[#e6e4df] hover:border-[#d3d1cb] transition-colors">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-[#9b9a97] mx-auto mb-2" />
              <p className="text-sm text-[#9b9a97]">Click to add an image</p>
            </div>
          </div>
        );
      default:
        return (
          <ContentEditableBlock
            key={block.id}
            content={block.content}
            placeholder="Type '/' for commands..."
            className={`${baseClass} text-[15px] ${textColorClass}`}
            onContentChange={handleContentChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onSlashCommand={handleSlashCommand}
            onSlashClose={handleSlashClose}
          />
        );
    }
  };

  return (
    <div
      ref={blockRef}
      className={`relative group flex items-start gap-1 py-1.5 rounded transition-all duration-150 ${bgClass} ${isDragging ? "opacity-50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`flex items-center gap-0.5 transition-opacity duration-150 ${isHovered ? "opacity-100" : "opacity-0"}`}>
        <button
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#efefec] transition-colors"
          onClick={async () => await addBlock(pageId, { type: "text", content: "" }, block.id)}
        >
          <Plus className="w-4 h-4 text-[#9b9a97]" />
        </button>
        <button 
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#efefec] cursor-grab active:cursor-grabbing transition-colors"
          draggable
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onClick={handleMenuClick}
        >
          <GripVertical className="w-4 h-4 text-[#9b9a97]" />
        </button>
      </div>
      
      <div className="flex-1 relative px-1">
        {renderBlockContent()}
        {showSlashMenu && (
          <SlashMenu
            filter={slashFilter}
            onSelect={handleBlockTypeSelect}
            onClose={() => setShowSlashMenu(false)}
          />
        )}
      </div>

      {menuPosition && (
        <BlockMenu
          pageId={pageId}
          block={block}
          position={menuPosition}
          onClose={() => setMenuPosition(null)}
        />
      )}
    </div>
  );
};
