import { motion } from 'motion/react'
import { Send } from 'lucide-react'

interface MessageInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onKeyDown: (e: React.KeyboardEvent) => void
  sending: boolean
  placeholder?: string
  name?: string
  maxHeight?: string
}

export function MessageInput({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  sending,
  placeholder = 'Type a message...',
  name = 'message',
  maxHeight = '120px',
}: MessageInputProps) {
  const canSubmit = value.trim() && !sending

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2">
      <div className="flex-1 relative">
        <textarea
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
          style={{ maxHeight }}
        />
      </div>

      <motion.button
        type="submit"
        disabled={!canSubmit}
        whileTap={{ scale: 0.9 }}
        aria-label="Send message"
        className={`p-3 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
          canSubmit
            ? 'bg-blue-500 text-white'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
        }`}
      >
        <Send className={`w-5 h-5 ${sending ? 'animate-pulse' : ''}`} />
      </motion.button>
    </form>
  )
}
