import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { sendChatMessage } from '@/app/actions';

export type ChatMessage = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  player_name: string;
};

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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

  // Fetch initial messages
  const fetchMessages = useCallback(async () => {
    try {
      setLoading(true);

      const [{ data: messagesData }, playerNames] = await Promise.all([
        supabase
          .from('chat_messages')
          .select('*')
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
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initialize current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  // Set up real-time subscription using Postgres Changes
  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages using Postgres Changes (more reliable than Broadcast)
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages'
        },
        async (payload) => {
          const newMessage = payload.new as { id: string; user_id: string; content: string; created_at: string };

          // Fetch player name for the new message
          const { data: player } = await supabase
            .from('players')
            .select('name')
            .eq('user_id', newMessage.user_id)
            .single();

          const enrichedMessage: ChatMessage = {
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
          table: 'chat_messages'
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
  }, [fetchMessages]);

  // Send a new message (uses server action to trigger push notifications)
  const sendMessage = async (content: string) => {
    if (!currentUserId || !content.trim()) return;

    try {
      setSending(true);
      const result = await sendChatMessage(content);

      if (!result.success) {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setSending(false);
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('chat_messages')
        .delete()
        .eq('id', messageId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
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
