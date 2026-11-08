import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { GameGrid } from './GameGrid';
import type { Player } from '../App';
const team: Player[] = ['PG', 'SG', 'SF', 'PF', 'C'].map((position, i) => ({ name: `Player ${i}`, position: position as Player['position'] }));
const base = { attempts: [], currentAttempt: [null, null, null, null, null], activeRow: 0, hiddenTeam: team, gameState: 'playing' as const };
describe('accessible team grid', () => {
  it('allows keyboard selection only in the active row', async () => {
    const select = vi.fn();
    render(<GameGrid {...base} onTileClick={select} />);
    expect(screen.getAllByRole('button').filter((button) => !(button as HTMLButtonElement).disabled)).toHaveLength(5);
    await userEvent.tab();
    expect(screen.getByRole('button', { name: 'Attempt 1, PG: Choose player' })).toHaveFocus();
    await userEvent.keyboard('{Enter}');
    expect(select).toHaveBeenCalledWith(0);
  });
  it('labels submitted correctness without relying only on color', () => {
    render(<GameGrid {...base} attempts={[team]} activeRow={1} onTileClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Attempt 1, PG: Player 0, correct' })).toBeDisabled();
  });
  it('prevents editing during reveal', () => {
    render(<GameGrid {...base} isRevealing onTileClick={vi.fn()} />);
    screen.getAllByRole('button').forEach((button) => expect(button).toBeDisabled());
  });
});
