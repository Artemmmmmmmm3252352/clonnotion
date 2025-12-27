import { SearchIcon, Plus, FolderOpen } from "lucide-react";
import React from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const projects = [
  {
    title: "Q4 Roadmap",
    description: "Key milestones and strategy for the upcoming quarter",
    tags: [
      { label: "Strategy", color: "bg-[#e9d7fe] text-[#6b21a8]" },
      { label: "Planning", color: "bg-[#ffd4d4] text-[#c41e1e]" },
    ],
    progress: 65,
    tasksCount: 12,
  },
  {
    title: "User Research",
    description: "Feedback from recent user interviews and surveys",
    tags: [
      { label: "Research", color: "bg-[#dbeafe] text-[#1e40af]" },
      { label: "UX", color: "bg-[#d3f5e1] text-[#0d7d3d]" },
    ],
    progress: 80,
    tasksCount: 8,
  },
  {
    title: "Marketing Campaign",
    description: "Content plan and launch schedule for product release",
    tags: [{ label: "Marketing", color: "bg-[#fed7aa] text-[#c2410c]" }],
    progress: 30,
    tasksCount: 15,
  },
  {
    title: "Website Redesign",
    description: "New brand identity and user experience improvements",
    tags: [
      { label: "Design", color: "bg-[#e9d7fe] text-[#6b21a8]" },
      { label: "Development", color: "bg-[#dbeafe] text-[#1e40af]" },
    ],
    progress: 45,
    tasksCount: 20,
  },
  {
    title: "Mobile App",
    description: "iOS and Android application development",
    tags: [
      { label: "Development", color: "bg-[#dbeafe] text-[#1e40af]" },
      { label: "Priority", color: "bg-[#ffd4d4] text-[#c41e1e]" },
    ],
    progress: 15,
    tasksCount: 35,
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time metrics and reporting system",
    tags: [{ label: "Data", color: "bg-[#d3f5e1] text-[#0d7d3d]" }],
    progress: 90,
    tasksCount: 6,
  },
];

export const ProjectsPage = (): JSX.Element => {
  return (
    <section className="w-full min-h-screen bg-[#fafaf9] p-12">
      <header className="flex items-center justify-between mb-10 pb-4 border-b border-[#e6e4df]">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97]" />
          <Input
            placeholder="Search projects..."
            className="pl-9 h-8 text-sm bg-[#efefec] border-transparent rounded-md hover:bg-[#e6e4df] transition-colors text-[#37352f] placeholder:text-[#9b9a97]"
          />
        </div>
        <Button className="h-8 px-3 text-sm bg-[#2383e2] hover:bg-[#1a6bc2] text-white rounded-md">
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </header>

      <div className="flex items-center gap-3 mb-8">
        <FolderOpen className="w-8 h-8 text-[#9b9a97]" />
        <h1 className="text-4xl text-[#37352f] font-bold tracking-tight">Projects</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project, index) => (
          <Card
            key={index}
            className="bg-white border border-[#e6e4df] shadow-sm hover:shadow-md transition-all rounded-xl cursor-pointer"
          >
            <CardContent className="p-6">
              <h3 className="text-base text-[#37352f] font-semibold mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-[#65645f] mb-4 leading-relaxed">
                {project.description}
              </p>
              
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag, tagIndex) => (
                  <Badge
                    key={tagIndex}
                    variant="outline"
                    className={`${tag.color} text-[11px] px-2.5 py-0.5 rounded-md border-0`}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-xs text-[#9b9a97] mb-1">
                  <span>Progress</span>
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#efefec] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#2383e2] rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="text-xs text-[#9b9a97]">
                {project.tasksCount} tasks
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
