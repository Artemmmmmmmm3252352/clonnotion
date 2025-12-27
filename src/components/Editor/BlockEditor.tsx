import React, { useState, useRef, useEffect, KeyboardEvent } from "react";
import { GripVertical, Plus, Trash2, Copy, Type, Palette, MoreHorizontal, ChevronRight, Code, AlertCircle, ChevronDown, ImageIcon } from "lucide-react";
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

  const handleDuplicate = () => {
    duplicateBlock(pageId, block.id);
    onClose();
  };

  const handleDelete = () => {
    deleteBlock(pageId, block.id);
    onClose();
  };

  const handleTurnInto = (type: BlockType) => {
    updateBlock(pageId, block.id, { type });
    setShowTurnInto(false);
    onClose();
  };

  const handleColorChange = (colorId: string) => {
    const color = blockColors.find(c => c.id === colorId);
    if (color) {
      updateBlock(pageId, block.id, { color: colorId });
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

export const BlockEditor = ({ pageId, block, index, onFocus }: BlockEditorProps) => {
  const { updateBlock, deleteBlock, addBlock, moveBlock } = useWorkspace();
  const [isHovered, setIsHovered] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (contentRef.current && !isInitialized.current) {
      contentRef.current.innerText = block.content;
      isInitialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== block.content) {
      const isFocused = document.activeElement === contentRef.current;
      if (!isFocused) {
        contentRef.current.innerText = block.content;
      }
    }
  }, [block.content]);

  const handleInput = () => {
    if (contentRef.current) {
      const text = contentRef.current.innerText;
      
      if (text.startsWith("/")) {
        setSlashFilter(text.slice(1));
        setShowSlashMenu(true);
      } else {
        setShowSlashMenu(false);
        setSlashFilter("");
      }
      
      updateBlock(pageId, block.id, { content: text });
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (showSlashMenu) {
        return;
      }
      addBlock(pageId, { type: "text", content: "" }, block.id);
    }
    
    if (e.key === "Backspace" && block.content === "" && block.type !== "text") {
      e.preventDefault();
      updateBlock(pageId, block.id, { type: "text" });
    }
    
    if (e.key === "Escape") {
      setShowSlashMenu(false);
    }
  };

  const handleBlockTypeSelect = (type: BlockType) => {
    const defaults: Partial<Block> = { type, content: "" };
    if (type === "todo") {
      defaults.checked = false;
    }
    updateBlock(pageId, block.id, defaults);
    if (contentRef.current) {
      contentRef.current.innerText = "";
      contentRef.current.focus();
    }
    setShowSlashMenu(false);
    setSlashFilter("");
  };

  const handleCheckboxChange = (checked: boolean) => {
    updateBlock(pageId, block.id, { checked });
  };

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setMenuPosition({ x: rect.left, y: rect.bottom + 4 });
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", JSON.stringify({ blockId: block.id, index }));
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const data = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (data.blockId !== block.id) {
      moveBlock(pageId, data.blockId, index);
    }
  };

  const colorClass = block.color && block.color !== "default" ? blockColors.find(c => c.id === block.color) : null;
  const bgClass = colorClass?.bg || "";
  const textColorClass = colorClass?.text || "text-[#37352f]";

  const renderBlockContent = () => {
    const baseClass = `outline-none min-h-[1.5em] w-full`;
    
    switch (block.type) {
      case "heading1":
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            dir="ltr"
            className={`${baseClass} text-3xl font-bold ${textColorClass}`}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            data-placeholder="Heading 1"
          />
        );
      case "heading2":
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            dir="ltr"
            className={`${baseClass} text-2xl font-semibold ${textColorClass}`}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            data-placeholder="Heading 2"
          />
        );
      case "heading3":
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            dir="ltr"
            className={`${baseClass} text-xl font-medium ${textColorClass}`}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            data-placeholder="Heading 3"
          />
        );
      case "bulleted_list":
        return (
          <div className="flex gap-2">
            <span className={`mt-0.5 ${textColorClass}`}>•</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              dir="ltr"
              className={`${baseClass} text-[15px] ${textColorClass}`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="List item"
            />
          </div>
        );
      case "numbered_list":
        return (
          <div className="flex gap-2">
            <span className={`mt-0.5 ${textColorClass}`}>1.</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              dir="ltr"
              className={`${baseClass} text-[15px] ${textColorClass}`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="List item"
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
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              dir="ltr"
              className={`${baseClass} text-[15px] ${block.checked ? "line-through text-[#9b9a97]" : textColorClass}`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="To-do"
            />
          </div>
        );
      case "quote":
        return (
          <div className="border-l-4 border-[#37352f] pl-4">
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              dir="ltr"
              className={`${baseClass} text-[15px] italic ${textColorClass}`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="Quote"
            />
          </div>
        );
      case "divider":
        return <hr className="border-t border-[#e6e4df] my-2" />;
      case "code":
        return (
          <div className="bg-[#f7f6f3] rounded-lg p-4 font-mono text-sm">
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              dir="ltr"
              className="outline-none min-h-[1.5em] whitespace-pre-wrap text-[#37352f]"
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="// Write your code here..."
            />
          </div>
        );
      case "callout":
        return (
          <div className="flex gap-3 p-4 bg-[#f7f6f3] rounded-lg">
            <span className="text-xl">💡</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              dir="ltr"
              className={`${baseClass} text-[15px] ${textColorClass}`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="Type something..."
            />
          </div>
        );
      case "toggle":
        return (
          <div>
            <div className="flex items-start gap-1">
              <button className="mt-0.5 p-0.5 hover:bg-[#efefec] rounded">
                <ChevronDown className="w-4 h-4 text-[#9b9a97]" />
              </button>
              <div
                ref={contentRef}
                contentEditable
                suppressContentEditableWarning
                dir="ltr"
                className={`${baseClass} text-[15px] font-medium ${textColorClass}`}
                onInput={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                data-placeholder="Toggle"
              />
            </div>
          </div>
        );
      case "image":
        return (
          <div className="relative bg-[#f7f6f3] rounded-lg p-8 flex items-center justify-center border-2 border-dashed border-[#e6e4df]">
            <div className="text-center">
              <ImageIcon className="w-8 h-8 text-[#9b9a97] mx-auto mb-2" />
              <p className="text-sm text-[#9b9a97]">Click to add an image</p>
            </div>
          </div>
        );
      default:
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            dir="ltr"
            className={`${baseClass} text-[15px] ${textColorClass}`}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            data-placeholder="Type '/' for commands..."
          />
        );
    }
  };

  return (
    <div
      ref={blockRef}
      className={`relative group flex items-start gap-1 py-1 rounded ${bgClass} ${isDragging ? "opacity-50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className={`flex items-center gap-0.5 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
        <button
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#efefec]"
          onClick={() => addBlock(pageId, { type: "text", content: "" }, block.id)}
        >
          <Plus className="w-4 h-4 text-[#9b9a97]" />
        </button>
        <button 
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#efefec] cursor-grab active:cursor-grabbing"
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
