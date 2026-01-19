import { Check, X, Clock, Users, CircleQuestionMark } from 'lucide-react';
import { motion } from 'motion/react';
import { ParticipationStatus, EventParticipants } from '../types/match-types';

interface RSVPSectionProps {
  eventId: string;
  participants: EventParticipants;
  maxPlayers: number;
  currentUserStatus?: ParticipationStatus | null;
  onRsvp: (eventId: string, status: 'yes' | 'no' | 'tentative') => Promise<void>;
  isLoading: boolean;
}

export function RSVPSection({
  eventId,
  participants,
  maxPlayers,
  currentUserStatus,
  onRsvp,
  isLoading
}: RSVPSectionProps) {
  const spotsAvailable = maxPlayers - participants.going.length;
  const isFull = spotsAvailable <= 0;

  return (
    <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {participants.going.length} / {maxPlayers} Going
          </span>
        </div>
        {isFull && (
          <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400">
            <Clock className="w-3 h-3" />
            Full
          </div>
        )}
      </div>

      {/* Current user status indicator */}
      {currentUserStatus === 'queued' && (
        <div className="mb-3 p-2 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-orange-700 dark:text-orange-300">
            <Clock className="w-4 h-4" />
            <span>You're in the queue ({participants.queued.length} waiting)</span>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onRsvp(eventId, 'yes')}
          disabled={isLoading}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
            currentUserStatus === 'yes'
              ? 'bg-green-500 text-white'
              : currentUserStatus === 'queued'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-center gap-2">
            {currentUserStatus === 'queued' ? (
              <>
                <Clock className="w-5 h-5" />
                Queued
              </>
            ) : (
              <>
                <Check className="w-5 h-5" />
              </>
            )}
          </div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onRsvp(eventId, 'tentative')}
          disabled={isLoading}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
            currentUserStatus === 'tentative'
              ? 'bg-orange-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-center gap-2">
            <CircleQuestionMark className="w-5 h-5" />
          </div>
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onRsvp(eventId, 'no')}
          disabled={isLoading}
          className={`flex-1 py-3 rounded-xl font-semibold transition-colors ${
            currentUserStatus === 'no'
              ? 'bg-red-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-center gap-2">
            <X className="w-5 h-5" />
          </div>
        </motion.button>
      </div>
    </div>
  );
}
