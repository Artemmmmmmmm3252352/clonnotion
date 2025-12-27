import { SearchIcon, Archive, RotateCcw, Trash2 } from "lucide-react";
import React from "react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const archivedItems = [
  {
    id: 1,
    title: "Q2 Project Plan",
    type: "Project",
    archivedDate: "Sep 15, 2024",
    icon: "📋",
  },
  {
    id: 2,
    title: "Old Marketing Campaign",
    type: "Project",
    archivedDate: "Aug 28, 2024",
    icon: "📢",
  },
  {
    id: 3,
    title: "Legacy API Documentation",
    type: "Note",
    archivedDate: "Aug 20, 2024",
    icon: "📝",
  },
  {
    id: 4,
    title: "2023 Annual Report",
    type: "Note",
    archivedDate: "Jul 10, 2024",
    icon: "📊",
  },
  {
    id: 5,
    title: "Deprecated Features List",
    type: "Task",
    archivedDate: "Jun 25, 2024",
    icon: "✅",
  },
  {
    id: 6,
    title: "Old Team Structure",
    type: "Note",
    archivedDate: "Jun 1, 2024",
    icon: "👥",
  },
];

const typeColors: Record<string, string> = {
  Project: "bg-[#e9d7fe] text-[#6b21a8]",
  Note: "bg-[#dbeafe] text-[#1e40af]",
  Task: "bg-[#d3f5e1] text-[#0d7d3d]",
};

export const ArchivePage = (): JSX.Element => {
  return (
    <section className="w-full min-h-screen bg-[#fafaf9] p-12">
      <header className="flex items-center justify-between mb-10 pb-4 border-b border-[#e6e4df]">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97]" />
          <Input
            placeholder="Search archive..."
            className="pl-9 h-8 text-sm bg-[#efefec] border-transparent rounded-md hover:bg-[#e6e4df] transition-colors text-[#37352f] placeholder:text-[#9b9a97]"
          />
        </div>
      </header>

      <div className="flex items-center gap-3 mb-8">
        <Archive className="w-8 h-8 text-[#9b9a97]" />
        <h1 className="text-4xl text-[#37352f] font-bold tracking-tight">Archive</h1>
      </div>

      <p className="text-[#65645f] mb-8">
        Archived items are stored here. You can restore or permanently delete them.
      </p>

      <div className="flex flex-col gap-3">
        {archivedItems.map((item) => (
          <Card
            key={item.id}
            className="bg-white border border-[#e6e4df] hover:bg-[#fafaf9] transition-colors rounded-xl"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <h3 className="text-[15px] text-[#37352f] font-medium mb-1">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant="outline"
                      className={`${typeColors[item.type]} text-[11px] px-2 py-0.5 rounded-md border-0`}
                    >
                      {item.type}
                    </Badge>
                    <span className="text-xs text-[#9b9a97]">
                      Archived {item.archivedDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs bg-transparent border-[#e6e4df] hover:bg-[#efefec] rounded-md"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Restore
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs bg-transparent border-[#e6e4df] hover:bg-[#ffd4d4] hover:text-[#c41e1e] hover:border-[#ffd4d4] rounded-md"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {archivedItems.length === 0 && (
        <div className="text-center py-16">
          <Archive className="w-16 h-16 text-[#d3d1cb] mx-auto mb-4" />
          <h3 className="text-lg text-[#37352f] font-medium mb-2">Archive is empty</h3>
          <p className="text-sm text-[#9b9a97]">
            Items you archive will appear here
          </p>
        </div>
      )}
    </section>
  );
};
