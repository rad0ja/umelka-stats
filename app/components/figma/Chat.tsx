'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { useChat } from './hooks/useChat';
import { ChatMessage } from './components/ChatMessage';
import { MessageInput } from './components/MessageInput';
import { EmptyChatState } from './components/EmptyChatState';
import { useChatForm } from './components/useChatForm';

export function Chat() {
  const { messages, loading, currentUserId, sending, sendMessage, deleteMessage } = useChat();
  const [showScrollButton, setShowScrollButton] = useState(false);
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

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-gray-500 dark:text-gray-400">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header — outside scroll */}
      <div className="shrink-0 dark:bg-gray-900 pt-14 pb-4 px-6 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-2xl font-bold mb-1 dark:text-white">Chat</h1>
      </div>

      {/* Messages — only scroll container */}
      <div className="flex-1 min-h-0 relative">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto px-4 py-4"
        >
          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center px-6">
              <EmptyChatState />
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isOwnMessage={message.user_id === currentUserId}
                  index={index}
                  onDelete={message.user_id === currentUserId ? deleteMessage : undefined}
                />
              ))}
            </AnimatePresence>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollToBottom()}
              aria-label="Scroll to bottom"
              className="absolute bottom-4 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              <ArrowDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Message Input — outside scroll */}
      <div className="shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
        <MessageInput
          value={newMessage}
          onChange={setNewMessage}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          sending={sending}
        />
      </div>
    </div>
  );
}
