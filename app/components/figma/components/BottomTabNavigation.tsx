'use client'

import { BarChart3, Calendar, User, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useKeyboardVisibility } from "../hooks/useKeyboardVisibilty";

export type TabType = 'stats' | 'matches' | 'chat' | 'profile';

type Tab = {
    id: TabType;
    label: string;
    icon: React.ElementType;
}

const tabs: Tab[] = [
    { id: 'stats', label: 'Stats', icon: BarChart3 },
    { id: 'matches', label: 'Matches', icon: Calendar },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: User },
];

type Props = {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
}

export function BottomTabNavigation({ activeTab, onTabChange }: Props) {
  const isKeyboardOpen = useKeyboardVisibility(); 
  
  if (isKeyboardOpen) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 safe-area-pb">
      <div className="flex items-center justify-around px-2 pt-2 pb-6">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;

          return (
            <motion.button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center gap-1 px-6 py-2 relative"
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
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};  