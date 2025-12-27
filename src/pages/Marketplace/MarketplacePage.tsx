import { Store, Puzzle, Zap, Layout } from "lucide-react";

export const MarketplacePage = (): JSX.Element => {
  const categories = [
    { icon: Puzzle, label: "Integrations", count: 120 },
    { icon: Layout, label: "Templates", count: 500 },
    { icon: Zap, label: "Automations", count: 50 },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="px-6 py-4 border-b border-[#e6e4df]">
        <div className="flex items-center gap-2">
          <Store className="w-5 h-5 text-[#9b9a97]" />
          <h1 className="text-lg font-semibold text-[#37352f]">Marketplace</h1>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="mb-8">
          <input
            type="text"
            placeholder="Search marketplace..."
            className="w-full max-w-md px-4 py-2 border border-[#e6e4df] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2383e2]"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.label}
              className="p-6 border border-[#e6e4df] rounded-lg hover:bg-[#f7f6f3] transition-colors text-center"
            >
              <cat.icon className="w-8 h-8 text-[#9b9a97] mx-auto mb-2" />
              <div className="text-sm font-medium text-[#37352f]">{cat.label}</div>
              <div className="text-xs text-[#9b9a97]">{cat.count}+ available</div>
            </button>
          ))}
        </div>

        <div>
          <h2 className="text-sm font-medium text-[#37352f] mb-4">Featured</h2>
          <div className="text-sm text-[#9b9a97]">
            Explore integrations and templates to enhance your workspace.
          </div>
        </div>
      </main>
    </div>
  );
};
