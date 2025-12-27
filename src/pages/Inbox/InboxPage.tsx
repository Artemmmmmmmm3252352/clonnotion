import { Inbox, Bell } from "lucide-react";

export const InboxPage = (): JSX.Element => {
  return (
    <div className="h-full flex flex-col bg-white">
      <header className="px-6 py-4 border-b border-[#e6e4df]">
        <div className="flex items-center gap-2">
          <Inbox className="w-5 h-5 text-[#9b9a97]" />
          <h1 className="text-lg font-semibold text-[#37352f]">Inbox</h1>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#f7f6f3] rounded-full flex items-center justify-center">
            <Bell className="w-8 h-8 text-[#9b9a97]" />
          </div>
          <h2 className="text-lg font-medium text-[#37352f] mb-2">No notifications</h2>
          <p className="text-sm text-[#9b9a97]">
            You're all caught up! New notifications will appear here.
          </p>
        </div>
      </main>
    </div>
  );
};
