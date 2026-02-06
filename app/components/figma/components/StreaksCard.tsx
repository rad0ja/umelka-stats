import { motion } from 'motion/react'
import { Flame, TrendingUp, TrendingDown, Target } from 'lucide-react'

interface Streaks {
  longestWinningStreak: number
  longestLosingStreak: number
  longestScoringStreak: number
  longestNonScoringStreak: number
}

interface StreaksCardProps {
  streaks: Streaks
}

const ANIMATION_DELAY = 0.35

const STREAK_ITEMS = [
  {
    icon: TrendingUp,
    colorClass: 'text-green-400',
    label: 'Win Streak',
    key: 'longestWinningStreak' as const,
  },
  {
    icon: TrendingDown,
    colorClass: 'text-red-400',
    label: 'Loss Streak',
    key: 'longestLosingStreak' as const,
  },
  {
    icon: Target,
    colorClass: 'text-purple-400',
    label: 'Scoring Streak',
    key: 'longestScoringStreak' as const,
  },
  {
    icon: Target,
    colorClass: 'text-gray-400',
    label: 'No Goals',
    key: 'longestNonScoringStreak' as const,
  },
] as const

export function StreaksCard({ streaks }: StreaksCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_DELAY }}
      className="px-5 pb-4"
    >
      <div className="rounded-xl p-4" style={{ background: 'var(--stats-card)' }}>
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          Streaks
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {STREAK_ITEMS.map(({ icon: Icon, colorClass, label, key }) => (
            <div key={key} className="flex items-center gap-2">
              <Icon className={`w-4 h-4 ${colorClass}`} />
              <div>
                <div className="stats-value text-2xl text-white">{streaks[key]}</div>
                <div className="text-xs" style={{ color: 'var(--stats-text-dim)' }}>
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
