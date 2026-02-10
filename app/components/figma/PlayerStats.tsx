'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'
import { Activity } from 'lucide-react'
import { QuickStats } from './components/QuickStats'
import { TopScorerCard } from './components/TopScorerCard'
import { SeasonSummary } from './components/SeasonSummary'
import { GoalProgressCard } from './components/GoalProgressCard'
import { StreaksCard } from './components/StreaksCard'
import { PlayerStatsData } from './types/player-stats-types'

interface PlayerStatsProps {
  data: PlayerStatsData | null
}

export function PlayerStats({ data }: PlayerStatsProps) {
  const computedStats = useMemo(() => {
    if (!data) return null

    const { player, stats, goalTarget } = data
    const winRate = typeof stats.winRatio === 'string' ? stats.winRatio : `${stats.winRatio}%`
    const avatar = player.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
    const goalProgress = Math.min((stats.goals / goalTarget) * 100, 100)

    return {
      player,
      stats,
      goalTarget,
      winRate,
      avatar,
      goalProgress,
    }
  }, [data])

  if (!computedStats) {
    return (
      <div className="h-full flex items-center justify-center" style={{ background: 'var(--stats-bg)' }}>
        <div className="text-center">
          <Activity className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--stats-text-dim)' }} aria-hidden="true" />
          <p className="text-sm font-medium" style={{ color: 'var(--stats-text-dim)' }}>
            No stats available yet
          </p>
        </div>
      </div>
    )
  }

  const { player, stats, goalTarget, winRate, avatar, goalProgress } = computedStats

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: 'var(--stats-bg)' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="shrink-0 pt-14 pb-2 px-6"
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--stats-accent-light)' }}
          >
            <Activity className="w-4 h-4" style={{ color: 'var(--stats-accent)' }} aria-hidden="true" />
          </div>
          <h1 className="stats-heading text-2xl" style={{ color: 'var(--stats-text)' }}>
            Your Stats
          </h1>
        </div>
      </motion.div>

      {/* Scrollable Content */}
      <div className="flex-1 min-h-0 overflow-y-auto relative z-10 px-5 pt-3 pb-6 space-y-3">
        <QuickStats winRate={winRate} currentGoals={stats.goals} targetGoals={goalTarget} />

        <TopScorerCard name={player.name} goals={stats.goals} avatar={avatar} />

        <SeasonSummary
          matchesPlayed={stats.matchesPlayed}
          wins={stats.wins}
          draws={stats.draws}
          goalsPerGame={stats.goalsPerGame}
        />

        <GoalProgressCard
          currentGoals={stats.goals}
          targetGoals={goalTarget}
          progress={goalProgress}
        />

        {stats.streaks && <StreaksCard streaks={stats.streaks} />}
      </div>
    </div>
  )
}
