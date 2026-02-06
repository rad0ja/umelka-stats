'use client'

import { useMemo } from 'react'
import { motion } from 'motion/react'
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
      <div className="h-full flex items-center justify-center">
        <p className="text-sm" style={{ color: 'var(--stats-text-dim)' }}>
          No stats available
        </p>
      </div>
    )
  }

  const { player, stats, goalTarget, winRate, avatar, goalProgress } = computedStats

  return (
    <div
      className="flex h-full flex-col bg-gray-50 dark:bg-gray-950"
      style={{ background: 'var(--stats-bg)' }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="shrink-0 dark:bg-gray-900 pt-14 pb-4 px-6 dark:border-gray-800"
      >
        <h1 className="stats-heading text-2xl text-white">Stats</h1>
      </motion.div>

      <div className="flex-1 min-h-0 overflow-y-auto relative z-10">
        <QuickStats winRate={winRate} currentGoals={stats.goals} targetGoals={goalTarget} />

        <div className="px-5 pb-4">
          <TopScorerCard name={player.name} goals={stats.goals} avatar={avatar} />
        </div>

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
