import { Trophy, Target } from 'lucide-react'
import { StatCard } from './StatCard'

interface QuickStatsProps {
  winRate: string
  currentGoals: number
  targetGoals: number
}

export function QuickStats({ winRate, currentGoals, targetGoals }: QuickStatsProps) {
  return (
    <div className="px-5 pb-4">
      <div className="flex gap-3">
        <StatCard icon={Trophy} label="Win Rate" value={winRate} variant="win" />
        <StatCard
          icon={Target}
          label="Goals"
          value={`${currentGoals}/${targetGoals}`}
          variant="goal"
        />
      </div>
    </div>
  )
}
