import { motion } from 'framer-motion';
import { Player } from '../App';

interface HiddenTeamRevealProps {
  hiddenTeam: Player[];
}

const POSITIONS = ['PG', 'SG', 'SF', 'PF', 'C'];

export function HiddenTeamReveal({ hiddenTeam }: HiddenTeamRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="mt-8 md:mt-12 w-full max-w-md px-4"
    >
      <div className="bg-gradient-to-b from-[#1a1a1a] to-[#0f0f0f] border-2 border-gray-800 rounded-2xl p-5 md:p-6 shadow-2xl shadow-black/50">
        <h3 className="text-center text-xl md:text-3xl font-black text-gray-300 mb-5 md:mb-6 tracking-tight">
          THE HIDDEN TEAM
        </h3>
        
        <div className="space-y-2.5 md:space-y-3">
          {hiddenTeam.map((player, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="bg-gradient-to-r from-[#141414] to-[#0a0a0a] border border-gray-800 rounded-xl p-3 md:p-4 flex items-center justify-between"
            >
              <span className="text-gray-500 font-bold text-xs md:text-sm tracking-wider">
                {POSITIONS[index]}
              </span>
              <span className="text-white font-black text-base md:text-lg tracking-tight">
                {player.name}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-5 md:mt-6 pt-5 md:pt-6 border-t border-gray-800 text-center"
        >
          <p className="text-gray-600 text-xs font-semibold tracking-wider">
            BETTER LUCK NEXT TIME
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}