import { LucideIcon } from 'lucide-react'

interface AchievementCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

export function AchievementCard({ icon: Icon, title, description, gradient }: AchievementCardProps) {
  return (
    <div className={`${gradient} rounded-2xl p-5 text-white shadow-lg`}>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white/20 dark:bg-white/10 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="font-semibold text-lg">{title}</div>
          <div className="text-sm opacity-90 dark:opacity-80">{description}</div>
        </div>
      </div>
    </div>
  )
}
