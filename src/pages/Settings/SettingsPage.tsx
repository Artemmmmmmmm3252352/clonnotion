import { Settings, User, Bell, Lock, Palette, Globe } from "lucide-react";

export const SettingsPage = (): JSX.Element => {
  const sections = [
    { icon: User, label: "Account", description: "Manage your account settings" },
    { icon: Bell, label: "Notifications", description: "Configure notification preferences" },
    { icon: Lock, label: "Privacy & Security", description: "Control your privacy settings" },
    { icon: Palette, label: "Appearance", description: "Customize the look and feel" },
    { icon: Globe, label: "Language & Region", description: "Set your language and timezone" },
  ];

  return (
    <div className="h-full flex flex-col bg-white">
      <header className="px-6 py-4 border-b border-[#e6e4df]">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-[#9b9a97]" />
          <h1 className="text-lg font-semibold text-[#37352f]">Settings</h1>
        </div>
      </header>

      <main className="flex-1 p-6 max-w-2xl">
        <div className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.label}
              className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-[#f7f6f3] transition-colors text-left"
            >
              <div className="w-10 h-10 bg-[#f7f6f3] rounded-lg flex items-center justify-center">
                <section.icon className="w-5 h-5 text-[#9b9a97]" />
              </div>
              <div>
                <div className="text-sm font-medium text-[#37352f]">{section.label}</div>
                <div className="text-xs text-[#9b9a97]">{section.description}</div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
};
