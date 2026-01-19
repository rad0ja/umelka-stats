import { useState, useEffect } from 'react';
import { createClient } from '@/lib/client';
import { EventWithParticipants } from '../types/match-types';

export function useMatches() {
  const [events, setEvents] = useState<EventWithParticipants[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchCurrentUser();
    fetchEvents();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUserId(user?.id || null);
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);

      // Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (eventsError) throw eventsError;

      // Fetch all participants with player info via player_users_view
      const { data: participantsData, error: participantsError } = await supabase
        .from('event_participants')
        .select(`
          event_id,
          user_id,
          status,
          player_users_view!event_participants_user_id_fkey (
            email,
            user_id
          )
        `);

      if (participantsError) throw participantsError;

      // Get current user
      const { data: { user } } = await supabase.auth.getUser();

      // Fetch players to get names
      const { data: playersData } = await supabase
        .from('players')
        .select('user_id, name');

      // Create a map of user_id to player name
      const playerNameMap = new Map(
        (playersData || []).map(p => [p.user_id, p.name])
      );

      // Combine events with participants
      const eventsWithParticipants: EventWithParticipants[] = (eventsData || []).map(event => {
        const eventParticipants = participantsData?.filter(p => p.event_id === event.id) || [];

        return {
          ...event,
          participants: {
            going: eventParticipants
              .filter(p => p.status === 'yes')
              .map(p => ({
                user_id: p.user_id || '',
                name: playerNameMap.get(p.user_id || '') || (p.player_users_view as any)?.email || 'Unknown'
              })),
            notGoing: eventParticipants
              .filter(p => p.status === 'no')
              .map(p => ({
                user_id: p.user_id || '',
                name: playerNameMap.get(p.user_id || '') || (p.player_users_view as any)?.email || 'Unknown'
              })),
            queued: eventParticipants
              .filter(p => p.status === 'queued')
              .map(p => ({
                user_id: p.user_id || '',
                name: playerNameMap.get(p.user_id || '') || (p.player_users_view as any)?.email || 'Unknown'
              })),
            tentative: eventParticipants
              .filter(p => p.status === 'tentative')
              .map(p => ({
                user_id: p.user_id || '',
                name: playerNameMap.get(p.user_id || '') || (p.player_users_view as any)?.email || 'Unknown'
              }))
          },
          currentUserStatus: eventParticipants.find(p => p.user_id === user?.id)?.status || null
        };
      });

      setEvents(eventsWithParticipants);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcomingMatches = events.filter(e => new Date(e.start_time) >= now);
  const completedMatches = events.filter(e => new Date(e.start_time) < now);

  return {
    events,
    loading,
    currentUserId,
    upcomingMatches,
    completedMatches,
    refetchEvents: fetchEvents
  };
}
