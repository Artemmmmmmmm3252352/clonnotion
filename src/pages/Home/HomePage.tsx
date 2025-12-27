import { SearchIcon, Settings } from "lucide-react";
import React from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";

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

export const HomePage = (): JSX.Element => {
  return (
    <section className="w-full h-screen bg-[#fafaf9] p-8">
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-[#e6e4df]">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97]" />
          <Input
            placeholder="Search workspace..."
            className="pl-9 h-9 text-sm bg-[#efefec] border-transparent rounded-lg hover:bg-[#e6e4df] transition-colors text-[#37352f] placeholder:text-[#9b9a97]"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button className="h-9 px-4 text-sm bg-[#2383e2] hover:bg-[#1a6bc2] text-white rounded-lg font-medium">
            New page
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 hover:bg-[#efefec] rounded-lg">
            <Settings className="w-5 h-5 text-[#9b9a97]" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-[#2383e2] flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        </div>
      </header>

      <div className="flex gap-8">
        <aside className="w-72 flex flex-col gap-4">
          {sidebarCards.map((card, index) => (
            <Card
              key={index}
              className="bg-white border border-[#e6e4df] shadow-sm hover:shadow-md transition-all rounded-xl cursor-pointer"
            >
              <CardContent className="p-5">
                <h3 className="text-sm text-[#37352f] mb-2 font-semibold">
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
                      className={`${tag.color} text-[11px] px-2.5 py-0.5 rounded-md border-0 font-medium`}
                    >
                      {tag.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </aside>

        <main className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-4xl text-[#37352f] font-bold mb-4 tracking-tight">
              Q4 Project Plan
            </h1>
            <div className="flex gap-2">
              {projectTags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${tag.color} text-xs px-3 py-1 rounded-md border-0 font-medium`}
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-5">
            <Card className="flex-1 bg-white border border-[#e6e4df] shadow-sm rounded-xl">
              <CardContent className="p-6">
                <p className="text-[15px] text-[#37352f] leading-relaxed mb-4">
                  This project goals is key milestones and strategy for the
                  upcoming exapection brands, cummtors, and strategl-salis for
                  your project.
                </p>
                <p className="text-[15px] text-[#65645f] leading-relaxed">
                  This catabase levelops wear project projects and meet canas
                  on selection, recycling campaign and launchcoated project
                  ennnions.
                </p>
              </CardContent>
            </Card>

            <Card className="w-64 bg-white border border-[#e6e4df] shadow-sm rounded-xl">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  {checklistItems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Checkbox className="w-4 h-4 rounded border-2 border-[#d3d1cb] data-[state=checked]:bg-[#2383e2] data-[state=checked]:border-[#2383e2]" />
                      <span className="text-[15px] text-[#37352f]">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white border border-[#e6e4df] shadow-sm rounded-xl">
            <CardContent className="p-6">
              <h2 className="text-base text-[#37352f] font-semibold mb-5">
                Tasks Database
              </h2>

              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-6 pb-3 mb-2 border-b border-[#e6e4df]">
                <span className="text-xs text-[#9b9a97] font-medium">Task</span>
                <span className="text-xs text-[#9b9a97] font-medium">Status</span>
                <span className="text-xs text-[#9b9a97] font-medium">Priority</span>
                <span className="text-xs text-[#9b9a97] font-medium">Due date</span>
              </div>

              {tasks.map((task, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-6 items-center py-3 border-b border-[#f1f0ee] last:border-0 hover:bg-[#fafaf9] transition-colors cursor-pointer"
                >
                  <span className="text-[15px] text-[#37352f]">
                    {task.name}
                  </span>
                  <Badge
                    variant="outline"
                    className={`${task.status.color} text-xs px-2.5 py-1 rounded-md border-0 w-fit font-medium`}
                  >
                    {task.status.label}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`${task.priority.color} text-xs px-2.5 py-1 rounded-md border-0 w-fit font-medium`}
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
