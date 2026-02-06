'use client';

import { useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useEventChat } from './hooks/useEventChat';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { EmptyChatState } from './components/EmptyChatState';
import { useChatForm } from './components/useChatForm';

interface EventChatProps {
  eventId: string;
}

export function EventChat({ eventId }: EventChatProps) {
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
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
        <div className="text-gray-500 dark:text-gray-400 text-center py-4">
          Loading chat...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 p-5">
        <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h2 className="font-semibold text-gray-900 dark:text-white">
          Event Chat
        </h2>
        {messages.length > 0 && (
          <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-xs px-2 py-0.5 rounded-full">
            {messages.length}
          </span>
        )}
      </div>

      {/* Chat content */}
      <div className="border-t border-gray-100 dark:border-gray-800">
              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                className="max-h-80 overflow-y-auto px-4 py-4"
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

              {/* Message Input */}
              <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3">
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
    </div>
  );
}
