import { Video, Plus } from "lucide-react";
import { Button } from "../../components/ui/button";

export const MeetingsPage = (): JSX.Element => {
  return (
    <div className="h-full flex flex-col bg-white">
      <header className="px-6 py-4 border-b border-[#e6e4df]">
        <div className="flex items-center gap-2">
          <Video className="w-5 h-5 text-[#9b9a97]" />
          <span className="text-xs text-[#9b9a97]">AI meeting notes</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#f7f6f3] rounded-lg flex items-center justify-center">
            <Video className="w-8 h-8 text-[#9b9a97]" />
          </div>
          <p className="text-sm text-[#37352f] mb-2">
            Find all your AI Meeting Notes, including ones linked to meetings you attended, organized here for easy follow-up.
          </p>
          <Button className="bg-[#2383e2] hover:bg-[#1a6fc9] text-white">
            <Plus className="w-4 h-4 mr-2" />
            New AI meeting note
          </Button>
        </div>
      </main>
    </div>
  );
};
