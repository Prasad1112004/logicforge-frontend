import { demoChallenges, evaluateDemoChallenge } from '@/lib/demo-data';
import type { Challenge, HintResponse, Player, Progression, SubmitResult, WorldResponse } from '@/lib/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1';

export let demoMode = false;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function createGuestPlayer(name: string): Promise<Player> {
  try {
    const result = await request<Player>('/players/guest', {
      method: 'POST',
      body: JSON.stringify({ guest_name: name || 'Guest' }),
    });
    demoMode = false;
    return result;
  } catch {
    demoMode = true;
    return {
      id: 1,
      guest_name: name || 'Nova',
      guest_code: 'BYTE-DEMO',
      xp: 120,
      coins: 80,
      rank: 'Logic Explorer',
      current_region_id: 1,
      current_mission_id: 1,
      performance_score: 62,
      completed_challenges: 1,
    };
  }
}

export async function getWorld(): Promise<WorldResponse> {
  try {
    const result = await request<WorldResponse>('/world');
    demoMode = false;
    return result;
  } catch {
    demoMode = true;
    return {
      regions: [
        {
          id: 1,
          name: 'Neon Academy',
          description: 'Learn conditions and logic basics.',
          theme: 'academy',
        },
      ],
      missions: [],
    };
  }
}

export async function getChallenge(id: number): Promise<Challenge> {
  try {
    const result = await request<Challenge>(`/challenges/${id}`);
    demoMode = false;
    return result;
  } catch {
    demoMode = true;
    const match = demoChallenges.find((challenge) => challenge.id === id) ?? demoChallenges[0];
    return match;
  }
}

export async function submitChallenge(id: number, payload: { code?: string; notes?: string }): Promise<SubmitResult> {
  try {
    const result = await request<SubmitResult>(`/challenges/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    demoMode = false;
    return result;
  } catch {
    demoMode = true;
    const challenge = demoChallenges.find((item) => item.id === id) ?? demoChallenges[0];
    const success = evaluateDemoChallenge(challenge, payload.code ?? '');
    return {
      success,
      message: success ? 'Local validation passed. Reward granted.' : 'The logic does not yet satisfy the objective.',
      xp_awarded: success ? challenge.xp_reward ?? 60 : 0,
      coins_awarded: success ? challenge.coin_reward ?? 20 : 0,
      rank: success ? 'Logic Explorer' : 'Rookie Coder',
    };
  }
}

export async function requestHint(id: number): Promise<HintResponse> {
  try {
    const result = await request<HintResponse>(`/challenges/${id}/hint`, { method: 'POST' });
    demoMode = false;
    return result;
  } catch {
    demoMode = true;
    const challenge = demoChallenges.find((item) => item.id === id) ?? demoChallenges[0];
    return {
      challenge_id: challenge.id,
      stage: 1,
      hint: challenge.category === 'conditions' ? 'Identify the signal and check it before taking the action.' : 'Break the task into smaller steps and trace each operation before submitting.',
      total_stages: 3,
    };
  }
}

export async function getProgression(): Promise<Progression> {
  try {
    const result = await request<Progression>('/progression');
    demoMode = false;
    return result;
  } catch {
    demoMode = true;
    return {
      player_id: 1,
      xp: 120,
      coins: 80,
      rank: 'Logic Explorer',
      completed_challenges: 1,
      unlocked_regions: 1,
      unlocked_missions: 2,
      achievements: ['First Solve'],
      skills_unlocked: ['Conditions'],
    };
  }
}
