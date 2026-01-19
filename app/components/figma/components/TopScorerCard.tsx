'use client'

import { motion } from 'motion/react'
import { TopScorerCardProps } from '../types/player-stats-types'

export function TopScorerCard({ name, goals, avatar }: TopScorerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-green-600/50 to-emerald-800/50 rounded-3xl p-6 text-white shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm opacity-80 mb-1">Top Scorer</div>
          <div className="text-2xl font-bold mb-1">{name}</div>
          <div className="text-lg opacity-90">{goals} Goals</div>
        </div>
        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
          {avatar}
        </div>
      </div>
    </motion.div>
  )
}
