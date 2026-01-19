'use client';

import { useMatches } from './hooks/useMatches';
import { useRsvp } from './hooks/useRsvp';
import { UpcomingMatchCard } from './components/UpcomingMatchCard';
import { PastMatchCard } from './components/PastMatchCard';
import { MatchSection } from './components/MatchSection';

export function Matches() {
  const { loading, upcomingMatches, completedMatches, refetchEvents } = useMatches();
  const { handleRsvp, rsvpLoading } = useRsvp(refetchEvents);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400">Loading matches...</div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 pt-14 pb-6 px-6">
        <h1 className="text-4xl font-bold mb-1 dark:text-white">Matches</h1>
        <p className="text-gray-500 dark:text-gray-400">Schedule & Results</p>
      </div>

      {/* Upcoming Matches */}
      <div className="px-4 pt-6 pb-4">
        <MatchSection
          title="Upcoming"
          isEmpty={upcomingMatches.length === 0}
          emptyMessage="No upcoming matches scheduled"
        >
          {upcomingMatches.map((match, index) => (
            <UpcomingMatchCard
              key={match.id}
              match={match}
              index={index}
              onRsvp={handleRsvp}
              isLoading={rsvpLoading[match.id] || false}
            />
          ))}
        </MatchSection>
      </div>

      {/* Past Events */}
      <MatchSection
        title="Past Events"
        isEmpty={completedMatches.length === 0}
        emptyMessage="No past events"
      >
        {completedMatches.map((match, index) => (
          <PastMatchCard key={match.id} match={match} index={index} />
        ))}
      </MatchSection>
    </div>
  );
}