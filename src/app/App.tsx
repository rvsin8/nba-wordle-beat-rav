import { useEffect, useRef, useState } from 'react';
import { keepCorrectPlayers } from './utils/lineup';
import { GameGrid } from './components/GameGrid';
import { PlayerSelectionModal } from './components/PlayerSelectionModal';
import { ResultBanner } from './components/ResultBanner';
import { HiddenTeamReveal } from './components/HiddenTeamReveal';
import { RotateCcw } from 'lucide-react';

export interface Player {
  name: string;
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
}

const HIDDEN_TEAM: Player[] = [
  { name: 'Curry', position: 'PG' },
  { name: 'Jordan', position: 'SG' },
  { name: 'LeBron', position: 'SF' },
  { name: 'Duncan', position: 'PF' },
  { name: 'Hakeem', position: 'C' },
];

const AVAILABLE_PLAYERS: Player[] = [
  // Point Guards (25)
  { name: 'Chris Paul', position: 'PG' },
  { name: 'Curry', position: 'PG' },
  { name: 'Damian Lillard', position: 'PG' },
  { name: 'De\'Aaron Fox', position: 'PG' },
  { name: 'Derrick Rose', position: 'PG' },
  { name: 'Gary Payton', position: 'PG' },
  { name: 'Isiah Thomas', position: 'PG' },
  { name: 'Ja Morant', position: 'PG' },
  { name: 'Jason Kidd', position: 'PG' },
  { name: 'John Stockton', position: 'PG' },
  { name: 'Kyrie Irving', position: 'PG' },
  { name: 'Luka Doncic', position: 'PG' },
  { name: 'Magic Johnson', position: 'PG' },
  { name: 'Oscar Robertson', position: 'PG' },
  { name: 'Russell Westbrook', position: 'PG' },
  { name: 'Steve Nash', position: 'PG' },
  { name: 'Trae Young', position: 'PG' },
  { name: 'Tyrese Haliburton', position: 'PG' },
  { name: 'Shai Gilgeous-Alexander', position: 'PG' },
  { name: 'Tony Parker', position: 'PG' },
  { name: 'Rajon Rondo', position: 'PG' },
  { name: 'John Wall', position: 'PG' },
  { name: 'Walt Frazier', position: 'PG' },
  { name: 'Bob Cousy', position: 'PG' },
  { name: 'Chauncey Billups', position: 'PG' },

  // Shooting Guards (25)
  { name: 'Allen Iverson', position: 'SG' },
  { name: 'Anthony Edwards', position: 'SG' },
  { name: 'Bradley Beal', position: 'SG' },
  { name: 'Clyde Drexler', position: 'SG' },
  { name: 'Devin Booker', position: 'SG' },
  { name: 'Donovan Mitchell', position: 'SG' },
  { name: 'Dwyane Wade', position: 'SG' },
  { name: 'George Gervin', position: 'SG' },
  { name: 'James Harden', position: 'SG' },
  { name: 'Jerry West', position: 'SG' },
  { name: 'Joe Dumars', position: 'SG' },
  { name: 'Jordan', position: 'SG' },
  { name: 'Klay Thompson', position: 'SG' },
  { name: 'Kobe Bryant', position: 'SG' },
  { name: 'Manu Ginobili', position: 'SG' },
  { name: 'Paul George', position: 'SG' },
  { name: 'Ray Allen', position: 'SG' },
  { name: 'Reggie Miller', position: 'SG' },
  { name: 'Tracy McGrady', position: 'SG' },
  { name: 'Vince Carter', position: 'SG' },
  { name: 'Zach LaVine', position: 'SG' },
  { name: 'CJ McCollum', position: 'SG' },
  { name: 'DeMar DeRozan', position: 'SG' },
  { name: 'Jimmy Butler', position: 'SG' },
  { name: 'Jaylen Brown', position: 'SG' },

  // Small Forwards (25)
  { name: 'Carmelo Anthony', position: 'SF' },
  { name: 'Dominique Wilkins', position: 'SF' },
  { name: 'Elgin Baylor', position: 'SF' },
  { name: 'Grant Hill', position: 'SF' },
  { name: 'James Worthy', position: 'SF' },
  { name: 'Jayson Tatum', position: 'SF' },
  { name: 'John Havlicek', position: 'SF' },
  { name: 'Julius Erving', position: 'SF' },
  { name: 'Kawhi Leonard', position: 'SF' },
  { name: 'Kevin Durant', position: 'SF' },
  { name: 'Larry Bird', position: 'SF' },
  { name: 'LeBron', position: 'SF' },
  { name: 'Paul Pierce', position: 'SF' },
  { name: 'Scottie Pippen', position: 'SF' },
  { name: 'Alex English', position: 'SF' },
  { name: 'Bernard King', position: 'SF' },
  { name: 'Rick Barry', position: 'SF' },
  { name: 'Shawn Marion', position: 'SF' },
  { name: 'Tracy McGrady', position: 'SF' },
  { name: 'Jimmy Butler', position: 'SF' },
  { name: 'Brandon Ingram', position: 'SF' },
  { name: 'DeMar DeRozan', position: 'SF' },
  { name: 'Gordon Hayward', position: 'SF' },
  { name: 'Khris Middleton', position: 'SF' },
  { name: 'Pascal Siakam', position: 'SF' },

  // Power Forwards (25)
  { name: 'Anthony Davis', position: 'PF' },
  { name: 'Blake Griffin', position: 'PF' },
  { name: 'Bob Pettit', position: 'PF' },
  { name: 'Charles Barkley', position: 'PF' },
  { name: 'Chris Bosh', position: 'PF' },
  { name: 'Chris Webber', position: 'PF' },
  { name: 'Dennis Rodman', position: 'PF' },
  { name: 'Dirk Nowitzki', position: 'PF' },
  { name: 'Draymond Green', position: 'PF' },
  { name: 'Duncan', position: 'PF' },
  { name: 'Elvin Hayes', position: 'PF' },
  { name: 'Giannis Antetokounmpo', position: 'PF' },
  { name: 'Karl Malone', position: 'PF' },
  { name: 'Kevin Garnett', position: 'PF' },
  { name: 'Kevin Love', position: 'PF' },
  { name: 'Kevin McHale', position: 'PF' },
  { name: 'LaMarcus Aldridge', position: 'PF' },
  { name: 'Pau Gasol', position: 'PF' },
  { name: 'Scottie Pippen', position: 'PF' },
  { name: 'Shawn Kemp', position: 'PF' },
  { name: 'Zion Williamson', position: 'PF' },
  { name: 'Paolo Banchero', position: 'PF' },
  { name: 'Julius Randle', position: 'PF' },
  { name: 'Jaren Jackson Jr', position: 'PF' },
  { name: 'Lauri Markkanen', position: 'PF' },

  // Centers (25)
  { name: 'Alonzo Mourning', position: 'C' },
  { name: 'Artis Gilmore', position: 'C' },
  { name: 'Bam Adebayo', position: 'C' },
  { name: 'Bill Russell', position: 'C' },
  { name: 'Bill Walton', position: 'C' },
  { name: 'David Robinson', position: 'C' },
  { name: 'Dikembe Mutombo', position: 'C' },
  { name: 'Dwight Howard', position: 'C' },
  { name: 'Hakeem', position: 'C' },
  { name: 'Joel Embiid', position: 'C' },
  { name: 'Kareem', position: 'C' },
  { name: 'Moses Malone', position: 'C' },
  { name: 'Nikola Jokic', position: 'C' },
  { name: 'Patrick Ewing', position: 'C' },
  { name: 'Robert Parish', position: 'C' },
  { name: 'Rudy Gobert', position: 'C' },
  { name: 'Shaq', position: 'C' },
  { name: 'Victor Wembanyama', position: 'C' },
  { name: 'Wilt Chamberlain', position: 'C' },
  { name: 'Yao Ming', position: 'C' },
  { name: 'Anthony Davis', position: 'C' },
  { name: 'Marc Gasol', position: 'C' },
  { name: 'Brook Lopez', position: 'C' },
  { name: 'Domantas Sabonis', position: 'C' },
  { name: 'Jaren Jackson Jr', position: 'C' },
].sort((a, b) => a.name.localeCompare(b.name));

