import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export const Layout = (): JSX.Element => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="w-full h-screen flex bg-[#fafaf9]">
      <div 
        className={`relative flex-shrink-0 transition-all duration-300 overflow-hidden ${sidebarCollapsed ? "w-0" : "w-60"}`}
      >
        <div className="w-60 h-full">
          <Sidebar />
        </div>
      </div>
      <button
        onClick={() => setSidebarCollapsed(prev => !prev)}
        className={`absolute top-3 z-50 w-6 h-6 flex items-center justify-center rounded hover:bg-[#e6e4df] text-[#9b9a97] transition-all duration-300 ${sidebarCollapsed ? "left-2" : "left-[232px]"}`}
      >
        {sidebarCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
      </button>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
