'use client';

import { motion } from 'motion/react';
import { Trash2 } from 'lucide-react';

type BaseChatMessage = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  player_name: string;
};

type Props = {
  message: BaseChatMessage;
  isOwnMessage: boolean;
  index: number;
  onDelete?: (messageId: string) => void;
};

export function ChatMessage({ message, isOwnMessage, index, onDelete }: Props) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isYesterday) {
      return `Yesterday ${date.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })}`;
    }

    return date.toLocaleDateString('cs-CZ', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.02, type: 'spring', stiffness: 400, damping: 25 }}
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[80%] ${
          isOwnMessage
            ? 'bg-blue-500 text-white rounded-2xl rounded-br-md'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-2xl rounded-bl-md shadow-sm'
        } px-4 py-2.5 relative group`}
      >
        {!isOwnMessage && (
          <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 mb-1">
            {message.player_name}
          </p>
        )}

        <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
          {message.content}
        </p>

        <p
          className={`text-xs mt-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {formatTime(message.created_at)}
        </p>

        {isOwnMessage && onDelete && (
          <motion.button
            initial={{ opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onDelete(message.id)}
            aria-label="Delete message"
            className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
