import { useState } from 'react';
import { createClient } from '@/lib/client';

export function useRsvp(refetchEvents: () => Promise<void>) {
  const [rsvpLoading, setRsvpLoading] = useState<{ [key: string]: boolean }>({});
  const supabase = createClient();

  const handleRsvp = async (eventId: string, status: 'yes' | 'no' | 'tentative') => {
    // Get fresh user data instead of relying on state
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      alert('Please log in to RSVP');
      return;
    }

    setRsvpLoading(prev => ({ ...prev, [eventId]: true }));

    try {
      // Call the join_event database function
      const { data, error } = await supabase.rpc('join_event', {
        p_event_id: eventId,
        p_user_id: user.id,
        p_status: status
      });

      if (error) throw error;

      // Refresh events to show updated participant list
      await refetchEvents();

      // Show feedback if user was queued
      if (data === 'queued' && status === 'yes') {
        alert('Event is full! You have been added to the queue. You will be notified if a spot opens up.');
      }
    } catch (error) {
      console.error('Error updating RSVP:', error);
      alert('Failed to update RSVP. Please try again.');
    } finally {
      setRsvpLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  return { handleRsvp, rsvpLoading };
}
