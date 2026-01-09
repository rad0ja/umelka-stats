'use client';

import { useState } from 'react';
import { BarChart3, Calendar, User } from 'lucide-react';
import { motion } from 'motion/react';
import { PlayerStats } from '@/app/components/figma/PlayerStats';
import { Matches } from '@/app/components/figma/Matches';
import { Profile } from '@/app/components/figma/Profile';

type TabType = 'stats' | 'matches' | 'profile';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  const tabs = [
    { id: 'stats' as TabType, label: 'Stats', icon: BarChart3 },
    { id: 'matches' as TabType, label: 'Matches', icon: Calendar },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen w-full max-w-md mx-auto bg-gray-50 relative overflow-hidden">
      {/* Main Content */}
      <div className="h-full">
        {activeTab === 'stats' && <PlayerStats />}
        {activeTab === 'matches' && <Matches />}
        {activeTab === 'profile' && <Profile />}
      </div>

      {/* iOS-style Bottom Tab Navigation */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 safe-area-pb">
        <div className="flex items-center justify-around px-2 pt-2 pb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col items-center justify-center gap-1 px-6 py-2 relative"
                whileTap={{ scale: 0.9 }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? 1 : 0.9,
                    y: isActive ? -2 : 0,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      isActive ? 'text-gray-900' : 'text-gray-400'
                    }`}
                  />
                </motion.div>
                <motion.span
                  animate={{
                    opacity: isActive ? 1 : 0.6,
                    scale: isActive ? 1 : 0.9,
                  }}
                  className={`text-xs font-medium ${
                    isActive ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  {tab.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-gray-900 rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}