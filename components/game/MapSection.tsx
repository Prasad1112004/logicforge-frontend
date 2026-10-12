import { BadgeCheck, Lock, Map } from 'lucide-react';
import type { Region } from '@/lib/types';

export function MapSection({ regions, currentRegionId }: { regions: Region[]; currentRegionId?: number | null }) {
  return (
    <section className="panel p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">World Map</p>
          <h3 className="mt-2 text-2xl font-bold">Forge Regions</h3>
        </div>
        <Map className="h-5 w-5 text-cyan-300" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {regions.map((region) => {
          const isUnlocked = region.id <= (currentRegionId ?? 1);
          return (
            <button
              key={region.id}
              className={`rounded-2xl border p-4 text-left transition ${
                isUnlocked ? 'border-cyan-500/30 bg-slate-900/60 hover:border-cyan-400' : 'border-slate-700 bg-slate-950/40 opacity-60'
              }`}
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-cyan-300">Region {region.id}</span>
                {isUnlocked ? <BadgeCheck className="h-4 w-4 text-emerald-300" /> : <Lock className="h-4 w-4 text-slate-400" />}
              </div>
              <h4 className="text-lg font-bold text-white">{region.name}</h4>
              <p className="mt-2 text-sm text-slate-300">{region.description}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
