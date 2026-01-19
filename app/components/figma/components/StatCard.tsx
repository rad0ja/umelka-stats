'use client'

import { motion } from 'motion/react'
import { StatCardProps } from '../types/player-stats-types'

export function StatCard({ icon: Icon, label, value, color }: StatCardProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={`flex-1 rounded-2xl p-4 ${color}`}
    >
      <Icon className="w-6 h-6 mb-2 opacity-80" />
      <div className="text-2xl font-semibold mb-1">{value}</div>
      <div className="text-sm opacity-70">{label}</div>
    </motion.div>
  )
}
