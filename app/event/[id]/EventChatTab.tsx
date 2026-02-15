'use client';

import { useRef, useEffect } from 'react';
import { useEventChat } from '@/app/components/figma/hooks/useEventChat';
import { ChatMessage } from '@/app/components/figma/components/ChatMessage';
import { MessageInput } from '@/app/components/figma/components/MessageInput';
import { EmptyChatState } from '@/app/components/figma/components/EmptyChatState';
import { useChatForm } from '@/app/components/figma/components/useChatForm';

interface EventChatTabProps {
  eventId: string;
}

export function EventChatTab({ eventId }: EventChatTabProps) {
  const { messages, loading, currentUserId, sending, sendMessage, deleteMessage } =
    useEventChat(eventId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { newMessage, setNewMessage, handleSubmit, handleKeyDown } = useChatForm({
    onSendMessage: sendMessage,
    sending,
  });

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4 py-4"
      >
        {messages.length === 0 ? (
          <EmptyChatState
            message="No messages yet. Start the conversation!"
            compact
          />
        ) : (
          <>
            {messages.map((message, index) => (
              <ChatMessage
                key={message.id}
                message={message}
                isOwnMessage={message.user_id === currentUserId}
                index={index}
                onDelete={message.user_id === currentUserId ? deleteMessage : undefined}
              />
            ))}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input - Fixed at bottom */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 safe-area-pb">
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          sending={sending}
          name="event-message"
          maxHeight="100px"
        />
      </div>
    </div>
  );
}
