'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BrainCircuit,
  Coins,
  Compass,
  Gamepad2,
  Lock,
  Map,
  Menu,
  MessageSquareText,
  Play,
  Rocket,
  ShieldCheck,
  Sparkles,
  Sword,
  Target,
  Trophy,
  Wand2,
  Zap,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { createGuestPlayer, getChallenge, getWorld, requestHint, submitChallenge } from '@/lib/api';
import { demoChallenges, demoPlayer, demoWorld } from '@/lib/demo-data';
import { getLocalPlayer, saveLocalPlayer } from '@/lib/game';
import type { Challenge, Mission, Player, Progression, Region } from '@/lib/types';

const tabs = ['overview', 'map', 'mission', 'profile'] as const;

type Tab = (typeof tabs)[number];

export default function LogicForgeApp() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [player, setPlayer] = useState<Player | null>(null);
  const [world, setWorld] = useState<Region[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('if signal == "green":\n    open_gate()');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string; xp_awarded?: number; coins_awarded?: number } | null>(null);
  const [hint, setHint] = useState<string>('Byte is ready to help you reason through the challenge.');
  const [guestName, setGuestName] = useState('Nova');
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [welcomeVisible, setWelcomeVisible] = useState(true);

  const loadWorld = async () => {
    try {
      const response = await getWorld();
      setWorld(response.regions ?? demoWorld);
      setMissions(response.missions ?? demoWorld.flatMap((region) => region.missions));
      setIsDemoMode(false);
    } catch {
      setWorld(demoWorld);
      setMissions(demoWorld.flatMap((region) => region.missions));
      setIsDemoMode(true);
    }
  };

  useEffect(() => {
    const localPlayer = getLocalPlayer();
    if (localPlayer) {
      setPlayer(localPlayer);
      setWelcomeVisible(false);
      setIsDemoMode(false);
      void loadWorld();
      return;
    }
    setPlayer(demoPlayer);
    setWelcomeVisible(true);
    void loadWorld();
  }, []);

  useEffect(() => {
    if (player) {
      saveLocalPlayer(player);
    }
  }, [player]);

  const setupMission = (mission: Mission) => {
    setSelectedMission(mission);
    const firstChallenge = demoChallenges.find((challenge) => challenge.mission_id === mission.id) ?? demoChallenges[0];
    setSelectedChallenge(firstChallenge);
    setCode(firstChallenge.sample_code ?? 'if signal == "green":\n    open_gate()');
    setFeedback(null);
  };

  useEffect(() => {
    if (!selectedMission && missions[0]) {
      setupMission(missions[0]);
    }
  }, [missions, selectedMission]);

  const currentRank = useMemo(() => {
    if (!player) return 'Rookie Coder';
    if (player.xp >= 1500) return 'Grandmaster Programmer';
    if (player.xp >= 1200) return 'Code Master';
    if (player.xp >= 900) return 'Systems Strategist';
    if (player.xp >= 650) return 'Algorithm Architect';
    if (player.xp >= 400) return 'Logic Engineer';
    if (player.xp >= 200) return 'Debugging Specialist';
    if (player.xp >= 100) return 'Logic Explorer';
    return 'Rookie Coder';
  }, [player]);

  const createPlayer = async () => {
    setIsLoading(true);
    try {
      const nextPlayer = await createGuestPlayer(guestName.trim() || 'Nova');
      setPlayer(nextPlayer);
      setWelcomeVisible(false);
      setIsDemoMode(false);
      saveLocalPlayer(nextPlayer);
      await loadWorld();
    } catch {
      const fallback = { ...demoPlayer, guest_name: guestName.trim() || 'Nova', guest_code: 'BYTE-DEMO' };
      setPlayer(fallback);
      setWelcomeVisible(false);
      setIsDemoMode(true);
      saveLocalPlayer(fallback);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedChallenge) return;
    setIsLoading(true);
    try {
      const result = await submitChallenge(selectedChallenge.id, { code, notes: 'Submitted from LogicForge UI' });
      setFeedback(result);
      if (result.success) {
        setPlayer((current) => {
          if (!current) return current;
          return {
            ...current,
            xp: current.xp + (result.xp_awarded ?? 0),
            coins: current.coins + (result.coins_awarded ?? 0),
            rank: currentRank,
            completed_challenges: current.completed_challenges + 1,
          } satisfies Player;
        });
        setHint('Nice work. Byte confirms the logic is sound and the next mission is now unlocked.');
      } else {
        setHint('Byte found a bug in the reasoning path. Re-read the objective and test the condition again.');
      }
    } catch {
      const success = code.toLowerCase().includes('if') && code.toLowerCase().includes('green');
      const result = {
        success,
        message: success ? 'Solution validated locally. Reward granted.' : 'The logic still needs to match the gate condition.',
        xp_awarded: success ? 60 : 0,
        coins_awarded: success ? 20 : 0,
      };
      setFeedback(result);
      if (success) {
        setPlayer((current) => {
          if (!current) return current;
          return {
            ...current,
            xp: current.xp + 60,
            coins: current.coins + 20,
            completed_challenges: current.completed_challenges + 1,
          };
        });
        setHint('Mission complete. Byte unlocked the next region route.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleHint = async () => {
    if (!selectedChallenge) return;
    try {
      const result = await requestHint(selectedChallenge.id);
      setHint(result.hint);
    } catch {
      setHint('Think about the condition in the objective. Identify the exact signal, test it, and act only when it matches.');
    }
  };

  const missionSummary = useMemo(() => {
    if (!player) return 'No active profile';
    return `${player.completed_challenges} challenges cleared • ${player.xp} XP • ${player.coins} coins`;
  }, [player]);

  if (!player) {
    return <div className="flex min-h-screen items-center justify-center bg-forge-bg text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-forge-bg text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {welcomeVisible ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid min-h-[92vh] gap-6 lg:grid-cols-[1.3fr_0.7fr]">
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
                    <BrainCircuit className="h-4 w-4 text-violet-300" /> 8 game regions
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" /> Safe visual interpreter
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
                    onClick={createPlayer}
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
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <Wand2 className="h-5 w-5" />
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
          </motion.div>
        ) : (
          <div className="space-y-6">
            <header className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-500 text-slate-950 shadow-lg shadow-cyan-500/20">
                  <Rocket className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Pilot Profile</p>
                  <h2 className="text-xl font-bold text-white">{player.guest_name}</h2>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
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

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                {activeTab === 'overview' && (
                  <>
                    <section className="panel p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Headquarters</p>
                          <h3 className="mt-2 text-2xl font-bold">Forge Command Center</h3>
                        </div>
                        <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">
                          {isDemoMode ? 'Demo Mode' : 'Synced'}
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <StatCard icon={<Coins className="h-5 w-5 text-yellow-300" />} label="Coins" value={String(player.coins)} accent="text-yellow-300" />
                        <StatCard icon={<Zap className="h-5 w-5 text-cyan-300" />} label="XP" value={String(player.xp)} accent="text-cyan-300" />
                        <StatCard icon={<Trophy className="h-5 w-5 text-emerald-300" />} label="Rank" value={currentRank} accent="text-emerald-300" />
                      </div>
                    </section>

                    <section className="panel p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Current Mission</p>
                          <h3 className="mt-2 text-2xl font-bold">{selectedMission?.title ?? 'Warm-Up Walk'}</h3>
                        </div>
                        <button
                          onClick={() => selectedMission && setupMission(selectedMission)}
                          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500/15 px-3 py-2 text-sm font-medium text-cyan-300"
                        >
                          <Play className="h-4 w-4" /> Resume
                        </button>
                      </div>

                      <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                        <p className="text-slate-300">{selectedMission?.description ?? 'Learn the basics of movement and sequencing.'}</p>
                        <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                          <span className="rounded-full border border-slate-700 px-2 py-1">{selectedMission?.mission_type ?? 'tutorial'}</span>
                          <span className="rounded-full border border-slate-700 px-2 py-1">{selectedMission?.xp_reward ?? 80} XP</span>
                          <span className="rounded-full border border-slate-700 px-2 py-1">{selectedMission?.coin_reward ?? 20} Coins</span>
                        </div>
                      </div>
                    </section>
                  </>
                )}

                {activeTab === 'map' && (
                  <section className="panel p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">World Map</p>
                        <h3 className="mt-2 text-2xl font-bold">Forge Regions</h3>
                      </div>
                      <Map className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                      {world.length > 0 ? world.map((region) => {
                        const isUnlocked = region.id <= (player.current_region_id ?? 1);
                        return (
                          <button
                            key={region.id}
                            onClick={() => setActiveTab('mission')}
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
                      }) : (
                        <div className="col-span-full text-sm text-slate-300">No regions loaded.</div>
                      )}
                    </div>
                  </section>
                )}

                {activeTab === 'mission' && (
                  <section className="panel p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mission Console</p>
                        <h3 className="mt-2 text-2xl font-bold">Playable progression</h3>
                      </div>
                      <Target className="h-5 w-5 text-cyan-300" />
                    </div>

                    <div className="space-y-3">
                      {(missions.length ? missions : demoWorld.flatMap((region) => region.missions)).map((mission) => (
                        <button
                          key={mission.id}
                          onClick={() => setupMission(mission)}
                          className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition ${
                            selectedMission?.id === mission.id ? 'border-cyan-500/40 bg-cyan-500/10' : 'border-slate-700 bg-slate-950/50 hover:border-slate-500'
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
                )}

                {activeTab === 'profile' && (
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
                      <ProfileCard title="Current rank" value={currentRank} />
                      <ProfileCard title="Unlocks" value="Conditions • Loops • Functions" />
                      <ProfileCard title="Guest code" value={player.guest_code} />
                    </div>
                  </section>
                )}
              </div>

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
                  <button onClick={handleHint} className="mt-4 inline-flex items-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm font-medium text-cyan-300">
                    Request hint
                  </button>
                </section>

                <section className="panel p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Mission briefing</p>
                  <h3 className="mt-2 text-xl font-bold">{selectedChallenge?.title ?? 'Signal Gate'}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-300">{selectedChallenge?.description ?? 'Use your logic to complete the challenge.'}</p>
                  <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/10 p-4 text-sm text-violet-100">
                    {selectedChallenge?.objective ?? 'Complete the objective in the coding workspace.'}
                  </div>
                </section>

                <section className="panel p-5">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Progress</p>
                  <div className="mt-4 space-y-3">
                    <div>
                      <div className="mb-1 flex justify-between text-sm text-slate-300">
                        <span>Concept mastery</span>
                        <span>{Math.min(100, player.completed_challenges * 14)}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-slate-800">
                        <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${Math.min(100, player.completed_challenges * 14)}%` }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-300">
                      <span>Achievements</span>
                      <span>2 unlocked</span>
                    </div>
                  </div>
                </section>
              </aside>
            </div>

            <section className="panel p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Coding Workspace</p>
                  <h3 className="mt-2 text-2xl font-bold">Challenge Terminal</h3>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setCode(selectedChallenge?.sample_code ?? 'if signal == "green":\n    open_gate()')} className="rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm">Reset</button>
                  <button onClick={handleSubmit} className="rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950">Submit</button>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-950/80">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3 text-xs uppercase tracking-[0.2em] text-slate-400">
                    <span>Python editor</span>
                    <span>{selectedChallenge?.category ?? 'conditions'}</span>
                  </div>
                  <textarea
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                    className="h-[280px] w-full resize-none border-0 bg-transparent p-4 font-mono text-sm text-cyan-100 outline-none"
                  />
                </div>

                <div className="space-y-4">
                  <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Execution trace</p>
                    <pre className="mt-3 whitespace-pre-wrap text-sm text-slate-200">{
                      feedback ? JSON.stringify({ result: feedback.success ? 'PASS' : 'FAIL', message: feedback.message }, null, 2) : '{\n  "status": "ready"\n}'
                    }</pre>
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
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
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

function ProfileCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-4">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-400">{title}</p>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
