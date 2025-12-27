import { SearchIcon, Plus, FileText, Calendar } from "lucide-react";
import React from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const notes = [
  {
    id: 1,
    title: "Q4 Planning Meeting Notes",
    content: "Discussion about key milestones and strategy for the upcoming quarter. Team agreed on focusing on three main areas...",
    tags: [
      { label: "Meeting", color: "bg-[#e9d7fe] text-[#6b21a8]" },
      { label: "Planning", color: "bg-[#dbeafe] text-[#1e40af]" },
    ],
    date: "Oct 12, 2024",
    author: "John D.",
  },
  {
    id: 2,
    title: "User Research Findings",
    content: "Key insights from user interviews: Users prefer simple navigation, clear pricing, and fast load times...",
    tags: [
      { label: "Research", color: "bg-[#d3f5e1] text-[#0d7d3d]" },
    ],
    date: "Oct 10, 2024",
    author: "Sarah M.",
  },
  {
    id: 3,
    title: "Product Roadmap Ideas",
    content: "Brainstorming session outcomes: New feature suggestions include AI integration, mobile app, and analytics dashboard...",
    tags: [
      { label: "Ideas", color: "bg-[#fef3c7] text-[#b45309]" },
      { label: "Product", color: "bg-[#fed7aa] text-[#c2410c]" },
    ],
    date: "Oct 8, 2024",
    author: "Mike R.",
  },
  {
    id: 4,
    title: "Team Standup Summary",
    content: "Weekly standup notes: Frontend team completed homepage redesign, Backend team working on API optimization...",
    tags: [
      { label: "Team", color: "bg-[#dbeafe] text-[#1e40af]" },
    ],
    date: "Oct 7, 2024",
    author: "Emily K.",
  },
  {
    id: 5,
    title: "Design System Guidelines",
    content: "Updated color palette, typography rules, and component specifications for the new brand identity...",
    tags: [
      { label: "Design", color: "bg-[#e9d7fe] text-[#6b21a8]" },
      { label: "Guidelines", color: "bg-[#efefec] text-[#65645f]" },
    ],
    date: "Oct 5, 2024",
    author: "Lisa T.",
  },
  {
    id: 6,
    title: "Competitor Analysis",
    content: "Detailed analysis of top 5 competitors: pricing strategies, feature comparison, and market positioning...",
    tags: [
      { label: "Research", color: "bg-[#d3f5e1] text-[#0d7d3d]" },
      { label: "Strategy", color: "bg-[#ffd4d4] text-[#c41e1e]" },
    ],
    date: "Oct 3, 2024",
    author: "John D.",
  },
];

export const NotesDBPage = (): JSX.Element => {
  return (
    <section className="w-full min-h-screen bg-[#fafaf9] p-12">
      <header className="flex items-center justify-between mb-10 pb-4 border-b border-[#e6e4df]">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97]" />
          <Input
            placeholder="Search notes..."
            className="pl-9 h-8 text-sm bg-[#efefec] border-transparent rounded-md hover:bg-[#e6e4df] transition-colors text-[#37352f] placeholder:text-[#9b9a97]"
          />
        </div>
        <Button className="h-8 px-3 text-sm bg-[#2383e2] hover:bg-[#1a6bc2] text-white rounded-md">
          <Plus className="w-4 h-4 mr-2" />
          New Note
        </Button>
      </header>

      <div className="flex items-center gap-3 mb-8">
        <FileText className="w-8 h-8 text-[#9b9a97]" />
        <h1 className="text-4xl text-[#37352f] font-bold tracking-tight">Notes Database</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="bg-white border border-[#e6e4df] shadow-sm hover:shadow-md transition-all rounded-xl cursor-pointer"
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-base text-[#37352f] font-semibold flex-1">
                  {note.title}
                </h3>
              </div>
              
              <p className="text-sm text-[#65645f] mb-4 leading-relaxed line-clamp-2">
                {note.content}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {note.tags.map((tag, tagIndex) => (
                  <Badge
                    key={tagIndex}
                    variant="outline"
                    className={`${tag.color} text-[11px] px-2.5 py-0.5 rounded-md border-0`}
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-[#9b9a97]">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{note.date}</span>
                </div>
                <span>{note.author}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
