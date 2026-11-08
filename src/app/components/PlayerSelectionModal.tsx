import { motion, useReducedMotion } from 'motion/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Player } from '../App';
import { X, Search } from 'lucide-react';
import { useRef, useState } from 'react';

interface PlayerSelectionModalProps {
  position: 'PG' | 'SG' | 'SF' | 'PF' | 'C';
  availablePlayers: Player[];
  onSelect: (player: Player) => void;
  onClose: () => void;
}

export function PlayerSelectionModal({
  position,
  availablePlayers,
  onSelect,
  onClose,
}: PlayerSelectionModalProps) {
  const reducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const [returnFocus] = useState(() => document.activeElement as HTMLElement | null);
  
  const playersForPosition = availablePlayers
    .filter((p) => p.position === position)
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <Dialog.Root open onOpenChange={(open) => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md" />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 pointer-events-none">
        <Dialog.Content asChild
          onOpenAutoFocus={(event) => { event.preventDefault(); searchInput.current?.focus(); }}
          onCloseAutoFocus={(event) => { event.preventDefault(); returnFocus?.focus(); }}
        >
        <motion.div
          initial={reducedMotion ? false : { scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          className="pointer-events-auto bg-[#111111] border border-gray-800 rounded-2xl p-5 md:p-8 max-w-lg w-full max-h-[90vh] md:max-h-[85vh] overflow-hidden flex flex-col shadow-2xl shadow-black/50"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5 md:mb-6">
            <div>
              <Dialog.Title asChild><h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                SELECT {position}
              </h2></Dialog.Title>
              <Dialog.Description asChild><p className="text-gray-400 text-xs md:text-sm tracking-wide mt-1 font-medium">
                Choose your player
              </p></Dialog.Description>
            </div>
            <button
              type="button"
              aria-label="Close player selection"
              onClick={onClose}
              className="w-11 h-11 shrink-0 rounded-lg bg-gray-900 hover:bg-gray-800 active:bg-gray-700 flex items-center justify-center transition-all border border-gray-800 hover:border-gray-700"
            >
              <X size={18} className="text-gray-400" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-4 md:mb-5 relative">
            <Search size={16} className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              ref={searchInput}
              aria-label={`Search ${position} players`}
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search players..."
              className="w-full bg-[#1a1a1a] border border-gray-800 rounded-xl pl-10 md:pl-12 pr-4 py-3 md:py-3.5 text-base text-white placeholder-gray-400 focus:outline-none focus:border-gray-700 transition-all font-medium"
            />
          </div>

          {/* Player Grid */}
          <div className="overflow-y-auto flex-1 pr-1 md:pr-2 custom-scrollbar">
            {playersForPosition.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-medium text-sm md:text-base">
                No players found
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 md:gap-2.5">
                {playersForPosition.map((player, index) => (
                  <motion.button
                    type="button"
                    key={player.name}
                    initial={reducedMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.02, 0.3) }}
                    onClick={() => onSelect(player)}
                    className="bg-gradient-to-b from-[#1a1a1a] to-[#141414] hover:from-[#222222] hover:to-[#1a1a1a] active:from-[#1a1a1a] active:to-[#141414]
                             border border-gray-800 hover:border-gray-700
                             rounded-xl px-3 py-3 md:px-4 md:py-3.5 text-white font-bold tracking-wide text-xs md:text-sm
                             transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]
                             hover:shadow-lg hover:shadow-white/5"
                    whileTap={reducedMotion ? {} : { scale: 0.97 }}
                  >
                    {player.name}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Player count indicator */}
          <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-800">
            <p role="status" className="text-center text-gray-400 text-xs font-semibold tracking-wider">
              {playersForPosition.length} PLAYER{playersForPosition.length !== 1 ? 'S' : ''} AVAILABLE
            </p>
          </div>
        </motion.div>
        </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
}