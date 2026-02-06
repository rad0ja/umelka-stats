import { motion } from 'motion/react'
import { MessageCircle } from 'lucide-react'

interface EmptyChatStateProps {
  message?: string
  compact?: boolean
}

export function EmptyChatState({
  message = 'Be the first to start the conversation!',
  compact = false,
}: EmptyChatStateProps) {
  const iconSize = compact ? 'w-12 h-12' : 'w-16 h-16'
  const iconInnerSize = compact ? 'w-6 h-6' : 'w-8 h-8'
  const containerPadding = compact ? 'py-8' : ''

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center text-center ${containerPadding}`}
    >
      <div
        className={`${iconSize} rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ${compact ? 'mb-3' : 'mb-4'}`}
      >
        <MessageCircle className={`${iconInnerSize} text-blue-500`} />
      </div>
      {!compact && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No messages yet
        </h3>
      )}
      <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
    </motion.div>
  )
}
