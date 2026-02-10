'use client'

import { motion } from 'motion/react'
import { Zap } from 'lucide-react'

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
      className="stats-glass-card rounded-2xl p-4"
    >
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold shrink-0"
          style={{
            background: 'linear-gradient(135deg, var(--stats-accent), #059669)',
            color: '#ffffff',
          }}
          aria-hidden="true"
        >
          {avatar}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="stats-badge mb-1" style={{ background: 'var(--stats-accent-light)', color: 'var(--stats-accent)' }}>
            <Zap className="w-3 h-3" aria-hidden="true" />
            Top Scorer
          </div>
          <div className="stats-heading text-lg truncate" style={{ color: 'var(--stats-text)' }}>
            {name}
          </div>
        </div>

        {/* Goals */}
        <div className="text-right shrink-0">
          <div className="stats-value text-4xl" style={{ color: 'var(--stats-text)' }}>{goals}</div>
          <div className="text-xs font-medium" style={{ color: 'var(--stats-text-dim)' }}>goals</div>
        </div>
      </div>
    </motion.div>
  )
}
