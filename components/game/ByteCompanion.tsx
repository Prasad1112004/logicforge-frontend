import { MessageSquareText } from 'lucide-react';

export function ByteCompanion({ hint, onRequestHint }: { hint: string; onRequestHint: () => void }) {
  return (
    <aside className="space-y-6">
      <section className="panel p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Byte</p>
            <h3 className="mt-2 text-xl font-bold text-cyan-300">Companion Feed</h3>
          </div>
          <MessageSquareText className="h-5 w-5 text-cyan-300" />
        </div>
        <p className="rounded-2xl border border-cyan-500/20 bg-slate-950/60 p-4 text-sm leading-6 text-slate-200">{hint}</p>
        <button
          onClick={onRequestHint}
          className="mt-4 inline-flex items-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-300"
        >
          Request hint
        </button>
      </section>
    </aside>
  );
}