export type GameState = 'playing' | 'won' | 'lost';

export default function App() {
  const [attempts, setAttempts] = useState<Player[][]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<(Player | null)[]>([null, null, null, null, null]);
  const [activeRow, setActiveRow] = useState(0);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [selectingPosition, setSelectingPosition] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isRevealing, setIsRevealing] = useState(false);
  const revealLocked = useRef(false);
  const revealTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearRevealTimers = () => {
    revealTimers.current.forEach(clearTimeout);
    revealTimers.current = [];
  };
  useEffect(() => clearRevealTimers, []);

  const handlePlayerSelect = (player: Player) => {
    if (selectingPosition === null || revealLocked.current) return;

    const newAttempt = [...currentAttempt];
    newAttempt[selectingPosition] = player;
    setCurrentAttempt(newAttempt);
    setSelectingPosition(null);
  };

  const handleSubmit = () => {
    if (revealLocked.current || gameState !== 'playing' || currentAttempt.some(p => p === null)) return;
    revealLocked.current = true;
    setIsRevealing(true);
    setSelectingPosition(null);

    const correct = currentAttempt.filter((player, idx) => 
      player?.name === HIDDEN_TEAM[idx].name
    ).length;

    setCorrectCount(correct);
    setAttempts([...attempts, currentAttempt as Player[]]);
    
    revealTimers.current.push(setTimeout(() => {
      if (correct === 5) {
        setGameState('won');
        setShowResult(true);
      } else if (activeRow === 4) {
        setGameState('lost');
        setShowResult(true);
      } else {
        setShowResult(true);
        revealTimers.current.push(setTimeout(() => {
          setShowResult(false);
          setActiveRow(activeRow + 1);
          setCurrentAttempt(keepCorrectPlayers(currentAttempt, HIDDEN_TEAM));
          revealLocked.current = false;
          setIsRevealing(false);
          revealTimers.current = [];
        }, 3000));
      }
    }, 1500));
  };

  const handleReset = () => {
    clearRevealTimers();
    revealLocked.current = false;
    setIsRevealing(false);
    setSelectingPosition(null);
    setAttempts([]);
    setCurrentAttempt([null, null, null, null, null]);
    setActiveRow(0);
    setGameState('playing');
    setShowResult(false);
    setCorrectCount(0);
  };

  const canSubmit = !isRevealing && !currentAttempt.some(p => p === null) && gameState === 'playing';

  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white mb-2">
            BEAT RAVS TEAM
          </h1>
          <p className="text-base sm:text-lg md:text-xl tracking-wider text-gray-400 font-semibold">
            5 CHANCES. BUILD THE ULTIMATE 5.
          </p>
        </div>

        <div className="mb-4 text-center text-sm text-gray-300" aria-live="polite" aria-atomic="true">
          <p>Attempt {activeRow + 1} of 5 · {currentAttempt.filter(Boolean).length} of 5 players selected</p>
          <p className="mt-1 text-xs text-gray-400">Correct picks carry into your next lineup. Change only what you need.</p>
        </div>

        {/* Game Grid */}
        <GameGrid
          attempts={attempts}
          currentAttempt={currentAttempt}
          activeRow={activeRow}
          hiddenTeam={HIDDEN_TEAM}
          onTileClick={(position) => {
            if (gameState === 'playing' && !revealLocked.current) {
              setSelectingPosition(position);
            }
          }}
          gameState={gameState}
          isRevealing={isRevealing}
        />

        {/* Submit Button */}
        {gameState === 'playing' && (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={`
              mt-6 md:mt-8 px-10 md:px-12 py-3.5 md:py-4 rounded-lg font-bold text-base md:text-lg tracking-wider uppercase
              transition-all duration-300 transform
              ${canSubmit 
                ? 'bg-white text-black hover:scale-105 hover:shadow-2xl hover:shadow-white/20 active:scale-95' 
                : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }
            `}
          >
            {isRevealing ? 'Revealing…' : 'Submit'}
          </button>
        )}

        {/* Reset Button */}
        {(gameState === 'won' || gameState === 'lost') && (
          <button
            onClick={handleReset}
            className="mt-6 md:mt-8 px-6 md:px-8 py-3 rounded-lg bg-white text-black font-bold tracking-wider uppercase text-sm md:text-base
                     hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-2
                     hover:shadow-2xl hover:shadow-white/20"
          >
            <RotateCcw size={18} />
            Play Again
          </button>
        )}

        {/* Result Banner */}
        <div role="status" aria-live="polite" aria-atomic="true">
        {showResult && (
          <ResultBanner
            correctCount={correctCount}
            isLastAttempt={activeRow === 4}
            gameState={gameState}
          />
        )}
        </div>

        {/* Hidden Team Reveal */}
        {gameState === 'lost' && (
          <HiddenTeamReveal hiddenTeam={HIDDEN_TEAM} />
        )}
      </div>

      {/* Player Selection Modal */}
      {selectingPosition !== null && (
        <PlayerSelectionModal
          position={HIDDEN_TEAM[selectingPosition].position}
          availablePlayers={AVAILABLE_PLAYERS}
          onSelect={handlePlayerSelect}
          onClose={() => setSelectingPosition(null)}
        />
      )}
    </div>
  );
}
