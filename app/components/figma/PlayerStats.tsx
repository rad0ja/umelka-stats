'use client'

import { motion } from 'motion/react'
import { Trophy, Target } from 'lucide-react'
import { StatCard } from './components/StatCard'
import { TopScorerCard } from './components/TopScorerCard'
import { PlayerStatsData } from './types/player-stats-types'

interface PlayerStatsProps {
  data: PlayerStatsData | null
}

export function PlayerStats({ data }: PlayerStatsProps) {
  if (!data) {
    return (
      <div
        className="h-full flex items-center justify-center"
        style={{ background: 'var(--stats-bg)' }}
      >
        <p className="text-sm" style={{ color: 'var(--stats-text-dim)' }}>
          No stats available
        </p>
      </div>
    )
  }

  const { player, stats, goalTarget } = data
  const winRate = typeof stats.winRatio === 'string' ? stats.winRatio : `${stats.winRatio}%`
  const avatar = player.name.split(' ').map(n => n[0]).join('').toUpperCase()
  const goalProgress = Math.min((stats.goals / goalTarget) * 100, 100)

  return (
    <div
      className="flex h-full flex-col bg-gray-50 dark:bg-gray-950"
      style={{ background: 'var(--stats-bg)' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-50
    bg-white dark:bg-gray-900
    pt-14 pb-4 px-6
    border-b border-gray-100 dark:border-gray-800"
      >
        <h1 className="stats-heading text-2xl text-white">Stats</h1>
      </motion.div>

      {/* Quick Stats */}
      <div className="px-5 pb-4">
        <div className="flex gap-3">
          <StatCard
            icon={Trophy}
            label="Win Rate"
            value={winRate}
            variant="win"
          />
          <StatCard
            icon={Target}
            label="Goals"
            value={`${stats.goals}/${goalTarget}`}
            variant="goal"
          />
        </div>
      </div>

      {/* Player Card */}
      <div className="px-5 pb-4">
        <TopScorerCard
          name={player.name}
          goals={stats.goals}
          avatar={avatar}
        />
      </div>

      {/* Season Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="px-5 pb-4"
      >
        <div className="rounded-xl p-4" style={{ background: 'var(--stats-card)' }}>
          <h2 className="text-sm font-semibold text-white mb-4">Season Summary</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="stats-value text-2xl text-white">{stats.matchesPlayed}</div>
              <div className="text-xs" style={{ color: 'var(--stats-text-dim)' }}>Matches</div>
            </div>
            <div>
              <div className="stats-value text-2xl text-white">{stats.wins}</div>
              <div className="text-xs" style={{ color: 'var(--stats-text-dim)' }}>Wins</div>
            </div>
            <div>
              <div className="stats-value text-2xl text-white">{stats.draws}</div>
              <div className="text-xs" style={{ color: 'var(--stats-text-dim)' }}>Draws</div>
            </div>
            <div>
              <div className="stats-value text-2xl text-white">{stats.goalsPerGame}</div>
              <div className="text-xs" style={{ color: 'var(--stats-text-dim)' }}>Goals/Game</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Goal Progress */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="px-5 pb-4"
      >
        <div className="rounded-xl p-4" style={{ background: 'var(--stats-card)' }}>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-white">Goal Target</span>
            <span className="text-sm" style={{ color: 'var(--stats-text-dim)' }}>
              {stats.goals} / {goalTarget}
            </span>
          </div>

          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${goalProgress}%` }}
              transition={{ delay: 0.5, duration: 0.6, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #7c3aed, #a855f7)' }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}
