import { cache } from 'react'
import { getPlayerForUser } from './getPlayerForUser'
import { getMatchesForSeason } from './getMatchesForSeason'
import { calculatePlayerStats } from './calcPlayerStats'

export const getPlayerStatsForSeason = cache(
    async (seasonId: string | undefined) => {
        const player = await getPlayerForUser()
        if (!player) return null

        const matches = await getMatchesForSeason(typeof seasonId === "string" ? seasonId : "SeasonId undefined")

        const stats = calculatePlayerStats(player, matches)

        return {
            player,
            stats,
            goalTarget: player.goal_target ?? 30,
        }
    }
)
