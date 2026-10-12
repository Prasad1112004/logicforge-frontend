import { Gamepad2 } from 'lucide-react';
import type { Player } from '@/lib/types';

function ProfileCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{title}</p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

export function ProfileSection({ player }: { player: Player }) {
  return (
    <section className="panel p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Player Profile</p>
          <h3 className="mt-2 text-2xl font-bold">Skill archive</h3>
        </div>
        <Gamepad2 className="h-5 w-5 text-cyan-300" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ProfileCard title="Mission history" value={`${player.completed_challenges} completed`} />
        <ProfileCard title="Current rank" value={player.rank} />
        <ProfileCard title="Unlocks" value="Conditions • Loops • Functions" />
        <ProfileCard title="Guest code" value={player.guest_code} />
      </div>
    </section>
  );
}
