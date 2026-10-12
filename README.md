import type { Player } from '@/lib/types';

const STORAGE_KEY = 'logicforge-player';

export function getLocalPlayer(): Player | null {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  if (!value) return null;
  try {
    return JSON.parse(value) as Player;
  } catch {
    return null;
  }
}

export function saveLocalPlayer(player: Player) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(player));
}
