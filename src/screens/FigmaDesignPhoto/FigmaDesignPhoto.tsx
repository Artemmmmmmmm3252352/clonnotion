import React from "react";
import { ProjectPlanSection } from "./sections/ProjectPlanSection";
import { TaskManagementSection } from "./sections/TaskManagementSection";

export const FigmaDesignPhoto = (): JSX.Element => {
  return (
    <div className="w-full h-screen flex bg-[#fafaf9]">
      {/* Left Sidebar */}
      <aside className="w-60 bg-[#f7f6f3] border-r border-[#e6e4df] flex-shrink-0">
        <TaskManagementSection />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <ProjectPlanSection />
      </main>
    </div>
  );
};
