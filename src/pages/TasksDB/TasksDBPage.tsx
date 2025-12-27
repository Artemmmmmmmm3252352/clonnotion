import { SearchIcon, Plus, Filter, LayoutGrid, List } from "lucide-react";
import React, { useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";

const tasks = [
  {
    id: 1,
    name: "Research Competitors",
    status: { label: "In Progress", color: "bg-[#dbeafe] text-[#1e40af]" },
    priority: { label: "High", color: "bg-[#ffd4d4] text-[#c41e1e]" },
    dueDate: "Oct 15",
    project: "Q4 Roadmap",
    completed: false,
  },
  {
    id: 2,
    name: "Draft Roadmap Document",
    status: { label: "To Do", color: "bg-[#efefec] text-[#65645f]" },
    priority: { label: "Medium", color: "bg-[#fef3c7] text-[#b45309]" },
    dueDate: "Nov 1",
    project: "Q4 Roadmap",
    completed: false,
  },
  {
    id: 3,
    name: "UI Design Mockups",
    status: { label: "Done", color: "bg-[#d3f5e1] text-[#0d7d3d]" },
    priority: { label: "Low", color: "bg-[#dbeafe] text-[#1e40af]" },
    dueDate: "Sep 30",
    project: "Website Redesign",
    completed: true,
  },
  {
    id: 4,
    name: "User Interview Sessions",
    status: { label: "In Progress", color: "bg-[#dbeafe] text-[#1e40af]" },
    priority: { label: "High", color: "bg-[#ffd4d4] text-[#c41e1e]" },
    dueDate: "Oct 20",
    project: "User Research",
    completed: false,
  },
  {
    id: 5,
    name: "Create Marketing Assets",
    status: { label: "To Do", color: "bg-[#efefec] text-[#65645f]" },
    priority: { label: "Medium", color: "bg-[#fef3c7] text-[#b45309]" },
    dueDate: "Nov 15",
    project: "Marketing Campaign",
    completed: false,
  },
  {
    id: 6,
    name: "API Integration",
    status: { label: "In Progress", color: "bg-[#dbeafe] text-[#1e40af]" },
    priority: { label: "High", color: "bg-[#ffd4d4] text-[#c41e1e]" },
    dueDate: "Oct 25",
    project: "Mobile App",
    completed: false,
  },
  {
    id: 7,
    name: "Database Schema Design",
    status: { label: "Done", color: "bg-[#d3f5e1] text-[#0d7d3d]" },
    priority: { label: "High", color: "bg-[#ffd4d4] text-[#c41e1e]" },
    dueDate: "Oct 1",
    project: "Analytics Dashboard",
    completed: true,
  },
  {
    id: 8,
    name: "Write Documentation",
    status: { label: "To Do", color: "bg-[#efefec] text-[#65645f]" },
    priority: { label: "Low", color: "bg-[#dbeafe] text-[#1e40af]" },
    dueDate: "Nov 30",
    project: "Analytics Dashboard",
    completed: false,
  },
];

export const TasksDBPage = (): JSX.Element => {
  const [viewMode, setViewMode] = useState<"table" | "board">("table");

  return (
    <section className="w-full min-h-screen bg-[#fafaf9] p-12">
      <header className="flex items-center justify-between mb-10 pb-4 border-b border-[#e6e4df]">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97]" />
          <Input
            placeholder="Search tasks..."
            className="pl-9 h-8 text-sm bg-[#efefec] border-transparent rounded-md hover:bg-[#e6e4df] transition-colors text-[#37352f] placeholder:text-[#9b9a97]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 px-3 text-sm bg-transparent border-[#e6e4df] hover:bg-[#efefec] rounded-md"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <div className="flex border border-[#e6e4df] rounded-md overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-none ${viewMode === "table" ? "bg-[#efefec]" : ""}`}
              onClick={() => setViewMode("table")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-8 w-8 rounded-none ${viewMode === "board" ? "bg-[#efefec]" : ""}`}
              onClick={() => setViewMode("board")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
          </div>
          <Button className="h-8 px-3 text-sm bg-[#2383e2] hover:bg-[#1a6bc2] text-white rounded-md">
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </Button>
        </div>
      </header>

      <h1 className="text-4xl text-[#37352f] font-bold mb-8 tracking-tight">
        Tasks Database
      </h1>

      <Card className="bg-white border border-[#e6e4df] shadow-sm rounded-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-6 pb-3 mb-2 border-b border-[#e6e4df]">
            <span className="w-6"></span>
            <span className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide">Task</span>
            <span className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide">Status</span>
            <span className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide">Priority</span>
            <span className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide">Project</span>
            <span className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide">Due Date</span>
          </div>

          {tasks.map((task) => (
            <div
              key={task.id}
              className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_1fr] gap-6 items-center py-3 border-b border-[#f1f0ee] last:border-0 hover:bg-[#fafaf9] transition-colors cursor-pointer"
            >
              <Checkbox 
                checked={task.completed}
                className="w-4 h-4 rounded border border-[#d3d1cb] data-[state=checked]:bg-[#2383e2] data-[state=checked]:border-[#2383e2]" 
              />
              <span className={`text-[15px] ${task.completed ? "line-through text-[#9b9a97]" : "text-[#37352f]"}`}>
                {task.name}
              </span>
              <Badge
                variant="outline"
                className={`${task.status.color} text-xs px-2.5 py-1 rounded-md border-0 w-fit`}
              >
                {task.status.label}
              </Badge>
              <Badge
                variant="outline"
                className={`${task.priority.color} text-xs px-2.5 py-1 rounded-md border-0 w-fit`}
              >
                {task.priority.label}
              </Badge>
              <span className="text-sm text-[#65645f]">{task.project}</span>
              <span className="text-sm text-[#65645f]">{task.dueDate}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
};
