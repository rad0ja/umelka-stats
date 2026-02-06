import { motion } from 'motion/react'

interface SeasonSummaryProps {
  matchesPlayed: number
  wins: number
  draws: number
  goalsPerGame: string | number
}

const ANIMATION_DELAY = 0.25

export function SeasonSummary({ matchesPlayed, wins, draws, goalsPerGame }: SeasonSummaryProps) {
  const stats = [
    { label: 'Matches', value: matchesPlayed },
    { label: 'Wins', value: wins },
    { label: 'Draws', value: draws },
    { label: 'Goals/Game', value: goalsPerGame },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: ANIMATION_DELAY }}
      className="px-5 pb-4"
    >
      <div className="rounded-xl p-4" style={{ background: 'var(--stats-card)' }}>
        <h2 className="text-sm font-semibold text-white mb-4">Season Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          {stats.map(({ label, value }) => (
            <div key={label}>
              <div className="stats-value text-2xl text-white">{value}</div>
              <div className="text-xs" style={{ color: 'var(--stats-text-dim)' }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
