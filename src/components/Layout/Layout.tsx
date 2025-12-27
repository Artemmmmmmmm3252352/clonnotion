import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar";

export const Layout = (): JSX.Element => {
  return (
    <div className="w-full h-screen flex bg-[#fafaf9]">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};
