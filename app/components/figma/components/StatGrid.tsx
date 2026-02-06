interface StatItem {
  value: number
  label: string
  gradient: string
  color: string
}

interface StatGridProps {
  stats: StatItem[]
}

export function StatGrid({ stats }: StatGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {stats.map(({ value, label, gradient, color }) => (
        <div
          key={label}
          className={`text-center p-4 ${gradient} rounded-2xl`}
        >
          <div className={`text-3xl font-bold ${color} mb-1 tabular-nums`}>{value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
        </div>
      ))}
    </div>
  )
}
