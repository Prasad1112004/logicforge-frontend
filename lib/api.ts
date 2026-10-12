import type { Challenge, Mission, Region } from '@/lib/types';

export const demoWorld: Region[] = [
  {
    id: 1,
    name: 'Neon Academy',
    description: 'Learn conditions, patterns, and first-time logic.',
    theme: 'academy',
    missions: [
      {
        id: 1,
        region_id: 1,
        title: 'Warm-Up Walk',
        description: 'Learn the basics of movement and sequencing.',
        mission_type: 'tutorial',
        order_index: 1,
        unlock_level: 1,
        xp_reward: 80,
        coin_reward: 20,
      },
      {
        id: 2,
        region_id: 1,
        title: 'Signal Sprint',
        description: 'Use conditions to guide the avatar through a gate.',
        mission_type: 'practice',
        order_index: 2,
        unlock_level: 2,
        xp_reward: 120,
        coin_reward: 30,
      },
    ],
  },
  {
    id: 2,
    name: 'Looping Desert',
    description: 'Use repetition to traverse the dunes.',
    theme: 'desert',
    missions: [
      {
        id: 3,
        region_id: 2,
        title: 'Loop Lagoon',
        description: 'Repeat actions with a clean loop.',
        mission_type: 'practice',
        order_index: 1,
        unlock_level: 2,
        xp_reward: 120,
        coin_reward: 35,
      },
    ],
  },
  {
    id: 3,
    name: 'Array Ocean',
    description: 'Collect, sort, and read data points.',
    theme: 'ocean',
    missions: [
      {
        id: 4,
        region_id: 3,
        title: 'Array Arcade',
        description: 'Store items and read values from a list.',
        mission_type: 'practice',
        order_index: 1,
        unlock_level: 3,
        xp_reward: 180,
        coin_reward: 45,
      },
    ],
  },
  {
    id: 4,
    name: 'Function City',
    description: 'Build reusable logic blocks.',
    theme: 'city',
    missions: [
      {
        id: 5,
        region_id: 4,
        title: 'Function Grove',
        description: 'Write and reuse helper logic.',
        mission_type: 'practice',
        order_index: 1,
        unlock_level: 4,
        xp_reward: 210,
        coin_reward: 55,
      },
    ],
  },
  {
    id: 5,
    name: 'Debug Den',
    description: 'Repair broken logic and find subtle bugs.',
    theme: 'den',
    missions: [
      {
        id: 6,
        region_id: 5,
        title: 'Bug Bunker',
        description: 'Identify broken conditions and restore the flow.',
        mission_type: 'practice',
        order_index: 1,
        unlock_level: 5,
        xp_reward: 260,
        coin_reward: 65,
      },
    ],
  },
  {
    id: 6,
    name: 'Algorithm Citadel',
    description: 'Search, sort, and optimize with algorithmic thinking.',
    theme: 'citadel',
    missions: [
      {
        id: 7,
        region_id: 6,
        title: 'Search Spine',
        description: 'Find the correct value and compare options.',
        mission_type: 'practice',
        order_index: 1,
        unlock_level: 6,
        xp_reward: 290,
        coin_reward: 75,
      },
    ],
  },
  {
    id: 7,
    name: 'Maze Marsh',
    description: 'Program a route through a visual maze.',
    theme: 'marsh',
    missions: [
      {
        id: 8,
        region_id: 7,
        title: 'Maze Marker',
        description: 'Navigate the maze and reach the exit tile.',
        mission_type: 'maze',
        order_index: 1,
        unlock_level: 7,
        xp_reward: 340,
        coin_reward: 85,
      },
    ],
  },
  {
    id: 8,
    name: 'The Core',
    description: 'Face the final logic boss and protect the system core.',
    theme: 'core',
    missions: [
      {
        id: 9,
        region_id: 8,
        title: 'Titan Terminal',
        description: 'Defeat the final boss through layered logic.',
        mission_type: 'boss',
        order_index: 1,
        unlock_level: 8,
        xp_reward: 500,
        coin_reward: 150,
      },
    ],
  },
];

export const demoChallenges: Challenge[] = [
  {
    id: 1,
    mission_id: 1,
    title: 'Signal Gate',
    description: 'Use a condition to open the gate when the signal is green.',
    category: 'conditions',
    difficulty: 1,
    validation_type: 'conditions',
    objective: 'Write logic that opens the gate only when the signal is green.',
    sample_code: 'if signal == "green":\n    open_gate()\nelse:\n    wait()',
    xp_reward: 60,
    coin_reward: 20,
  },
  {
    id: 2,
    mission_id: 2,
    title: 'Loop Relay',
    description: 'Repeat the same action through a mini loop.',
    category: 'loops',
    difficulty: 2,
    validation_type: 'loops',
    objective: 'Repeat the move action three times with a loop.',
    sample_code: 'for step in range(3):\n    move()',
    xp_reward: 80,
    coin_reward: 25,
  },
  {
    id: 3,
    mission_id: 3,
    title: 'Array Drift',
    description: 'Inspect an array and return the second value.',
    category: 'arrays',
    difficulty: 2,
    validation_type: 'arrays',
    objective: 'Use indexing to get the second value from the list.',
    sample_code: 'scores = [10, 25, 50]\nprint(scores[1])',
    xp_reward: 100,
    coin_reward: 30,
  },
  {
    id: 4,
    mission_id: 5,
    title: 'Function Forge',
    description: 'Create a reusable helper function.',
    category: 'functions',
    difficulty: 3,
    validation_type: 'functions',
    objective: 'Write a function that returns a sum of two numbers.',
    sample_code: 'def add(a, b):\n    return a + b',
    xp_reward: 120,
    coin_reward: 40,
  },
  {
    id: 5,
    mission_id: 8,
    title: 'Maze Marker',
    description: 'Move through the maze and reach the exit.',
    category: 'maze',
    difficulty: 3,
    validation_type: 'maze',
    objective: 'Follow the route to the exit tile without stepping into a trap.',
    sample_code: 'move()\nmove()\nturn_right()\nmove()',
    xp_reward: 140,
    coin_reward: 45,
  },
];

export const demoPlayer = {
  id: 1,
  guest_name: 'Nova',
  guest_code: 'BYTE-DEMO',
  xp: 120,
  coins: 80,
  rank: 'Logic Explorer',
  current_region_id: 1,
  current_mission_id: 1,
  performance_score: 62,
  completed_challenges: 1,
};

export function evaluateDemoChallenge(challenge: Challenge, submittedCode: string) {
  const code = submittedCode.toLowerCase();
  if (challenge.category === 'conditions') {
    return code.includes('if') && code.includes('green') && (code.includes('open_gate') || code.includes('open'));
  }
  if (challenge.category === 'loops') {
    return code.includes('for') && code.includes('range') && code.includes('move');
  }
  if (challenge.category === 'arrays') {
    return code.includes('scores') && code.includes('[1]');
  }
  if (challenge.category === 'functions') {
    return code.includes('def') && code.includes('return') && code.includes('a') && code.includes('b');
  }
  if (challenge.category === 'maze') {
    return code.includes('move') && (code.includes('turn_right') || code.includes('turn_left'));
  }
  return false;
}
