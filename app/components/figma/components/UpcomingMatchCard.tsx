import { Users } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { EventWithParticipants } from '../types/match-types';

interface UpcomingMatchCardProps {
  match: EventWithParticipants;
  index: number;
}

export function UpcomingMatchCard({ match, index }: UpcomingMatchCardProps) {
  const eventDate = new Date(match.start_time);
  const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const isGoing = match.currentUserStatus === 'yes';
  const isNotGoing = match.currentUserStatus === 'no';

  const borderClass = isGoing
    ? 'border-r-4 border-r-green-500'
    : isNotGoing
      ? 'border-r-4 border-r-red-500'
      : '';

  return (
    <Link href={`/event/${match.id}`}>
      <motion.div
        key={match.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${borderClass}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <div className="text-lg font-bold text-gray-900 dark:text-white mb-1">{match.title}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{dateStr} • {timeStr}</div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
            Upcoming
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <Users className="w-4 h-4" />
          <span>{match.participants.going.length} going</span>
        </div>
      </motion.div>
    </Link>
  );
}
