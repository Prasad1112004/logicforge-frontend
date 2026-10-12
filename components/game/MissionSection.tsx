import { Target } from 'lucide-react';
import type { Mission } from '@/lib/types';

export function MissionSection({
  missions,
  selectedMissionId,
  onSelectMission,
}: {
  missions: Mission[];
  selectedMissionId?: number;
  onSelectMission: (mission: Mission) => void;
}) {
  return (
    <section className="panel p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mission Console</p>
          <h3 className="mt-2 text-2xl font-bold">Playable progression</h3>
        </div>
        <Target className="h-5 w-5 text-cyan-300" />
      </div>

      <div className="space-y-3">
        {missions.map((mission) => (
          <button
            key={mission.id}
            onClick={() => onSelectMission(mission)}
            className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
              selectedMissionId === mission.id ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-slate-700 bg-slate-950/50 hover:border-slate-500'
            }`}
          >
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mission {mission.id}</p>
              <h4 className="mt-1 text-lg font-bold text-white">{mission.title}</h4>
              <p className="mt-1 text-sm text-slate-300">{mission.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className="rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-xs font-medium uppercase tracking-[0.2em] text-violet-200">
                {mission.mission_type}
              </span>
              <span className="text-xs text-slate-400">{mission.xp_reward} XP</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
