'use client';

import { useState } from 'react';
import MainContent from '../components/figma/components/MainContent';
import { BottomTabNavigation, TabType } from '../components/figma/components/BottomTabNavigation';
import { PlayerStatsData } from '../components/figma/types/player-stats-types';

type Props = {
  playerStats: PlayerStatsData; // replace with real type
};

export default function AppShell({ playerStats }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>('stats');

  return (
    <div className="w-full max-w-md mx-auto bg-gray-50 relative overflow-y-hidden safe-area-inset min-h-[100dvh]">
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
