import { useState, useEffect } from 'react';
import { createClient } from '@/lib/client';
import { EventWithParticipants } from '../types/match-types';

export function useEvent(eventId: string) {
  const [event, setEvent] = useState<EventWithParticipants | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchEvent = async () => {
    try {
      setLoading(true);

      // Fetch the event
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;

      // Fetch participants with player info
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
        `)
        .eq('event_id', eventId);

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

      const eventParticipants = participantsData || [];

      const eventWithParticipants: EventWithParticipants = {
        ...eventData,
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

      setEvent(eventWithParticipants);
    } catch (error) {
      console.error('Error fetching event:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  return {
    event,
    loading,
    refetchEvent: fetchEvent
  };
}
