import { Users } from 'lucide-react';
import { motion } from 'motion/react';
import { EventWithParticipants } from '../types/match-types';

interface PastMatchCardProps {
  match: EventWithParticipants;
  index: number;
}

export function PastMatchCard({ match, index }: PastMatchCardProps) {
  const eventDate = new Date(match.start_time);
  const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  return (
    <motion.div
      key={match.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1">
          <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">{match.title}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{dateStr} • {timeStr}</div>
        </div>
        <div className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-xs font-semibold">
          Completed
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Users className="w-4 h-4" />
        <span>{match.participants.going.length} attended</span>
      </div>
    </motion.div>
  );
}
