import { motion } from 'motion/react';
import { GameState } from '../App';

interface ResultBannerProps {
  correctCount: number;
  isLastAttempt: boolean;
  gameState: GameState;
}

const getFeedbackMessage = (correctCount: number, isLastAttempt: boolean, gameState: GameState) => {
  if (gameState === 'won') {
    return {
      title: "YOU WON PLAYA. GOAT SH*T.",
      subtitle: "THERE IS A NEW GOAT IN TOWN.",
      isGold: true,
    };
  }

  if (gameState === 'lost') {
    if (correctCount <= 1) {
      return {
        title: "GO AHEAD AND CLOCK BACK INTO",
        subtitle: "WORK FOR ME, PLAYBOY.",
        isGold: false,
      };
    }
  }

  // During game feedback
  switch (correctCount) {
    case 1:
      return {
        title: "YOUR CHEEKS ARE GETTING CLAPPED.",
        subtitle: "FIGHT BACK.",
        isGold: false,
      };
    case 2:
      return {
        title: "GOT THE IQ OF A FRUIT FLY.",
        subtitle: "TOOK ONE GAME THOUGH.",
        isGold: false,
      };
    case 3:
      return {
        title: "GOOD AIN'T GOOD ENOUGH.",
        subtitle: "STILL A SOFT TEAM.",
        isGold: false,
      };
    case 4:
      return {
        title: "ALMOST HAD ME AT GAME 7.",
        subtitle: "GOOD TRY.",
        isGold: false,
      };
    default:
      return {
        title: "YOUR CHEEKS ARE GETTING CLAPPED.",
        subtitle: "FIGHT BACK.",
        isGold: false,
      };
  }
};

export function ResultBanner({ correctCount, isLastAttempt, gameState }: ResultBannerProps) {
  const { title, subtitle, isGold } = getFeedbackMessage(correctCount, isLastAttempt, gameState);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className="fixed inset-x-0 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 
                 flex items-center justify-center px-4 pointer-events-none z-50"
    >
      <motion.div
        className={`
          relative overflow-hidden rounded-2xl p-6 md:p-12 max-w-2xl w-full
          border-4 text-center
          ${
            isGold
              ? 'bg-gradient-to-br from-yellow-600/20 to-yellow-900/30 border-yellow-500/50 backdrop-blur-xl'
              : 'bg-gradient-to-br from-gray-900/95 to-black/95 border-gray-600 backdrop-blur-xl'
          }
        `}
        animate={
          isGold
            ? {
                boxShadow: [
                  '0 0 60px rgba(234, 179, 8, 0.3)',
                  '0 0 80px rgba(234, 179, 8, 0.5)',
                  '0 0 60px rgba(234, 179, 8, 0.3)',
                ],
              }
            : {}
        }
        transition={
          isGold
            ? {
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }
            : {}
        }
      >
        {/* Championship glow effect */}
        {isGold && (
          <>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                background: [
                  'radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.2) 0%, transparent 50%)',
                  'radial-gradient(circle at 50% 50%, rgba(234, 179, 8, 0.1) 0%, transparent 50%)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </>
        )}

        <div className="relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`
              text-xl sm:text-2xl md:text-4xl lg:text-5xl font-black tracking-tighter mb-2 md:mb-3
              ${isGold ? 'text-yellow-400' : 'text-white'}
            `}
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`
              text-base sm:text-lg md:text-2xl font-bold tracking-wide
              ${isGold ? 'text-yellow-300' : 'text-gray-300'}
            `}
          >
            {subtitle}
          </motion.p>

          {/* Score indicator */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200 }}
            className="mt-4 md:mt-6 inline-block"
          >
            <div
              className={`
                px-4 md:px-6 py-1.5 md:py-2 rounded-full font-bold text-xs md:text-sm tracking-wider
                ${
                  isGold
                    ? 'bg-yellow-500 text-black'
                    : 'bg-gray-700 text-white'
                }
              `}
            >
              {correctCount} / 5 CORRECT
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}