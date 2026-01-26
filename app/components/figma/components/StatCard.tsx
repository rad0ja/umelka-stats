'use client'

import { motion } from 'motion/react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  variant: 'win' | 'goal'
}

export function StatCard({ icon: Icon, label, value, variant }: StatCardProps) {
  const accentColor = variant === 'win' ? '#00ff87' : '#7c3aed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, delay: variant === 'win' ? 0.1 : 0.15 }}
      className="flex-1 rounded-xl p-4"
      style={{ background: 'var(--stats-card)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Icon className="w-5 h-5" style={{ color: accentColor }} />
        <span className="text-xs font-medium" style={{ color: 'var(--stats-text-dim)' }}>
          {label}
        </span>
      </div>
      <div className="stats-value text-3xl text-white">
        {value}
      </div>
    </motion.div>
  )
}
