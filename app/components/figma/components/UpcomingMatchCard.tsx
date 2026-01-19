import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { EventWithParticipants } from '../types/match-types';
import { RSVPSection } from './RSVPSection';
import { ParticipantsList } from './ParticipantsList';

interface UpcomingMatchCardProps {
  match: EventWithParticipants;
  index: number;
  onRsvp: (eventId: string, status: 'yes' | 'no' | 'tentative') => Promise<void>;
  isLoading: boolean;
}

export function UpcomingMatchCard({ match, index, onRsvp, isLoading }: UpcomingMatchCardProps) {
  const [showParticipants, setShowParticipants] = useState(false);

  const eventDate = new Date(match.start_time);
  const dateStr = eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const hasParticipants =
    match.participants.going.length > 0 ||
    match.participants.tentative.length > 0 ||
    match.participants.queued.length > 0;

  return (
    <motion.div
      key={match.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">{match.title}</div>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <Calendar className="w-4 h-4" />
              {dateStr} • {timeStr}
            </div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">
            Upcoming
          </div>
        </div>

        <RSVPSection
          eventId={match.id}
          participants={match.participants}
          maxPlayers={match.max_players}
          currentUserStatus={match.currentUserStatus}
          onRsvp={onRsvp}
          isLoading={isLoading}
        />

        {hasParticipants && (
          <motion.button
            onClick={() => setShowParticipants(!showParticipants)}
            className="w-full mt-3 text-sm text-blue-600 dark:text-blue-400 font-medium"
          >
            {showParticipants ? 'Hide' : 'Show'} participants
            {(match.participants.tentative.length > 0 || match.participants.queued.length > 0) &&
              ` (${match.participants.tentative.length} tentative, ${match.participants.queued.length} queued)`}
          </motion.button>
        )}

        <ParticipantsList
          going={match.participants.going}
          tentative={match.participants.tentative}
          queued={match.participants.queued}
          isExpanded={showParticipants}
        />
      </div>
    </motion.div>
  );
}
