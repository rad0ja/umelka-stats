'use client'

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
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400">No stats available</p>
      </div>
    )
  }

  const { player, stats, goalTarget } = data
  const winRate = typeof stats.winRatio === 'string' ? stats.winRatio : `${stats.winRatio}%`
  const avatar = player.name.split(' ').map(n => n[0]).join('').toUpperCase()

  return (
    <div className="h-full overflow-y-auto pb-24 bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <div className="dark:bg-gray-900 pt-14 pb-6 px-6">
        <h1 className="text-2xl font-bold mb-1 dark:text-white">Stats</h1>
      </div>

      {/* Quick Stats */}
      <div className="px-4 pt-6 pb-4">
        <div className="flex gap-3">
          <StatCard
            icon={Trophy}
            label="Win Rate"
            value={winRate}
            color="bg-gradient-to-br from-yellow-400 to-orange-500 text-white"
          />
          <StatCard
            icon={Target}
            label="Goals"
            value={`${stats.goals}/${goalTarget}`}
            color="bg-gradient-to-br from-blue-500 to-blue-600 text-white"
          />
        </div>
      </div>

      {/* Player Highlight */}
      <div className="px-4 pb-4">
        <TopScorerCard
          name={player.name}
          goals={stats.goals}
          avatar={avatar}
        />
      </div>

      {/* Stats Summary */}
      <div className="px-4 pb-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm">
          <h2 className="text-lg font-semibold mb-3 dark:text-white">Season Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.matchesPlayed}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Matches Played</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.wins}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Wins</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.draws}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Draws</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.goalsPerGame}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Goals/Game</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
