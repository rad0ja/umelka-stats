'use client'

import { motion } from 'motion/react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  icon: LucideIcon
  label: string
  value: string
  variant: 'win' | 'goal'
}

const VARIANT_STYLES = {
  win: {
    iconBg: 'var(--stats-accent-light)',
    iconColor: 'var(--stats-accent)',
  },
  goal: {
    iconBg: 'var(--stats-purple-light)',
    iconColor: 'var(--stats-purple)',
  },
} as const

export function StatCard({ icon: Icon, label, value, variant }: StatCardProps) {
  const styles = VARIANT_STYLES[variant]

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: variant === 'win' ? 0.1 : 0.15 }}
      className="stats-glass-card flex-1 rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: styles.iconBg }}
        >
          <Icon className="w-3.5 h-3.5" style={{ color: styles.iconColor }} aria-hidden="true" />
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--stats-text-dim)' }}>
          {label}
        </span>
      </div>
      <div className="stats-value text-3xl" style={{ color: 'var(--stats-text)' }}>
        {value}
      </div>
    </motion.div>
  )
}
