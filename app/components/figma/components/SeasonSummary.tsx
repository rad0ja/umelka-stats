import { motion } from 'motion/react'
import { Calendar, Trophy, Minus, Crosshair } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface SeasonSummaryProps {
  matchesPlayed: number
  wins: number
  draws: number
  goalsPerGame: string | number
}

const ANIMATION_DELAY = 0.25

interface SummaryStat {
  label: string
  key: string
  icon: LucideIcon
  color: string
  bg: string
}

const SUMMARY_STATS: SummaryStat[] = [
  { label: 'Matches', key: 'matchesPlayed', icon: Calendar, color: 'var(--stats-accent)', bg: 'var(--stats-accent-light)' },
  { label: 'Wins', key: 'wins', icon: Trophy, color: 'var(--stats-orange)', bg: 'var(--stats-orange-light)' },
  { label: 'Draws', key: 'draws', icon: Minus, color: 'var(--stats-text-dim)', bg: '#f1f5f9' },
  { label: 'Goals/Game', key: 'goalsPerGame', icon: Crosshair, color: 'var(--stats-purple)', bg: 'var(--stats-purple-light)' },
]

export function SeasonSummary({ matchesPlayed, wins, draws, goalsPerGame }: SeasonSummaryProps) {
  const values: Record<string, number | string> = { matchesPlayed, wins, draws, goalsPerGame }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_DELAY }}
    >
      <h2 className="text-xs font-semibold uppercase tracking-wider mb-2 px-1" style={{ color: 'var(--stats-text-dim)' }}>
        Season Summary
      </h2>
      <div className="grid grid-cols-2 gap-2.5">
        {SUMMARY_STATS.map(({ label, key, icon: Icon, color, bg }) => (
          <div key={key} className="stats-glass-card rounded-2xl p-3.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center mb-2.5"
              style={{ background: bg }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color }} aria-hidden="true" />
            </div>
            <div className="stats-value text-2xl" style={{ color: 'var(--stats-text)' }}>
              {values[key]}
            </div>
            <div className="text-xs font-medium" style={{ color: 'var(--stats-text-dim)' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
