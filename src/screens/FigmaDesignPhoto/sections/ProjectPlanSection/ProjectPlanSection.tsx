import { SearchIcon } from "lucide-react";
import React from "react";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Checkbox } from "../../../../components/ui/checkbox";
import { Input } from "../../../../components/ui/input";

const sidebarCards = [
  {
    title: "Q4 Roadmap",
    description: "Key milestones and strategy for the upcoming quarter...",
    tags: [
      { label: "Strategy", color: "bg-[#e9d7fe] text-[#6b21a8]" },
      { label: "Planning", color: "bg-[#ffd4d4] text-[#c41e1e]" },
    ],
  },
  {
    title: "User Research Insights",
    description: "Feedback from recent user interviews...",
    tags: [
      { label: "Research", color: "bg-[#dbeafe] text-[#1e40af]" },
      { label: "UX", color: "bg-[#d3f5e1] text-[#0d7d3d]" },
    ],
  },
  {
    title: "Marketing Campaign",
    description: "Content plan and launch schedule for notting...",
    tags: [{ label: "Marketing", color: "bg-[#fed7aa] text-[#c2410c]" }],
  },
];

const projectTags = [
  { label: "Planning", color: "bg-[#dbeafe] text-[#1e40af]" },
  { label: "Strategy", color: "bg-[#e9d7fe] text-[#6b21a8]" },
  { label: "Team", color: "bg-[#d3f5e1] text-[#0d7d3d]" },
];

const tasks = [
  {
    name: "Research Competitors",
    status: { label: "In Progress", color: "bg-[#dbeafe] text-[#1e40af]" },
    priority: { label: "High", color: "bg-[#ffd4d4] text-[#c41e1e]" },
    dueDate: "Oct 15",
  },
  {
    name: "Draft Roadmap",
    status: { label: "To Do", color: "bg-[#efefec] text-[#65645f]" },
    priority: { label: "Medium", color: "bg-[#fef3c7] text-[#b45309]" },
    dueDate: "Nov 1",
  },
  {
    name: "UI Design",
    status: { label: "Done", color: "bg-[#d3f5e1] text-[#0d7d3d]" },
    priority: { label: "Low", color: "bg-[#dbeafe] text-[#1e40af]" },
    dueDate: "Sep 30",
  },
];

const checklistItems = [
  "Finalize requirements",
  "Design mockups",
  "Develop MVP",
];

export const ProjectPlanSection = (): JSX.Element => {
  return (
    <section className="w-full h-screen bg-[#fafaf9] p-12">
      {/* Header */}
      <header className="flex items-center justify-between mb-10 pb-4 border-b border-[#e6e4df]">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97]" />
          <Input
            placeholder="Search workspace..."
            className="pl-9 h-8 text-sm bg-[#efefec] border-transparent rounded-md hover:bg-[#e6e4df] transition-colors text-[#37352f] placeholder:text-[#9b9a97]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-8 px-3 text-sm bg-transparent text-[#37352f] border-transparent hover:bg-[#efefec] rounded-md"
          >
            New page
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-[#efefec] rounded-md">
            <img
              src="/image-1.png"
              alt="Settings"
              className="w-5 h-5 object-contain opacity-60"
            />
          </Button>
          <Button variant="ghost" size="icon" className="w-8 h-8 hover:bg-[#efefec] rounded-md">
            <img
              src="/image.png"
              alt="User"
              className="w-7 h-7 rounded-full object-cover"
            />
          </Button>
        </div>
      </header>

      <div className="flex gap-8">
        {/* Left Sidebar - Project Cards */}
        <aside className="w-72 flex flex-col gap-3">
          {sidebarCards.map((card, index) => (
            <Card
              key={index}
              className="bg-white border border-[#e6e4df] shadow-sm hover:shadow-md transition-all rounded-xl cursor-pointer"
            >
              <CardContent className="p-5">
                <h3 className="text-sm text-[#37352f] mb-2 font-medium">
                  {card.title}
                </h3>
                <p className="text-xs text-[#65645f] mb-4 leading-relaxed">
                  {card.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {card.tags.map((tag, tagIndex) => (
                    <Badge
                      key={tagIndex}
                      variant="outline"
                      className={`${tag.color} text-[11px] px-2.5 py-0.5 rounded-md border-0`}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col gap-6">
          {/* Title Section */}
          <div>
            <h1 className="text-4xl text-[#37352f] font-bold mb-5 tracking-tight">
              Q4 Project Plan
            </h1>
            <div className="flex gap-2">
              {projectTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${tag.color} text-xs px-3 py-1 rounded-md border-0`}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>

          {/* Description and Checklist Row */}
          <div className="flex gap-5">
            {/* Description Card */}
            <Card className="flex-1 bg-white border border-[#e6e4df] shadow-sm rounded-xl">
              <CardContent className="p-8">
                <p className="text-[15px] text-[#37352f] leading-relaxed mb-4">
                  This project goals is key milestones and strategy for the
                  upcoming expectation brands, cummtors, and strategl-salis for
                  your project.
                </p>
                <p className="text-[15px] text-[#65645f] leading-relaxed">
                  This database levelops wear project projects and meet canas
                  on selection, recycling campaign and launchcoated project
                  ennnions.
                </p>
              </CardContent>
            </Card>

            {/* Checklist Card */}
            <Card className="w-80 bg-white border border-[#e6e4df] shadow-sm rounded-xl">
              <CardContent className="p-8">
                <div className="flex flex-col gap-4">
                  {checklistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Checkbox className="w-4 h-4 rounded border border-[#d3d1cb] data-[state=checked]:bg-[#2383e2] data-[state=checked]:border-[#2383e2]" />
                      <span className="text-[15px] text-[#37352f]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks Database Table */}
          <Card className="bg-white border border-[#e6e4df] shadow-sm rounded-xl">
            <CardContent className="p-8">
              <h2 className="text-base text-[#37352f] font-semibold mb-6">
                Tasks Database
              </h2>

              {/* Table Header */}
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-8 pb-3 mb-2 border-b border-[#e6e4df]">
                <span className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide">Task</span>
                <span className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide">
                  Status
                </span>
                <span className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide">
                  Priority
                </span>
                <span className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide">
                  Due date
                </span>
              </div>

              {/* Table Rows */}
              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-8 items-center py-3 border-b border-[#f1f0ee] last:border-0 hover:bg-[#fafaf9] transition-colors cursor-pointer"
                >
                  <span className="text-[15px] text-[#37352f]">
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
                  <span className="text-sm text-[#65645f]">{task.dueDate}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </main>
      </div>
    </section>
  );
};
