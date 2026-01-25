'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, MessageCircle, ChevronDown } from 'lucide-react';
import { useEventChat } from './hooks/useEventChat';
import { ChatMessage } from './components/ChatMessage';

interface EventChatProps {
  eventId: string;
}

export function EventChat({ eventId }: EventChatProps) {
  const { messages, loading, currentUserId, sending, sendMessage, deleteMessage } = useEventChat(eventId);
  const [newMessage, setNewMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive (only if expanded)
  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (isExpanded) {
      scrollToBottom();
    }
  }, [messages, isExpanded]);

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
      <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm">
        <div className="text-gray-500 dark:text-gray-400 text-center py-4">
          Loading chat...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden">
      {/* Header - clickable to expand/collapse */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-5"
      >
        <div className="flex items-center gap-2">
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
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400" />
        </motion.div>
      </button>

      {/* Expandable content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-100 dark:border-gray-800">
              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                className="max-h-80 overflow-y-auto px-4 py-4"
              >
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-3">
                      <MessageCircle className="w-6 h-6 text-blue-500" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      No messages yet. Start the conversation!
                    </p>
                  </div>
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
                <form onSubmit={handleSubmit} className="flex items-end gap-2">
                  <div className="flex-1">
                    <textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      style={{ maxHeight: '100px' }}
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
