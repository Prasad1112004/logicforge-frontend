import { Coins, Trophy, Zap } from 'lucide-react';

export function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        {icon}
      </div>
      <p className={`mt-4 text-2xl font-black ${accent}`}>{value}</p>
    </div>
  );
}

export function OverviewSection({ player }: { player: any }) {
  return (
    <>
      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Headquarters</p>
            <h3 className="mt-2 text-2xl font-bold">Forge Command Center</h3>
          </div>
          <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
            Synced
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={<Coins className="h-5 w-5 text-yellow-300" />} label="Coins" value={String(player.coins)} accent="text-yellow-300" />
          <StatCard icon={<Zap className="h-5 w-5 text-cyan-300" />} label="XP" value={String(player.xp)} accent="text-cyan-300" />
          <StatCard icon={<Trophy className="h-5 w-5 text-emerald-300" />} label="Rank" value={player.rank} accent="text-emerald-300" />
        </div>
      </section>

      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Current Mission</p>
            <h3 className="mt-2 text-2xl font-bold">Active Quest</h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
          <p className="text-slate-300">Complete coding challenges and unlock new regions.</p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
            <span className="rounded-full border border-slate-700 px-2 py-1">Tutorial</span>
            <span className="rounded-full border border-slate-700 px-2 py-1">80 XP</span>
            <span className="rounded-full border border-slate-700 px-2 py-1">20 Coins</span>
          </div>
        </div>
      </section>
    </>
  );
}
