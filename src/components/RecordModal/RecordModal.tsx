import { X, Maximize2 } from "lucide-react";
import { Database, DatabaseRow, Property } from "../../store/types";

interface RecordModalProps {
  database: Database;
  row: DatabaseRow;
  onClose: () => void;
}

export const RecordModal = ({ database, row, onClose }: RecordModalProps): JSX.Element => {
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

  const title = row.properties.name || row.properties.Name || "Untitled";

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
            <div className="text-sm text-[#9b9a97] mb-2">Comments</div>
            <div className="bg-[#f7f6f3] rounded-lg p-4 text-sm text-[#9b9a97]">
              Add a comment...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
