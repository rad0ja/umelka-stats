import { Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Participant } from '../types/match-types';

interface ParticipantsListProps {
  going: Participant[];
  tentative: Participant[];
  queued: Participant[];
  isExpanded: boolean;
}

export function ParticipantsList({ going, tentative, queued, isExpanded }: ParticipantsListProps) {
  return (
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-3">
            {/* Going */}
            {going.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Confirmed</div>
                {going.map((participant, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{participant.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tentative */}
            {tentative.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Tentative</div>
                {tentative.map((participant, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                      <span className="text-yellow-600 dark:text-yellow-400 text-xs">?</span>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{participant.name}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Queued */}
            {queued.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Waiting List</div>
                {queued.map((participant, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="w-6 h-6 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{participant.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
