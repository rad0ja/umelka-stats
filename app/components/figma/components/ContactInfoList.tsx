import { LucideIcon } from 'lucide-react'

interface ContactInfoItem {
  icon: LucideIcon
  label: string
  value: string
  bgColor: string
  iconColor: string
}

interface ContactInfoListProps {
  items: ContactInfoItem[]
}

export function ContactInfoList({ items }: ContactInfoListProps) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm overflow-hidden">
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {items.map(({ icon: Icon, label, value, bgColor, iconColor }) => (
          <div key={label} className="p-4 flex items-center gap-4">
            <div className={`w-10 h-10 rounded-full ${bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</div>
              <div className="text-gray-900 dark:text-white">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
