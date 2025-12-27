import { useState } from "react";
import { X, Maximize2, Send } from "lucide-react";
import { Database, DatabaseRow, Property } from "../../store/types";

interface Comment {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
}

interface RecordModalProps {
  database: Database;
  row: DatabaseRow;
  onClose: () => void;
}

export const RecordModal = ({ database, row, onClose }: RecordModalProps): JSX.Element => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");

  const getPropertyValue = (prop: Property) => {
    const value = row.properties[prop.id];
    
    if (prop.type === "select" && prop.options) {
      const option = prop.options.find(o => o.id === value || o.name.toLowerCase() === String(value).toLowerCase());
      if (option) {
        return (
          <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${option.color}`}>
            {option.name}
          </span>
        );
      }
    }
    
    if (prop.type === "checkbox") {
      return value ? "✓" : "✗";
    }
    
    return String(value || "—");
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      content: newComment.trim(),
      timestamp: new Date(),
      author: "Вы",
    };
    
    setComments(prev => [...prev, comment]);
    setNewComment("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const title = row.properties.name || row.properties.Name || "Без названия";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-black/30" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e6e4df]">
          <div className="flex items-center gap-2">
            <span className="text-xl">{database.icon || "📊"}</span>
            <span className="text-sm text-[#9b9a97]">{database.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 hover:bg-[#efefec] rounded">
              <Maximize2 className="w-4 h-4 text-[#9b9a97]" />
            </button>
            <button onClick={onClose} className="p-1.5 hover:bg-[#efefec] rounded">
              <X className="w-4 h-4 text-[#9b9a97]" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(80vh-60px)]">
          <h1 className="text-3xl font-bold text-[#37352f] mb-6">{title}</h1>

          <div className="space-y-4">
            {database.properties.filter(p => p.id !== "name").map(prop => (
              <div key={prop.id} className="flex gap-4">
                <div className="w-32 flex-shrink-0 text-sm text-[#9b9a97] py-1">
                  {prop.name}
                </div>
                <div className="flex-1 text-sm text-[#37352f] py-1">
                  {getPropertyValue(prop)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-[#e6e4df]">
            <div className="text-sm text-[#9b9a97] mb-3">Комментарии</div>
            
            {comments.length > 0 && (
              <div className="space-y-3 mb-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2383e2] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                      U
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#37352f]">{comment.author}</span>
                        <span className="text-xs text-[#9b9a97]">{formatTime(comment.timestamp)}</span>
                      </div>
                      <p className="text-sm text-[#37352f]">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2383e2] flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                U
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Добавить комментарий..."
                  className="w-full bg-[#f7f6f3] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#37352f] placeholder-[#9b9a97] focus:outline-none focus:ring-2 focus:ring-[#2383e2]"
                />
                {newComment.trim() && (
                  <button
                    onClick={handleAddComment}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#2383e2] hover:bg-[#e6e4df] rounded"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
