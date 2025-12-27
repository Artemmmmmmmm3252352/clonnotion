import React, { useState, useRef, KeyboardEvent } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import { Block, BlockType } from "../../store/types";
import { useWorkspace } from "../../store";
import { Checkbox } from "../ui/checkbox";

interface BlockEditorProps {
  pageId: string;
  block: Block;
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
  page: "Page",
};

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
    "bulleted_list", "numbered_list", "todo", "quote", "divider"
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

export const BlockEditor = ({ pageId, block, onFocus }: BlockEditorProps) => {
  const { updateBlock, deleteBlock, addBlock } = useWorkspace();
  const [isHovered, setIsHovered] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashFilter, setSlashFilter] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);

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

  const renderBlockContent = () => {
    const baseClass = "outline-none min-h-[1.5em] w-full";
    
    switch (block.type) {
      case "heading1":
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className={`${baseClass} text-3xl font-bold text-[#37352f]`}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            data-placeholder="Heading 1"
          >
            {block.content}
          </div>
        );
      case "heading2":
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className={`${baseClass} text-2xl font-semibold text-[#37352f]`}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            data-placeholder="Heading 2"
          >
            {block.content}
          </div>
        );
      case "heading3":
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className={`${baseClass} text-xl font-medium text-[#37352f]`}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            data-placeholder="Heading 3"
          >
            {block.content}
          </div>
        );
      case "bulleted_list":
        return (
          <div className="flex gap-2">
            <span className="text-[#37352f] mt-0.5">•</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className={`${baseClass} text-[15px] text-[#37352f]`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="List item"
            >
              {block.content}
            </div>
          </div>
        );
      case "numbered_list":
        return (
          <div className="flex gap-2">
            <span className="text-[#37352f] mt-0.5">1.</span>
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className={`${baseClass} text-[15px] text-[#37352f]`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="List item"
            >
              {block.content}
            </div>
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
              className={`${baseClass} text-[15px] ${block.checked ? "line-through text-[#9b9a97]" : "text-[#37352f]"}`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="To-do"
            >
              {block.content}
            </div>
          </div>
        );
      case "quote":
        return (
          <div className="border-l-4 border-[#37352f] pl-4">
            <div
              ref={contentRef}
              contentEditable
              suppressContentEditableWarning
              className={`${baseClass} text-[15px] text-[#37352f] italic`}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              data-placeholder="Quote"
            >
              {block.content}
            </div>
          </div>
        );
      case "divider":
        return <hr className="border-t border-[#e6e4df] my-2" />;
      default:
        return (
          <div
            ref={contentRef}
            contentEditable
            suppressContentEditableWarning
            className={`${baseClass} text-[15px] text-[#37352f]`}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            data-placeholder="Type '/' for commands..."
          >
            {block.content}
          </div>
        );
    }
  };

  return (
    <div
      className="relative group flex items-start gap-1 py-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex items-center gap-0.5 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
        <button
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#efefec]"
          onClick={() => addBlock(pageId, { type: "text", content: "" }, block.id)}
        >
          <Plus className="w-4 h-4 text-[#9b9a97]" />
        </button>
        <button className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#efefec] cursor-grab">
          <GripVertical className="w-4 h-4 text-[#9b9a97]" />
        </button>
      </div>
      
      <div className="flex-1 relative">
        {renderBlockContent()}
        {showSlashMenu && (
          <SlashMenu
            filter={slashFilter}
            onSelect={handleBlockTypeSelect}
            onClose={() => setShowSlashMenu(false)}
          />
        )}
      </div>

      {isHovered && block.type !== "text" && (
        <button
          className="w-6 h-6 flex items-center justify-center rounded hover:bg-[#ffd4d4]"
          onClick={() => deleteBlock(pageId, block.id)}
        >
          <Trash2 className="w-4 h-4 text-[#9b9a97]" />
        </button>
      )}
    </div>
  );
};
