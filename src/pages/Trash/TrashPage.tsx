import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, RotateCcw, X } from "lucide-react";
import { useWorkspace } from "../../store";
import { Card, CardContent } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

export const TrashPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { getArchivedPages, restorePage, permanentlyDeletePage } = useWorkspace();
  
  const archivedPages = getArchivedPages();

  const handleRestore = (id: string) => {
    restorePage(id);
  };

  const handleDelete = (id: string) => {
    permanentlyDeletePage(id);
  };

  return (
    <div className="h-full bg-[#fafaf9] p-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Trash2 className="w-8 h-8 text-[#9b9a97]" />
          <h1 className="text-3xl font-bold text-[#37352f]">Trash</h1>
        </div>

        {archivedPages.length === 0 ? (
          <div className="text-center py-12">
            <Trash2 className="w-12 h-12 text-[#d3d1cb] mx-auto mb-4" />
            <h3 className="text-lg text-[#37352f] font-medium mb-2">Trash is empty</h3>
            <p className="text-sm text-[#9b9a97]">
              Pages you delete will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {archivedPages.map(page => (
              <Card
                key={page.id}
                className="bg-white border border-[#e6e4df] rounded-lg"
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{page.icon || "📄"}</span>
                    <span className="text-[15px] text-[#37352f]">{page.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestore(page.id)}
                      className="text-[#37352f] hover:bg-[#efefec]"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restore
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
                      className="text-[#eb5757] hover:bg-[#fef2f2]"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Delete forever
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
