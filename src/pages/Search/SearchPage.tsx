import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, FileText, Database } from "lucide-react";
import { useWorkspace } from "../../store";
import { Input } from "../../components/ui/input";
import { Card, CardContent } from "../../components/ui/card";

export const SearchPage = (): JSX.Element => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { workspace } = useWorkspace();

  const filteredPages = workspace.pages.filter(page => 
    !page.isArchived && (
      page.title.toLowerCase().includes(query.toLowerCase()) ||
      page.blocks.some(block => block.content.toLowerCase().includes(query.toLowerCase()))
    )
  );

  const filteredDatabases = workspace.databases.filter(db =>
    db.name.toLowerCase().includes(query.toLowerCase()) ||
    db.rows.some(row => 
      Object.values(row.properties).some(val => 
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    )
  );

  const matchingRows = workspace.databases.flatMap(db =>
    db.rows.filter(row =>
      Object.values(row.properties).some(val =>
        String(val).toLowerCase().includes(query.toLowerCase())
      )
    ).map(row => ({ ...row, databaseName: db.name, databaseId: db.id }))
  );

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-[#fef3c7] text-[#37352f]">{part}</mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="h-full bg-[#fafaf9] p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9b9a97]" />
            <Input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search pages and databases..."
              className="pl-12 h-12 text-lg bg-white border-[#e6e4df] rounded-xl focus:ring-2 focus:ring-[#2383e2] text-[#37352f] placeholder:text-[#9b9a97]"
            />
          </div>
        </div>

        {query && (
          <div className="space-y-6">
            {filteredPages.length > 0 && (
              <div>
                <h3 className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide mb-3">
                  Pages
                </h3>
                <div className="space-y-2">
                  {filteredPages.map(page => (
                    <Card
                      key={page.id}
                      className="bg-white border border-[#e6e4df] hover:bg-[#fafaf9] cursor-pointer transition-colors rounded-lg"
                      onClick={() => navigate(`/page/${page.id}`)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#9b9a97]" />
                        <div className="flex-1">
                          <div className="text-[15px] text-[#37352f] font-medium">
                            {page.icon} {highlightText(page.title, query)}
                          </div>
                          {page.blocks.some(b => b.content.toLowerCase().includes(query.toLowerCase())) && (
                            <div className="text-sm text-[#9b9a97] mt-1 truncate">
                              {highlightText(
                                page.blocks.find(b => 
                                  b.content.toLowerCase().includes(query.toLowerCase())
                                )?.content || "",
                                query
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filteredDatabases.length > 0 && (
              <div>
                <h3 className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide mb-3">
                  Databases
                </h3>
                <div className="space-y-2">
                  {filteredDatabases.map(db => (
                    <Card
                      key={db.id}
                      className="bg-white border border-[#e6e4df] hover:bg-[#fafaf9] cursor-pointer transition-colors rounded-lg"
                      onClick={() => navigate(`/database/${db.id}`)}
                    >
                      <CardContent className="p-4 flex items-center gap-3">
                        <Database className="w-5 h-5 text-[#9b9a97]" />
                        <span className="text-[15px] text-[#37352f] font-medium">
                          {db.icon} {highlightText(db.name, query)}
                        </span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {matchingRows.length > 0 && (
              <div>
                <h3 className="text-xs text-[#9b9a97] font-medium uppercase tracking-wide mb-3">
                  Database Records
                </h3>
                <div className="space-y-2">
                  {matchingRows.map(row => (
                    <Card
                      key={row.id}
                      className="bg-white border border-[#e6e4df] hover:bg-[#fafaf9] cursor-pointer transition-colors rounded-lg"
                    >
                      <CardContent className="p-4">
                        <div className="text-[15px] text-[#37352f] font-medium">
                          {highlightText(String(row.properties.name || row.properties.Name || 'Untitled'), query)}
                        </div>
                        <div className="text-xs text-[#9b9a97] mt-1">
                          in {row.databaseName}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {filteredPages.length === 0 && filteredDatabases.length === 0 && matchingRows.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-[#d3d1cb] mx-auto mb-4" />
                <h3 className="text-lg text-[#37352f] font-medium mb-2">No results found</h3>
                <p className="text-sm text-[#9b9a97]">
                  Try searching for something else
                </p>
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-[#d3d1cb] mx-auto mb-4" />
            <h3 className="text-lg text-[#37352f] font-medium mb-2">Search your workspace</h3>
            <p className="text-sm text-[#9b9a97]">
              Find pages and databases by typing above
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
