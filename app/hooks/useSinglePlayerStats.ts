'use client'

export function useSinglePlayerStats(data: {
    player: any
    stats: any
    goalTarget: number
}) {
    return {
        playerCalc: data.player,
        goalsCalc: data.stats.goals,
        winsCalc: data.stats.wins,
        matchesPlayedCalc: data.stats.matchesPlayed,
        drawsCalc: data.stats.draws,
        goalTarget: data.goalTarget,
    }
}
