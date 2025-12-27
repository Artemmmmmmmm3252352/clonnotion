import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const navigationItems = [
  { id: "home", label: "Home", icon: "/image-7.png", path: "/" },
  { id: "projects", label: "Projects", icon: "/image-6.png", path: "/projects" },
  { id: "tasks-db", label: "Tasks DB", icon: "/image-5.png", path: "/tasks" },
  { id: "notes-db", label: "Notes DB", icon: "/image-4.png", path: "/notes" },
  { id: "archive", label: "Archive", icon: "/image-3.png", path: "/archive" },
];

export const Sidebar = (): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <aside className="w-60 h-full flex flex-col py-6 px-4 bg-[#f7f6f3] border-r border-[#e6e4df]">
      <header className="flex items-center gap-2 px-2 mb-8">
        <img
          className="w-5 h-5 object-contain opacity-80"
          alt="NoteZero logo"
          src="/image-9.png"
        />
        <h1 className="text-sm font-semibold text-[#37352f]">NoteZero</h1>
      </header>

      <nav className="flex flex-col gap-2 px-2">
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px] text-[#9b9a97] font-medium uppercase tracking-wide">Workspace</label>
          <Select defaultValue="personal">
            <SelectTrigger className="h-8 text-xs text-[#37352f] bg-transparent border-none shadow-none hover:bg-[#efefec] rounded-md">
              <SelectValue placeholder="Select workspace" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="personal" className="text-xs">
                Personal Workspace
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ul className="flex flex-col gap-0.5">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li key={item.id}>
                <button
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors ${
                    isActive
                      ? "bg-[#efefec]"
                      : "hover:bg-[#efefec]"
                  }`}
                >
                  <img
                    className="w-4 h-4 object-contain opacity-70"
                    alt={`${item.label} icon`}
                    src={item.icon}
                  />
                  <span className="text-sm text-[#37352f]">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
