import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { sendEventChatMessage } from '@/app/actions';

export type EventChatMessage = {
  id: string;
  event_id: string;
  user_id: string;
  content: string;
  created_at: string;
  player_name: string;
};

export function useEventChat(eventId: string) {
  const [messages, setMessages] = useState<EventChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const channelRef = useRef<RealtimeChannel | null>(null);
  const supabase = createClient();

  // Fetch player names map
  const fetchPlayerNames = async () => {
    const { data } = await supabase.from('players').select('user_id, name');
    return new Map((data || []).map(p => [p.user_id, p.name]));
  };

  // Fetch initial messages filtered by eventId
  const fetchMessages = useCallback(async () => {
    if (!eventId) return;

    try {
      setLoading(true);

      const [{ data: messagesData }, playerNames] = await Promise.all([
        supabase
          .from('event_chat_messages')
          .select('*')
          .eq('event_id', eventId)
          .order('created_at', { ascending: true })
          .limit(100),
        fetchPlayerNames()
      ]);

      if (messagesData) {
        const enrichedMessages = messagesData.map(msg => ({
          ...msg,
          created_at: msg.created_at || new Date().toISOString(),
          player_name: playerNames.get(msg.user_id) || 'Unknown'
        }));
        setMessages(enrichedMessages);
      }
    } catch (error) {
      console.error('Error fetching event messages:', error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  // Initialize current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  // Set up real-time subscription using Postgres Changes filtered by event_id
  useEffect(() => {
    if (!eventId) return;

    fetchMessages();

    // Subscribe to new messages filtered by event_id
    const channel = supabase
      .channel(`event-chat-${eventId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'event_chat_messages',
          filter: `event_id=eq.${eventId}`
        },
        async (payload) => {
          const newMessage = payload.new as {
            id: string;
            event_id: string;
            user_id: string;
            content: string;
            created_at: string;
          };

          // Fetch player name for the new message
          const { data: player } = await supabase
            .from('players')
            .select('name')
            .eq('user_id', newMessage.user_id)
            .single();

          const enrichedMessage: EventChatMessage = {
            ...newMessage,
            player_name: player?.name || 'Unknown'
          };

          setMessages(prev => [...prev, enrichedMessage]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'event_chat_messages',
          filter: `event_id=eq.${eventId}`
        },
        (payload) => {
          const deletedId = (payload.old as { id: string }).id;
          setMessages(prev => prev.filter(msg => msg.id !== deletedId));
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [eventId, fetchMessages]);

  // Send a new message
  const sendMessage = async (content: string) => {
    if (!currentUserId || !content.trim() || !eventId) return;

    try {
      setSending(true);
      const result = await sendEventChatMessage(eventId, content);

      if (!result.success) {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending event message:', error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('event_chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting event message:', error);
      throw error;
    }
  };

  return {
    messages,
    loading,
    currentUserId,
    sending,
    sendMessage,
    deleteMessage,
    refetch: fetchMessages
  };
}
