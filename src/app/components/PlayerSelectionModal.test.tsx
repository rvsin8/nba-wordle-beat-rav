import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, it, expect, vi } from 'vitest';
import { PlayerSelectionModal } from './PlayerSelectionModal';
const players = [{ name: 'Stephen Curry', position: 'PG' as const }, { name: 'Magic Johnson', position: 'PG' as const }, { name: 'Michael Jordan', position: 'SG' as const }];
function Harness() {
  const [open, setOpen] = useState(false);
  return <><button onClick={() => setOpen(true)}>Pick point guard</button>{open && <PlayerSelectionModal position="PG" availablePlayers={players} onSelect={() => setOpen(false)} onClose={() => setOpen(false)} />}</>;
}
describe('player picker dialog', () => {
  it('has a named dialog, focuses search, traps tab, and restores focus on Escape', async () => {
    const user = userEvent.setup(); render(<Harness />);
    const opener = screen.getByRole('button', { name: 'Pick point guard' });
    await user.click(opener);
    expect(screen.getByRole('dialog', { name: 'SELECT PG' })).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: 'Search PG players' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Close player selection' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Magic Johnson' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
  it('filters by position and announces no matches', async () => {
    render(<PlayerSelectionModal position="PG" availablePlayers={players} onSelect={vi.fn()} onClose={vi.fn()} />);
    expect(screen.queryByRole('button', { name: 'Michael Jordan' })).not.toBeInTheDocument();
    await userEvent.type(screen.getByRole('searchbox'), 'not a player');
    expect(screen.getByText('No players found')).toBeVisible();
    expect(screen.getByRole('status')).toHaveTextContent('0 PLAYERS AVAILABLE');
  });
});
