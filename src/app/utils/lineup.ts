import type { Player } from '../App';

// Keep earned information without locking a player's choice or changing scoring.
export function keepCorrectPlayers(attempt: (Player | null)[], target: Player[]): (Player | null)[] {
  return target.map((player, index) => attempt[index]?.name === player.name && attempt[index]?.position === player.position ? attempt[index] : null);
}
