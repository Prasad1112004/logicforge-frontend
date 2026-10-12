import { ArrowRight, Sparkles } from 'lucide-react';
import { useState } from 'react';

export function WelcomeScreen({
  onCreatePlayer,
  isLoading,
}: {
  onCreatePlayer: (name: string) => void;
  isLoading: boolean;
}) {
  const [guestName, setGuestName] = useState('Nova');

  return (
    <div className="grid min-h-[92vh] gap-6 lg:grid-cols-[1.3fr_0.7fr]">
      <div className="panel grid-bg relative overflow-hidden rounded-3xl p-8 lg:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(83,230,255,0.16),transparent_30%)]" />
        <div className="relative z-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" /> LogicForge // Pilot Bay
          </div>

          <h1 className="max-w-xl text-4xl font-black tracking-tight text-white md:text-6xl">
            The Programmer&apos;s Brain
          </h1>

          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Enter the neon world of code, logic, and discovery. Solve missions, program your way through puzzle worlds, and grow Byte into your ultimate coding companion.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <div className="flex items-center gap-3 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 text-sm text-violet-100">
              8 game regions
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Safe visual interpreter
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <input
              value={guestName}
              onChange={(event) => setGuestName(event.target.value)}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-950/60 px-4 py-3 text-base text-white outline-none ring-0 transition focus:border-cyan-400"
              placeholder="Enter guest pilot name"
            />
            <button
              onClick={() => onCreatePlayer(guestName)}
              disabled={isLoading}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 via-violet-500 to-emerald-400 px-5 py-3 font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Booting...' : 'Enter Forge'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <aside className="panel p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Byte Companion</p>
            <h2 className="mt-2 text-2xl font-bold text-cyan-300">Byte</h2>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-4 text-sm text-slate-200">
          <p className="font-semibold text-cyan-300">Mission brief</p>
          <p className="mt-3 leading-6 text-slate-300">
            Your first objective is to solve a logic gate challenge and earn your first reward. Once complete, the path to the next region opens.
          </p>
        </div>

        <div className="mt-6 space-y-3">
          {['Conditions', 'Loops', 'Functions', 'Algorithms'].map((skill) => (
            <div key={skill} className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/50 px-3 py-2 text-sm">
              <span>{skill}</span>
              <span className="text-cyan-300">{skill === 'Conditions' ? 'Unlocked' : 'Queued'}</span>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
