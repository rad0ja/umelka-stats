import { getPlayerForUser } from '@/app/data/singlePlayer'
import { getMatchesForSeason } from '@/app/data/matches'
import { calculatePlayerStats } from '@/app/data/stats'
import React from "react";

export async function PlayerDataProvider({ seasonId, children }: {
    seasonId: string
    children: (data: any) => React.ReactNode
}) {
    const player = await getPlayerForUser()
    if (!player) return null

    const matches = await getMatchesForSeason(seasonId)
    const stats = calculatePlayerStats(player, matches)

    return children({
        player,
        stats,
        goalTarget: player.goal_target ?? 30,
    })
}
