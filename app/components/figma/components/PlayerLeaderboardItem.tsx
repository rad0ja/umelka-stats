'use client'

import { motion } from 'motion/react'
import { PlayerLeaderboardItemProps } from '../types/player-stats-types'

export function PlayerLeaderboardItem({ player, rank, index }: PlayerLeaderboardItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm active:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl font-bold text-gray-300 dark:text-gray-600 w-8">
          {rank}
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
          {player.avatar}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-gray-900 dark:text-white">{player.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">{player.position}</div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{player.goals}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Goals</div>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white">{player.assists}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Assists</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
