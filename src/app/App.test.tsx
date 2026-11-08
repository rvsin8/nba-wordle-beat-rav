import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
vi.mock('./components/GameGrid', () => ({ GameGrid: ({ attempts, currentAttempt, onTileClick, isRevealing }: any) => <div><output data-testid="attempts">{attempts.length}</output><output data-testid="lineup">{currentAttempt.map((p:any)=>p?.name || "empty").join("|")}</output>{[0,1,2,3,4].map((i) => <button key={i} disabled={isRevealing} onClick={() => onTileClick(i)}>Choose {i}</button>)}</div> }));
vi.mock('./components/PlayerSelectionModal', () => ({ PlayerSelectionModal: ({ position, availablePlayers, onSelect }: any) => <><button onClick={() => onSelect(availablePlayers.find((p: any) => p.position === position))}>Select player</button><button onClick={() => onSelect(availablePlayers.find((p:any)=>p.name === "Curry"))}>Select Curry</button></> }));
const fillRow = () => { for (let i=0;i<5;i++) { fireEvent.click(screen.getByText(`Choose ${i}`)); fireEvent.click(screen.getByText('Select player')); } };
describe('reveal submission guard', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it('accepts one attempt during reveal and enables the next row only after the result', () => {
    render(<App />); fillRow();
    const submit = screen.getByRole('button', { name: 'Submit' });
    fireEvent.click(submit); fireEvent.click(submit); fireEvent.click(submit);
    expect(screen.getByTestId('attempts')).toHaveTextContent('1');
    expect(screen.getByRole('button', { name: 'Revealing…' })).toBeDisabled();
    expect(screen.getByText('Choose 0')).toBeDisabled();
    act(() => vi.advanceTimersByTime(1500));
    expect(screen.getByText('Choose 0')).toBeDisabled();
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByText('Choose 0')).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeDisabled();
    fillRow(); fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByTestId('attempts')).toHaveTextContent('2');
  });
  it('keeps a correct player in the next active row after reveal', () => {
    render(<App />); fillRow();
    fireEvent.click(screen.getByText('Choose 0')); fireEvent.click(screen.getByText('Select Curry'));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    act(() => vi.advanceTimersByTime(1500));
    act(() => vi.advanceTimersByTime(3000));
    expect(screen.getByTestId('lineup')).toHaveTextContent('Curry|empty|empty|empty|empty');
    expect(screen.getByText(/Attempt 2 of 5/)).toHaveTextContent('1 of 5 players selected');
    expect(screen.getByText('Choose 0')).toBeEnabled();
  });
  it('cancels pending reveal timers on unmount', () => {
    const { unmount } = render(<App />); fillRow();
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount(); expect(vi.getTimerCount()).toBe(0);
  });
});
