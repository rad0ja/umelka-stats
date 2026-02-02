'use client'

import { Matches } from "../Matches"
import { PlayerStats } from "../PlayerStats"
import { Profile } from "../Profile"
import { Chat } from "../Chat"
import { PlayerStatsData } from "../types/player-stats-types"
import { TabType } from "./BottomTabNavigation"

type Props = {
    activeTab: TabType;
    playerStats: PlayerStatsData;
}

export default function MainContent({ activeTab, playerStats }: Props) {
    return (
        <div className="flex-1 min-h-0 safe-area-pt">
            {activeTab === 'stats' && <PlayerStats data={playerStats} />}
            {activeTab === 'matches' && <Matches />}
            {activeTab === 'chat' && <Chat />}
            {activeTab === 'profile' && <Profile />}
        </div>
    )
}