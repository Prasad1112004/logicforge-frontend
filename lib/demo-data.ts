export interface Player {
  id: number;
  guest_name: string;
  guest_code: string;
  xp: number;
  coins: number;
  rank: string;
  current_region_id?: number | null;
  current_mission_id?: number | null;
  performance_score?: number;
  completed_challenges: number;
}

export interface Region {
  id: number;
  name: string;
  description: string;
  theme?: string;
  order_index?: number;
  missions?: Mission[];
}

export interface Mission {
  id: number;
  region_id: number;
  title: string;
  description: string;
  mission_type: string;
  order_index: number;
  unlock_level: number;
  xp_reward: number;
  coin_reward: number;
  is_boss?: boolean;
  status?: string;
  challenge_count?: number;
}

export interface Challenge {
  id: number;
  mission_id: number;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  validation_type: string;
  objective: string;
  sample_code?: string;
  xp_reward?: number;
  coin_reward?: number;
}

export interface WorldResponse {
  regions: Region[];
  missions: Mission[];
}

export interface ChallengeSubmitRequest {
  code?: string;
  visual_program?: string[];
  notes?: string;
}

export interface SubmitResult {
  success: boolean;
  message: string;
  xp_awarded: number;
  coins_awarded: number;
  rank?: string;
  next_mission_unlocked?: boolean;
  performance_score?: number;
  trace?: unknown[];
}

export interface HintResponse {
  challenge_id: number;
  stage: number;
  hint: string;
  total_stages: number;
}

export interface Progression {
  player_id: number;
  xp: number;
  coins: number;
  rank: string;
  completed_challenges: number;
  unlocked_regions: number;
  unlocked_missions: number;
  current_region_id?: number | null;
  current_mission_id?: number | null;
  achievements: string[];
  skills_unlocked: string[];
}

export interface Mastery {
  player_id: number;
  overall_mastery: number;
  by_category: Record<string, number>;
}
