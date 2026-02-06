import { motion } from 'motion/react'

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
      className="px-5 pb-4"
    >
      <div className="rounded-xl p-4" style={{ background: 'var(--stats-card)' }}>
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-white">Goal Target</span>
          <span className="text-sm" style={{ color: 'var(--stats-text-dim)' }}>
            {currentGoals} / {targetGoals}
          </span>
        </div>

        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: PROGRESS_ANIMATION_DELAY, duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
