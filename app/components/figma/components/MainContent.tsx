'use client'

import { Matches } from "../Matches"
import { PlayerStats } from "../PlayerStats"
import { Profile } from "../Profile"
import { PlayerStatsData } from "../types/player-stats-types"
import { TabType } from "./BottomTabNavigation"

type Props = {
    activeTab: TabType;
    playerStats: PlayerStatsData;
}

export default function MainContent({ activeTab, playerStats }: Props) {
    return (
        <div className="h-full">
            {activeTab === 'stats' && <PlayerStats data={playerStats} />}
            {activeTab === 'matches' && <Matches />}
            {activeTab === 'profile' && <Profile />}
        </div>
    )
}