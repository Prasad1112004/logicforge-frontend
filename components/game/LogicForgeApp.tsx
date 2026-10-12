'use client';

import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

import { createGuestPlayer, getWorld, requestHint, submitChallenge } from '@/lib/api';
import { demoChallenges, demoPlayer, demoWorld } from '@/lib/demo-data';
import { getLocalPlayer, saveLocalPlayer } from '@/lib/game';
import type { Challenge, Mission, Player } from '@/lib/types';

import { ByteCompanion } from './ByteCompanion';
import { CodingWorkspace } from './CodingWorkspace';
import { Header, type Tab } from './Header';
import { MapSection } from './MapSection';
import { MissionSection } from './MissionSection';
import { OverviewSection } from './OverviewSection';
import { ProfileSection } from './ProfileSection';
import { WelcomeScreen } from './WelcomeScreen';

export default function LogicForgeApp() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [player, setPlayer] = useState<Player | null>(null);
  const [world, setWorld] = useState<any[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState('if signal == "green":\n    open_gate()');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string; xp_awarded?: number; coins_awarded?: number } | null>(null);
  const [hint, setHint] = useState<string>('Byte is ready to help you reason through the challenge.');
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

  const createPlayer = async (name: string) => {
    setIsLoading(true);
    try {
      const nextPlayer = await createGuestPlayer(name.trim() || 'Nova');
      setPlayer(nextPlayer);
      setWelcomeVisible(false);
      setIsDemoMode(false);
      saveLocalPlayer(nextPlayer);
      await loadWorld();
    } catch {
      const fallback = { ...demoPlayer, guest_name: name.trim() || 'Nova', guest_code: 'BYTE-DEMO' };
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
            rank: result.rank || current.rank,
            completed_challenges: current.completed_challenges + 1,
          };
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

  if (!player) {
    return <div className="flex min-h-screen items-center justify-center bg-forge-bg text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-forge-bg text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8">
        {welcomeVisible ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <WelcomeScreen onCreatePlayer={createPlayer} isLoading={isLoading} />
          </motion.div>
        ) : (
          <div className="space-y-6">
            <Header playerName={player.guest_name} activeTab={activeTab} onTabChange={setActiveTab} isDemoMode={isDemoMode} />

            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-6">
                {activeTab === 'overview' && <OverviewSection player={player} />}

                {activeTab === 'map' && <MapSection regions={world} currentRegionId={player.current_region_id} />}

                {activeTab === 'mission' && (
                  <MissionSection missions={missions} selectedMissionId={selectedMission?.id} onSelectMission={setupMission} />
                )}

                {activeTab === 'profile' && <ProfileSection player={player} />}
              </div>

              <ByteCompanion hint={hint} onRequestHint={handleHint} />
            </div>

            <CodingWorkspace
              challenge={selectedChallenge}
              code={code}
              onCodeChange={setCode}
              feedback={feedback}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
