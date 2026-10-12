import { Menu } from 'lucide-react';

const tabs = ['overview', 'map', 'mission', 'profile'] as const;

export type Tab = (typeof tabs)[number];

export function Header({
  playerName,
  activeTab,
  onTabChange,
  isDemoMode,
}: {
  playerName: string;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  isDemoMode: boolean;
}) {
  return (
    <header className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-slate-950 shadow-lg shadow-cyan-500/20">
          🚀
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Pilot Profile</p>
          <h2 className="text-xl font-bold text-white">{playerName}</h2>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`rounded-xl px-3 py-2 text-sm font-medium capitalize transition ${
              activeTab === tab ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30' : 'bg-slate-900/60 text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab}
          </button>
        ))}
        <button className="rounded-xl border border-slate-700 bg-slate-900/60 p-2 text-slate-300">
          <Menu className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
