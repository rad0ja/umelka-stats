'use client';

import { useEffect, useState } from 'react';
import MainContent from '../components/figma/components/MainContent';
import { BottomTabNavigation, TabType } from '../components/figma/components/BottomTabNavigation';
import { PlayerStatsData } from '../components/figma/types/player-stats-types';
import { registerPushToken } from '@/lib/firebase-client';

type Props = {
  playerStats: PlayerStatsData; // replace with real type
  userId?: string;
};

export default function AppShell({ playerStats, userId }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  useEffect(() => {
    if (userId) {
      registerPushToken(userId);
    }
  }, [userId]);

  useEffect(() => {
   const colors = {
    stats: '#aa0101',
    matches: '#0277bd',
    chat: '#2e7d32',
    profile: '#6a1b9a',
   };

   document.documentElement.style.setProperty('--bg-color', colors[activeTab]);
  }, [activeTab]);

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 relative overflow-y-hidden safe-area-pt min-h-[100dvh]">
      <MainContent
        activeTab={activeTab}
        playerStats={playerStats}
      />

      <BottomTabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
    </div>
  );
}
