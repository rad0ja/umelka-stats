'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageCircle, ArrowDown } from 'lucide-react';
import { useChat } from './hooks/useChat';
import { ChatMessage } from './components/ChatMessage';

export function Chat() {
  const { messages, loading, currentUserId, sending, sendMessage, deleteMessage } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track scroll position to show/hide scroll button
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setShowScrollButton(!isNearBottom);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const messageToSend = newMessage;
    setNewMessage('');

    try {
      await sendMessage(messageToSend);
    } catch {
      setNewMessage(messageToSend);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
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
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 pt-14 pb-4 px-6 border-b border-gray-100 dark:border-gray-800">
        <h1 className="text-4xl font-bold mb-1 dark:text-white">Chat</h1>
        <p className="text-gray-500 dark:text-gray-400">Team conversation</p>
      </div>

      {/* Messages Container */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 relative"
      >
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center px-6"
          >
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No messages yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Be the first to start the conversation!
            </p>
          </motion.div>
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

        {/* Scroll to bottom button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => scrollToBottom()}
              className="fixed bottom-36 right-4 w-10 h-10 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center border border-gray-200 dark:border-gray-700"
            >
              <ArrowDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Message Input */}
      <div className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3 pb-24">
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              style={{ maxHeight: '120px' }}
            />
          </div>

          <motion.button
            type="submit"
            disabled={!newMessage.trim() || sending}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-full transition-colors ${
              newMessage.trim() && !sending
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
            }`}
          >
            <Send className={`w-5 h-5 ${sending ? 'animate-pulse' : ''}`} />
          </motion.button>
        </form>
      </div>
    </div>
  );
}
