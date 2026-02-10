import { motion } from 'motion/react'
import { Target } from 'lucide-react'

interface GoalProgressCardProps {
  currentGoals: number
  targetGoals: number
  progress: number
}

const ANIMATION_DELAY = 0.3
const PROGRESS_ANIMATION_DELAY = 0.5

export function GoalProgressCard({ currentGoals, targetGoals, progress }: GoalProgressCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_DELAY }}
      className="stats-glass-card rounded-2xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--stats-purple-light)' }}
          >
            <Target className="w-3.5 h-3.5" style={{ color: 'var(--stats-purple)' }} aria-hidden="true" />
          </div>
          <span className="text-sm font-semibold" style={{ color: 'var(--stats-text)' }}>
            Goal Target
          </span>
        </div>
        <span className="stats-value text-lg" style={{ color: 'var(--stats-text-secondary)' }}>
          {currentGoals}&nbsp;/&nbsp;{targetGoals}
        </span>
      </div>

      <div
        className="h-3 rounded-full overflow-hidden"
        style={{ background: '#e2e8f0' }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ delay: PROGRESS_ANIMATION_DELAY, duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, var(--stats-purple), #a78bfa)' }}
        />
      </div>

      {progress >= 100 && (
        <p className="text-xs font-semibold mt-2" style={{ color: 'var(--stats-accent)' }}>
          Target reached!
        </p>
      )}
    </motion.div>
  )
}
