import { Play, RotateCcw } from 'lucide-react';
import type { Challenge } from '@/lib/types';

export function CodingWorkspace({
  challenge,
  code,
  onCodeChange,
  feedback,
  onSubmit,
  isLoading,
}: {
  challenge: Challenge | null;
  code: string;
  onCodeChange: (code: string) => void;
  feedback: any;
  onSubmit: () => void;
  isLoading: boolean;
}) {
  const resetCode = () => {
    onCodeChange(challenge?.sample_code ?? 'if signal == "green":\n    open_gate()');
  };

  return (
    <section className="panel p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Coding Workspace</p>
          <h3 className="mt-2 text-2xl font-bold">Challenge Terminal</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetCode}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm hover:border-slate-600"
          >
            <RotateCcw className="h-4 w-4" /> Reset
          </button>
          <button
            onClick={onSubmit}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 disabled:opacity-70"
          >
            <Play className="h-4 w-4" /> {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/80">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
            <span>Python editor</span>
            <span>{challenge?.category ?? 'conditions'}</span>
          </div>
          <textarea
            value={code}
            onChange={(event) => onCodeChange(event.target.value)}
            className="h-[280px] w-full resize-none border-0 bg-transparent p-4 font-mono text-sm text-cyan-100 outline-none"
          />
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Execution trace</p>
            <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-200">
              {feedback
                ? JSON.stringify({ result: feedback.success ? 'PASS' : 'FAIL', message: feedback.message }, null, 2)
                : '{\n  "status": "ready"\n}'}
            </pre>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Console</p>
            <div className="mt-3 text-sm text-slate-200">
              {feedback ? (
                <>
                  <p className={feedback.success ? 'text-emerald-300' : 'text-amber-300'}>{feedback.message}</p>
                  {feedback.xp_awarded ? <p className="mt-2 text-cyan-300">+{feedback.xp_awarded} XP</p> : null}
                  {feedback.coins_awarded ? <p className="mt-1 text-yellow-300">+{feedback.coins_awarded} coins</p> : null}
                </>
              ) : (
                <p className="text-slate-400">Awaiting submission...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
