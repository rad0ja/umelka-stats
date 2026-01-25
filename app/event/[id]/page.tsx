'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Users, Clock } from 'lucide-react';
import { motion } from 'motion/react';
import { useEvent } from '@/app/components/figma/hooks/useEvent';
import { useRsvp } from '@/app/components/figma/hooks/useRsvp';
import { RSVPSection } from '@/app/components/figma/components/RSVPSection';
import { ParticipantsList } from '@/app/components/figma/components/ParticipantsList';
import { EventChat } from '@/app/components/figma/EventChat';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default function EventPage({ params }: EventPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { event, loading, refetchEvent } = useEvent(id);
  const { handleRsvp, rsvpLoading } = useRsvp(refetchEvent);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400">Loading event...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400 mb-4">Event not found</div>
        <button
          onClick={() => router.back()}
          className="text-blue-600 dark:text-blue-400 font-medium"
        >
          Go back
        </button>
      </div>
    );
  }

  const eventDate = new Date(event.start_time);
  const dateStr = eventDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
  const timeStr = eventDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  const isUpcoming = eventDate >= new Date();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-8">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 pt-14 pb-6 px-4">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {event.title}
            </h1>
            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isUpcoming
                ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}>
              {isUpcoming ? 'Upcoming' : 'Completed'}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Event Details */}
      <div className="px-4 pt-6 space-y-4">
        {/* Date & Time Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Date & Time</div>
              <div className="font-semibold text-gray-900 dark:text-white">{dateStr}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{timeStr}</div>
            </div>
          </div>
        </motion.div>

        {/* RSVP Section - Only for upcoming events */}
        {isUpcoming && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm"
          >
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Your Response</h2>
            <RSVPSection
              eventId={event.id}
              participants={event.participants}
              maxPlayers={event.max_players}
              currentUserStatus={event.currentUserStatus}
              onRsvp={handleRsvp}
              isLoading={rsvpLoading[event.id] || false}
            />
          </motion.div>
        )}

        {/* Participants */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <h2 className="font-semibold text-gray-900 dark:text-white">
              Participants ({event.participants.going.length}/{event.max_players})
            </h2>
          </div>

          {/* Always expanded participants list */}
          <ParticipantsList
            going={event.participants.going}
            tentative={event.participants.tentative}
            queued={event.participants.queued}
            isExpanded={true}
          />

          {event.participants.going.length === 0 &&
           event.participants.tentative.length === 0 &&
           event.participants.queued.length === 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm">No participants yet</p>
          )}
        </motion.div>

        {/* Event Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <EventChat eventId={event.id} />
        </motion.div>
      </div>
    </div>
  );
}
