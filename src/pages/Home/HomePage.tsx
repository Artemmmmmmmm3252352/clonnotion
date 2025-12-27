import { SearchIcon, Settings, Star, Clock, Database, FileText, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { useWorkspace } from "../../store";

export const HomePage = (): JSX.Element => {
  const { workspace, createPage } = useWorkspace();
  const navigate = useNavigate();

  const favoritePages = workspace.pages.filter(p => p.isFavorite && !p.isArchived);

  const recentPages = [...workspace.pages]
    .filter(p => !p.isArchived)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const databases = workspace.databases;

  const handlePageClick = (pageId: string) => {
    navigate(`/page/${pageId}`);
  };

  const handleDatabaseClick = (dbId: string) => {
    navigate(`/database/${dbId}`);
  };

  const handleNewPage = () => {
    const newPage = createPage("Untitled");
    navigate(`/page/${newPage.id}`);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const pageDate = new Date(date);
    const diffTime = now.getTime() - pageDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return pageDate.toLocaleDateString();
  };

  return (
    <section className="w-full min-h-screen bg-[#fafaf9] p-8">
      <header className="flex items-center justify-between mb-8 pb-4 border-b border-[#e6e4df]">
        <div className="relative w-64">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9b9a97]" />
          <input
            placeholder="Search workspace..."
            className="w-full pl-9 h-9 text-sm bg-[#efefec] border-transparent rounded-lg hover:bg-[#e6e4df] transition-colors text-[#37352f] placeholder:text-[#9b9a97] outline-none px-3"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button 
            onClick={handleNewPage}
            className="h-9 px-4 text-sm bg-[#2383e2] hover:bg-[#1a6bc2] text-white rounded-lg font-medium"
          >
            <Plus className="w-4 h-4 mr-1" />
            New page
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 hover:bg-[#efefec] rounded-lg">
            <Settings className="w-5 h-5 text-[#9b9a97]" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-[#2383e2] flex items-center justify-center text-white text-sm font-medium">
            U
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#37352f] mb-8">Welcome back!</h1>

        {favoritePages.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-4 h-4 text-[#9b9a97]" />
              <h2 className="text-sm font-semibold text-[#37352f] uppercase tracking-wide">Favorites</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {favoritePages.map(page => (
                <Card
                  key={page.id}
                  onClick={() => handlePageClick(page.id)}
                  className="bg-white border border-[#e6e4df] shadow-sm hover:shadow-md hover:border-[#d3d1cb] transition-all rounded-xl cursor-pointer group"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{page.icon || "📄"}</span>
                      <h3 className="text-sm text-[#37352f] font-semibold group-hover:text-[#2383e2] transition-colors truncate">
                        {page.title || "Untitled"}
                      </h3>
                    </div>
                    <p className="text-xs text-[#65645f] leading-relaxed line-clamp-2">
                      {page.blocks.find(b => b.type === "text" && b.content)?.content || "No content yet"}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge className="bg-[#fef3c7] text-[#b45309] text-[10px] px-2 py-0.5 rounded border-0">
                        Favorite
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-[#9b9a97]" />
            <h2 className="text-sm font-semibold text-[#37352f] uppercase tracking-wide">Recent Pages</h2>
          </div>
          {recentPages.length > 0 ? (
            <Card className="bg-white border border-[#e6e4df] shadow-sm rounded-xl overflow-hidden">
              <CardContent className="p-0">
                {recentPages.map((page, index) => (
                  <div
                    key={page.id}
                    onClick={() => handlePageClick(page.id)}
                    className={`flex items-center gap-3 px-5 py-3 hover:bg-[#fafaf9] cursor-pointer transition-colors ${
                      index !== recentPages.length - 1 ? "border-b border-[#f1f0ee]" : ""
                    }`}
                  >
                    <span className="text-lg">{page.icon || "📄"}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm text-[#37352f] font-medium truncate">
                        {page.title || "Untitled"}
                      </h3>
                    </div>
                    <span className="text-xs text-[#9b9a97] flex-shrink-0">
                      {formatDate(page.updatedAt)}
                    </span>
                    {page.isFavorite && (
                      <Star className="w-3 h-3 text-[#cb912f] fill-[#cb912f]" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-white border border-[#e6e4df] shadow-sm rounded-xl">
              <CardContent className="p-8 text-center">
                <FileText className="w-8 h-8 text-[#9b9a97] mx-auto mb-2" />
                <p className="text-sm text-[#9b9a97]">No pages yet</p>
                <Button 
                  onClick={handleNewPage}
                  className="mt-4 h-8 px-3 text-sm bg-[#2383e2] hover:bg-[#1a6bc2] text-white rounded-lg"
                >
                  Create your first page
                </Button>
              </CardContent>
            </Card>
          )}
        </section>

        {databases.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-4 h-4 text-[#9b9a97]" />
              <h2 className="text-sm font-semibold text-[#37352f] uppercase tracking-wide">Databases</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {databases.map(db => (
                <Card
                  key={db.id}
                  onClick={() => handleDatabaseClick(db.id)}
                  className="bg-white border border-[#e6e4df] shadow-sm hover:shadow-md hover:border-[#d3d1cb] transition-all rounded-xl cursor-pointer group"
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{db.icon || "📋"}</span>
                      <h3 className="text-sm text-[#37352f] font-semibold group-hover:text-[#2383e2] transition-colors">
                        {db.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[#65645f]">
                      <span>{db.rows.length} items</span>
                      <span>•</span>
                      <span>{db.properties.length} properties</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-4 h-4 text-[#9b9a97]" />
            <h2 className="text-sm font-semibold text-[#37352f] uppercase tracking-wide">Quick Actions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card
              onClick={handleNewPage}
              className="bg-white border border-[#e6e4df] border-dashed shadow-sm hover:shadow-md hover:border-[#2383e2] transition-all rounded-xl cursor-pointer group"
            >
              <CardContent className="p-5 text-center">
                <Plus className="w-6 h-6 text-[#9b9a97] group-hover:text-[#2383e2] mx-auto mb-2 transition-colors" />
                <h3 className="text-sm text-[#37352f] font-medium">New Page</h3>
                <p className="text-xs text-[#9b9a97] mt-1">Start with a blank page</p>
              </CardContent>
            </Card>
            <Card
              onClick={() => navigate("/search")}
              className="bg-white border border-[#e6e4df] shadow-sm hover:shadow-md hover:border-[#d3d1cb] transition-all rounded-xl cursor-pointer group"
            >
              <CardContent className="p-5 text-center">
                <SearchIcon className="w-6 h-6 text-[#9b9a97] group-hover:text-[#2383e2] mx-auto mb-2 transition-colors" />
                <h3 className="text-sm text-[#37352f] font-medium">Search</h3>
                <p className="text-xs text-[#9b9a97] mt-1">Find anything quickly</p>
              </CardContent>
            </Card>
            <Card
              onClick={() => navigate("/settings")}
              className="bg-white border border-[#e6e4df] shadow-sm hover:shadow-md hover:border-[#d3d1cb] transition-all rounded-xl cursor-pointer group"
            >
              <CardContent className="p-5 text-center">
                <Settings className="w-6 h-6 text-[#9b9a97] group-hover:text-[#2383e2] mx-auto mb-2 transition-colors" />
                <h3 className="text-sm text-[#37352f] font-medium">Settings</h3>
                <p className="text-xs text-[#9b9a97] mt-1">Customize your workspace</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </section>
  );
};
