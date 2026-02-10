import { motion } from 'motion/react'
import { Flame, TrendingUp, TrendingDown, Target } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

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

interface StreakItem {
  icon: LucideIcon
  color: string
  bg: string
  label: string
  key: keyof Streaks
}

const STREAK_ITEMS: StreakItem[] = [
  {
    icon: TrendingUp,
    color: 'var(--stats-accent)',
    bg: 'var(--stats-accent-light)',
    label: 'Win Streak',
    key: 'longestWinningStreak',
  },
  {
    icon: TrendingDown,
    color: '#ef4444',
    bg: '#fef2f2',
    label: 'Loss Streak',
    key: 'longestLosingStreak',
  },
  {
    icon: Target,
    color: 'var(--stats-purple)',
    bg: 'var(--stats-purple-light)',
    label: 'Scoring Streak',
    key: 'longestScoringStreak',
  },
  {
    icon: Target,
    color: 'var(--stats-text-dim)',
    bg: '#f1f5f9',
    label: 'No Goals',
    key: 'longestNonScoringStreak',
  },
]

export function StreaksCard({ streaks }: StreaksCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_DELAY }}
    >
      <h2 className="text-xs font-semibold uppercase tracking-wider mb-2 px-1 flex items-center gap-1.5" style={{ color: 'var(--stats-text-dim)' }}>
        <Flame className="w-3.5 h-3.5" style={{ color: 'var(--stats-orange)' }} aria-hidden="true" />
        Streaks
      </h2>

      <div className="grid grid-cols-2 gap-2.5">
        {STREAK_ITEMS.map(({ icon: Icon, color, bg, label, key }) => (
          <div key={key} className="stats-glass-card rounded-2xl p-3.5">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: bg }}
              >
                <Icon className="w-4 h-4" style={{ color }} aria-hidden="true" />
              </div>
              <div className="min-w-0">
                <div className="stats-value text-2xl leading-none" style={{ color: 'var(--stats-text)' }}>
                  {streaks[key]}
                </div>
                <div className="text-xs font-medium truncate" style={{ color: 'var(--stats-text-dim)' }}>
                  {label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
