import { motion, useReducedMotion } from 'motion/react';
import { Player, GameState } from '../App';

interface GameGridProps {
  attempts: Player[][];
  currentAttempt: (Player | null)[];
  activeRow: number;
  hiddenTeam: Player[];
  onTileClick: (position: number) => void;
  gameState: GameState;
  isRevealing?: boolean;
}

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

export function GameGrid({
  attempts,
  currentAttempt,
  activeRow,
  hiddenTeam,
  onTileClick,
  gameState,
  isRevealing = false,
}: GameGridProps) {
  const rows = Array.from({ length: 5 }, (_, rowIndex) => {
    if (rowIndex < attempts.length) {
      return attempts[rowIndex];
    } else if (rowIndex === activeRow) {
      return currentAttempt;
    } else {
      return [null, null, null, null, null];
    }
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Position Labels */}
      <div className="grid grid-cols-5 gap-2 md:gap-3 mb-1 md:mb-2">
        {POSITIONS.map((pos) => (
          <div
            key={pos}
            className="w-12 min-[360px]:w-14 h-7 sm:w-16 sm:h-8 md:w-20 md:h-10 flex items-center justify-center text-gray-500 text-xs md:text-sm font-bold tracking-wider"
          >
            {pos}
          </div>
        ))}
      </div>

      {/* Rows */}
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="grid grid-cols-5 gap-2 md:gap-3">
          {row.map((player, colIndex) => {
            const isSubmitted = rowIndex < attempts.length;
            const isCorrect = isSubmitted && player?.name === hiddenTeam[colIndex].name;
            const isActive = rowIndex === activeRow && gameState === 'playing' && !isRevealing && !isSubmitted;

            return (
              <Tile
                key={`${rowIndex}-${colIndex}`}
                player={player}
                isCorrect={isCorrect}
                isSubmitted={isSubmitted}
                isActive={isActive}
                onClick={() => isActive && onTileClick(colIndex)}
                delay={colIndex * 0.1}
                isWinning={gameState === 'won' && isSubmitted && isCorrect}
                label={`Attempt ${rowIndex + 1}, ${POSITIONS[colIndex]}: ${player?.name || 'Choose player'}${isSubmitted ? (isCorrect ? ', correct' : ', incorrect') : ''}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

interface TileProps {
  player: Player | null;
  isCorrect: boolean;
  isSubmitted: boolean;
  isActive: boolean;
  onClick: () => void;
  delay: number;
  isWinning: boolean;
  label: string;
}

function Tile({ player, isCorrect, isSubmitted, isActive, onClick, delay, isWinning, label }: TileProps) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.button
      type="button"
      disabled={!isActive}
      aria-label={label}
      initial={isSubmitted && !reducedMotion ? { rotateY: 0 } : false}
      animate={
        isSubmitted && !reducedMotion
          ? {
              rotateY: [0, 90, 0],
              transition: {
                duration: 0.6,
                delay,
                times: [0, 0.5, 1],
              },
            }
          : {}
      }
      className={`
        w-12 min-[360px]:w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-lg md:rounded-xl flex items-center justify-center
        font-bold text-xs sm:text-sm md:text-base tracking-tight enabled:cursor-pointer disabled:cursor-default
        transition-all duration-300 relative overflow-hidden
        ${
          isSubmitted
            ? isCorrect
              ? 'bg-gradient-to-br from-emerald-700 to-emerald-800 text-white border-2 border-emerald-500 shadow-lg shadow-emerald-900/30'
              : 'bg-gradient-to-br from-red-900 to-red-950 text-white border-2 border-red-800 shadow-lg shadow-red-950/40'
            : isActive
            ? player
              ? 'bg-gradient-to-br from-[#1a1a1a] to-[#121212] text-white border-2 border-gray-700 hover:border-gray-500 shadow-md shadow-black/40'
              : 'bg-gradient-to-br from-[#141414] to-[#0a0a0a] text-gray-700 border-2 border-gray-800 hover:border-gray-700 shadow-inner'
            : 'bg-gradient-to-br from-[#0f0f0f] to-[#050505] text-gray-800 border-2 border-gray-900 shadow-inner'
        }
      `}
      whileHover={isActive && !reducedMotion ? { scale: 1.05, y: -2 } : {}}
      whileTap={isActive && !reducedMotion ? { scale: 0.98 } : {}}
      onClick={onClick}
    >
      {/* Championship glow for winning tiles */}
      {isWinning && !reducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-yellow-300/30 to-yellow-400/20"
          animate={{
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      <span className="relative z-10 min-w-0 break-words px-1 text-center leading-tight">{player?.name || ''}</span>
      {isSubmitted && <span aria-hidden="true" className="absolute right-1 top-0 text-[10px]">{isCorrect ? '✓' : '×'}</span>}

      {/* Subtle shimmer effect on active tiles */}
      {isActive && player && !reducedMotion && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
    </motion.button>
  );
}
