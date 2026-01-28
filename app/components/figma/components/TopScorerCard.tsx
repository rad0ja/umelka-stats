'use client'

import { motion } from 'motion/react'

interface TopScorerCardProps {
  name: string
  goals: number
  avatar: string
}

export function TopScorerCard({ name, goals, avatar }: TopScorerCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="rounded-xl p-4"
      style={{ background: 'var(--stats-card)' }}
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold"
          style={{
            background: 'linear-gradient(135deg, #00ff87, #00cc6a)',
            color: '#0f1318',
          }}
          aria-hidden="true"
        >
          {avatar}
        </div>

        {/* Info */}
        <div className="flex-1">
          <div className="text-xs font-medium mb-1" style={{ color: '#00ff87' }}>
            Top Scorer
          </div>
          <div className="stats-heading text-xl text-white">
            {name}
          </div>
        </div>

        {/* Goals */}
        <div className="text-right">
          <div className="stats-value text-4xl text-white">{goals}</div>
          <div className="text-xs" style={{ color: 'var(--stats-text-dim)' }}>goals</div>
        </div>
      </div>
    </motion.div>
  )
}
