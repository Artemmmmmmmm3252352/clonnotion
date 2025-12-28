import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, Columns, Calendar, List, Plus, Filter, ArrowUpDown, ChevronDown, X } from "lucide-react";
import { useWorkspace } from "../../store";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { RecordModal } from "../../components/RecordModal";
import { DatabaseRow } from "../../store/types";

type ViewType = "table" | "board" | "calendar" | "list";

interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

const viewIcons = {
  table: Table,
  board: Columns,
  calendar: Calendar,
  list: List,
};

const viewLabels: Record<ViewType, string> = {
  table: "Таблица",
  board: "Доска",
  calendar: "Календарь",
  list: "Список",
};

export const DatabasePage = (): JSX.Element => {
  const { databaseId } = useParams<{ databaseId: string }>();
  const navigate = useNavigate();

  const database = null;
  const [currentView, setCurrentView] = useState<ViewType>("table");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filters, setFilters] = useState<FilterCondition[]>([]);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DatabaseRow | null>(null);

  if (!database) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl text-[#37352f] mb-2">База данных не найдена</h2>
          <Button onClick={() => navigate("/")}>На главную</Button>
        </div>
      </div>
    );
  }

  let filteredRows = [...database.rows];
  
  filters.forEach(filter => {
    filteredRows = filteredRows.filter(row => {
      const value = String(row.properties[filter.field] || "").toLowerCase();
      const filterValue = filter.value.toLowerCase();
      
      switch (filter.operator) {
        case "contains":
          return value.includes(filterValue);
        case "equals":
          return value === filterValue;
        case "not_equals":
          return value !== filterValue;
        default:
          return true;
      }
    });
  });

  if (sortField) {
    filteredRows.sort((a, b) => {
      const aVal = String(a.properties[sortField] || "");
      const bVal = String(b.properties[sortField] || "");
      return sortDirection === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });
  }

  const getStatusProperty = () => {
    return database.properties.find(p => p.type === "select" && p.name.toLowerCase().includes("status"));
  };

  const getDateProperty = () => {
    return database.properties.find(p => p.type === "date");
  };

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-[#e6e4df]">
            {database.properties.map(prop => (
              <th
                key={prop.id}
                className="text-left px-3 py-2 text-sm font-medium text-[#9b9a97] cursor-pointer hover:bg-[#f7f6f3]"
                onClick={() => {
                  if (sortField === prop.id) {
                    setSortDirection(d => d === "asc" ? "desc" : "asc");
                  } else {
                    setSortField(prop.id);
                    setSortDirection("asc");
                  }
                }}
              >
                <div className="flex items-center gap-1">
                  {prop.name}
                  {sortField === prop.id && (
                    <ArrowUpDown className="w-3 h-3" />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRows.map(row => (
            <tr 
              key={row.id} 
              className="border-b border-[#e6e4df] hover:bg-[#f7f6f3] cursor-pointer"
              onClick={() => setSelectedRow(row)}
            >
              {database.properties.map(prop => {
                const value = row.properties[prop.id];
                
                if (prop.type === "select" && prop.options) {
                  const option = prop.options.find(o => o.id === value || o.name.toLowerCase() === String(value).toLowerCase());
                  return (
                    <td key={prop.id} className="px-3 py-2">
                      {option && (
                        <span className={`px-2 py-1 rounded text-xs font-medium ${option.color}`}>
                          {option.name}
                        </span>
                      )}
                    </td>
                  );
                }
                
                return (
                  <td key={prop.id} className="px-3 py-2 text-sm text-[#37352f]">
                    {String(value || "")}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderBoardView = () => {
    const statusProp = getStatusProperty();
    if (!statusProp || !statusProp.options) {
      return <div className="p-4 text-[#9b9a97]">Поле статуса не найдено для представления «Доска»</div>;
    }

    const columns = statusProp.options.map(option => ({
      ...option,
      rows: filteredRows.filter(row => {
        const val = row.properties[statusProp.id];
        return val === option.id || String(val).toLowerCase() === option.name.toLowerCase();
      }),
    }));

    return (
      <div className="flex gap-4 overflow-x-auto p-4">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-72 bg-[#f7f6f3] rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <span className={`px-2 py-1 rounded text-xs font-medium ${column.color}`}>
                {column.name}
              </span>
              <span className="text-xs text-[#9b9a97]">{column.rows.length}</span>
            </div>
            <div className="space-y-2">
              {column.rows.map(row => (
                <div 
                  key={row.id} 
                  className="bg-white rounded-lg p-3 shadow-sm border border-[#e6e4df] cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedRow(row)}
                >
                  <div className="text-sm text-[#37352f] font-medium">
                    {row.properties.name || row.properties.Name || "Без названия"}
                  </div>
                  {database.properties.filter(p => p.id !== statusProp.id && p.id !== "name").slice(0, 2).map(prop => {
                    const val = row.properties[prop.id];
                    if (!val) return null;
                    
                    if (prop.type === "select" && prop.options) {
                      const opt = prop.options.find(o => o.id === val || o.name.toLowerCase() === String(val).toLowerCase());
                      if (opt) {
                        return (
                          <span key={prop.id} className={`inline-block mt-2 px-2 py-0.5 rounded text-xs ${opt.color}`}>
                            {opt.name}
                          </span>
                        );
                      }
                    }
                    
                    return (
                      <div key={prop.id} className="text-xs text-[#9b9a97] mt-1">
                        {String(val)}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderCalendarView = () => {
    const dateProp = getDateProperty();
    if (!dateProp) {
      return <div className="p-4 text-[#9b9a97]">Поле даты не найдено для представления «Календарь»</div>;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const emptyDays = Array.from({ length: firstDay }, (_, i) => i);
    
    const getRowsForDay = (day: number) => {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      return filteredRows.filter(row => {
        const rowDate = row.properties[dateProp.id];
        return rowDate && String(rowDate).startsWith(dateStr.slice(0, 10));
      });
    };

    return (
      <div className="p-4">
        <div className="text-lg font-medium text-[#37352f] mb-4">
          {new Date(year, month).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
        </div>
        <div className="grid grid-cols-7 gap-px bg-[#e6e4df]">
          {["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map(day => (
            <div key={day} className="bg-[#f7f6f3] p-2 text-xs text-[#9b9a97] font-medium text-center">
              {day}
            </div>
          ))}
          {emptyDays.map(i => (
            <div key={`empty-${i}`} className="bg-white p-2 min-h-[100px]" />
          ))}
          {days.map(day => {
            const dayRows = getRowsForDay(day);
            return (
              <div key={day} className="bg-white p-2 min-h-[100px]">
                <div className={`text-sm mb-1 ${day === today.getDate() ? "bg-[#2383e2] text-white w-6 h-6 rounded-full flex items-center justify-center" : "text-[#37352f]"}`}>
                  {day}
                </div>
                {dayRows.slice(0, 3).map(row => (
                  <div 
                    key={row.id} 
                    className="text-xs text-[#37352f] truncate bg-[#f7f6f3] rounded px-1 py-0.5 mb-1 cursor-pointer hover:bg-[#e6e4df]"
                    onClick={() => setSelectedRow(row)}
                  >
                    {row.properties.name || row.properties.Name || "Без названия"}
                  </div>
                ))}
                {dayRows.length > 3 && (
                  <div className="text-xs text-[#9b9a97]">+{dayRows.length - 3} ещё</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderListView = () => (
    <div className="p-4 space-y-2">
      {filteredRows.map(row => (
        <div 
          key={row.id} 
          className="flex items-center gap-4 p-3 bg-white border border-[#e6e4df] rounded-lg hover:bg-[#f7f6f3] cursor-pointer"
          onClick={() => setSelectedRow(row)}
        >
          <div className="flex-1 text-sm text-[#37352f] font-medium">
            {row.properties.name || row.properties.Name || "Без названия"}
          </div>
          {database.properties.filter(p => p.id !== "name").slice(0, 3).map(prop => {
            const val = row.properties[prop.id];
            if (!val) return null;
            
            if (prop.type === "select" && prop.options) {
              const opt = prop.options.find(o => o.id === val || o.name.toLowerCase() === String(val).toLowerCase());
              if (opt) {
                return (
                  <span key={prop.id} className={`px-2 py-1 rounded text-xs ${opt.color}`}>
                    {opt.name}
                  </span>
                );
              }
            }
            
            return (
              <span key={prop.id} className="text-xs text-[#9b9a97]">
                {String(val)}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );

  const ViewIcon = viewIcons[currentView];

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="px-6 py-4 border-b border-[#e6e4df]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{database.icon || "📊"}</span>
            <h1 className="text-2xl font-bold text-[#37352f]">{database.name}</h1>
          </div>
          <Button className="bg-[#2383e2] hover:bg-[#1a6bc7] text-white">
            <Plus className="w-4 h-4 mr-1" />
            Создать
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowViewMenu(!showViewMenu)}
              className="text-[#37352f]"
            >
              <ViewIcon className="w-4 h-4 mr-1" />
              {viewLabels[currentView]}
              <ChevronDown className="w-3 h-3 ml-1" />
            </Button>
            
            {showViewMenu && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-[#e6e4df] rounded-lg shadow-lg py-1 z-50 min-w-[120px]">
                {(["table", "board", "calendar", "list"] as ViewType[]).map(view => {
                  const Icon = viewIcons[view];
                  return (
                    <button
                      key={view}
                      onClick={() => { setCurrentView(view); setShowViewMenu(false); }}
                      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-[#efefec] ${currentView === view ? "bg-[#efefec]" : ""}`}
                    >
                      <Icon className="w-4 h-4" />
                      {viewLabels[view]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="text-[#9b9a97]"
            >
              <Filter className="w-4 h-4 mr-1" />
              Фильтр
              {filters.length > 0 && (
                <span className="ml-1 bg-[#2383e2] text-white text-xs px-1.5 rounded">
                  {filters.length}
                </span>
              )}
            </Button>
            
            {showFilterMenu && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-[#e6e4df] rounded-lg shadow-lg p-3 z-50 min-w-[300px]">
                {filters.map((filter, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-2">
                    <select
                      value={filter.field}
                      onChange={(e) => {
                        const newFilters = [...filters];
                        newFilters[idx].field = e.target.value;
                        setFilters(newFilters);
                      }}
                      className="text-sm border border-[#e6e4df] rounded px-2 py-1"
                    >
                      {database.properties.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <select
                      value={filter.operator}
                      onChange={(e) => {
                        const newFilters = [...filters];
                        newFilters[idx].operator = e.target.value;
                        setFilters(newFilters);
                      }}
                      className="text-sm border border-[#e6e4df] rounded px-2 py-1"
                    >
                      <option value="contains">содержит</option>
                      <option value="equals">равно</option>
                      <option value="not_equals">не равно</option>
                    </select>
                    <Input
                      value={filter.value}
                      onChange={(e) => {
                        const newFilters = [...filters];
                        newFilters[idx].value = e.target.value;
                        setFilters(newFilters);
                      }}
                      className="text-sm h-8"
                      placeholder="Значение"
                    />
                    <button
                      onClick={() => setFilters(filters.filter((_, i) => i !== idx))}
                      className="p-1 hover:bg-[#efefec] rounded"
                    >
                      <X className="w-4 h-4 text-[#9b9a97]" />
                    </button>
                  </div>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters([...filters, { field: database.properties[0]?.id || "", operator: "contains", value: "" }])}
                  className="text-[#2383e2]"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Добавить фильтр
                </Button>
              </div>
            )}
          </div>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="text-[#9b9a97]"
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              Сортировка
              {sortField && <span className="ml-1 text-[#2383e2]">1</span>}
            </Button>
            
            {showSortMenu && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-[#e6e4df] rounded-lg shadow-lg py-1 z-50 min-w-[160px]">
                <button
                  onClick={() => { setSortField(null); setShowSortMenu(false); }}
                  className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#efefec] ${!sortField ? "bg-[#efefec]" : ""}`}
                >
                  Нет
                </button>
                {database.properties.map(prop => (
                  <button
                    key={prop.id}
                    onClick={() => { setSortField(prop.id); setShowSortMenu(false); }}
                    className={`w-full text-left px-3 py-1.5 text-sm hover:bg-[#efefec] ${sortField === prop.id ? "bg-[#efefec]" : ""}`}
                  >
                    {prop.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {currentView === "table" && renderTableView()}
        {currentView === "board" && renderBoardView()}
        {currentView === "calendar" && renderCalendarView()}
        {currentView === "list" && renderListView()}
      </main>

      {selectedRow && (
        <RecordModal
          database={database}
          row={selectedRow}
          onClose={() => setSelectedRow(null)}
        />
      )}
    </div>
  );
};
