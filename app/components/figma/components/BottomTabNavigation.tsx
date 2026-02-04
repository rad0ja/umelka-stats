'use client'

import { BarChart3, Calendar, User, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Tab } from "../types/tab-types";

const tabs: Tab[] = [
    { id: 'stats', label: 'Stats', icon: BarChart3, href: '/stats' },
    { id: 'matches', label: 'Matches', icon: Calendar, href: '/matches' },
    { id: 'chat', label: 'Chat', icon: MessageCircle, href: '/chat' },
    { id: 'profile', label: 'Profile', icon: User, href: '/profile' },
];

export function BottomTabNavigation() {
  const pathname = usePathname();
  const activeTab = tabs.find(t => pathname.startsWith(t.href))?.id ?? 'stats';

  return (
    <div className="shrink-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 safe-area-pb">
      <div className="flex items-center justify-around px-2 pt-2 pb-2">
        {tabs.map(({ id, label, icon: Icon, href }) => {
          const isActive = activeTab === id;

          return (
            <Link key={id} href={href} scroll={false}>
              <motion.div
                aria-label={label}
                aria-current={isActive ? 'page' : undefined}
                className="flex flex-col items-center gap-1 px-6 py-2 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-lg"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{ scale: isActive ? 1 : 0.9, y: isActive ? -2 : 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon
                    className={`w-6 h-6 ${
                      isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  />
                </motion.div>

                <motion.span
                  animate={{ opacity: isActive ? 1 : 0.6 }}
                  className={`text-xs font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {label}
                </motion.span>

                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full"
                  />
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
