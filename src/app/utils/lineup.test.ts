import { describe, it, expect } from 'vitest';
import { keepCorrectPlayers } from './lineup';
import type { Player } from '../App';
const team: Player[] = [{name:'Curry',position:'PG'},{name:'Jordan',position:'SG'},{name:'James',position:'SF'},{name:'Duncan',position:'PF'},{name:'Hakeem',position:'C'}];
describe('earned lineup progress', () => {
 it('carries correct choices and clears wrong or empty slots without mutating the attempt', () => {
  const wrong: Player = {name:'Other',position:'SG'};
  const attempt = [team[0],wrong,null,team[3],null];
  expect(keepCorrectPlayers(attempt,team)).toEqual([team[0],null,null,team[3],null]);
  expect(attempt).toEqual([team[0],wrong,null,team[3],null]);
 });
 it('requires both the player and position to match', () => {
  expect(keepCorrectPlayers([{name:'Curry',position:'SG'}],team)).toEqual([null,null,null,null,null]);
 });
 it('handles all-correct and empty lineups', () => {
  expect(keepCorrectPlayers(team,team)).toEqual(team);
  expect(keepCorrectPlayers([],team)).toEqual([null,null,null,null,null]);
 });
});
