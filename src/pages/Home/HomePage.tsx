import { SearchIcon, Plus, Clock, Star, FileText } from "lucide-react";
import React from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const recentPages = [
  {
    title: "Q4 Project Plan",
    icon: "📋",
    lastEdited: "2 hours ago",
  },
  {
    title: "Meeting Notes",
    icon: "📝",
    lastEdited: "Yesterday",
  },
  {
    title: "Product Roadmap",
    icon: "🗺️",
    lastEdited: "3 days ago",
  },
];

const favoritePages = [
  {
    title: "Team Wiki",
    icon: "📚",
    description: "Company knowledge base and documentation",
  },
  {
    title: "Sprint Board",
    icon: "🏃",
    description: "Current sprint tasks and progress",
  },
];

const quickActions = [
  { label: "New Page", icon: FileText },
  { label: "New Database", icon: Plus },
];

export const HomePage = (): JSX.Element => {
  return (
    <section className="w-full min-h-screen bg-[#fafaf9] p-12">
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
        </div>
      </header>

      <div className="max-w-4xl">
        <h1 className="text-4xl text-[#37352f] font-bold mb-2 tracking-tight">
          Good morning! 👋
        </h1>
        <p className="text-[#65645f] mb-10">Welcome back to NoteZero</p>

        <div className="grid grid-cols-2 gap-4 mb-10">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-16 flex items-center justify-center gap-3 bg-white border-[#e6e4df] hover:bg-[#efefec] rounded-xl"
            >
              <action.icon className="w-5 h-5 text-[#9b9a97]" />
              <span className="text-[#37352f]">{action.label}</span>
            </Button>
          ))}
        </div>

        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#9b9a97]" />
            <h2 className="text-sm font-semibold text-[#37352f] uppercase tracking-wide">
              Recent Pages
            </h2>
          </div>
          <div className="flex flex-col gap-2">
            {recentPages.map((page, index) => (
              <Card
                key={index}
                className="bg-white border border-[#e6e4df] hover:bg-[#fafaf9] transition-colors cursor-pointer rounded-lg"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{page.icon}</span>
                    <span className="text-[15px] text-[#37352f]">{page.title}</span>
                  </div>
                  <span className="text-xs text-[#9b9a97]">{page.lastEdited}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-4 h-4 text-[#9b9a97]" />
            <h2 className="text-sm font-semibold text-[#37352f] uppercase tracking-wide">
              Favorites
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {favoritePages.map((page, index) => (
              <Card
                key={index}
                className="bg-white border border-[#e6e4df] hover:shadow-md transition-all cursor-pointer rounded-xl"
              >
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{page.icon}</span>
                    <h3 className="text-sm text-[#37352f] font-medium">{page.title}</h3>
                  </div>
                  <p className="text-xs text-[#65645f]">{page.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
