import { Player, Match } from '@/app/types'

export function calculatePlayerStats(player: Player, matches: Match[]) {
    let goals = 0
    let wins = 0
    let matchesPlayed = 0
    let draws = 0

    for (const match of matches) {
        const inTeamA = match.team_a.includes(player.id)
        const inTeamB = match.team_b.includes(player.id)
        const played = inTeamA || inTeamB

        if (!played) continue

        matchesPlayed++

        goals += match.goals?.[player.id] ?? 0

        const won =
            (inTeamA && match.score_a > match.score_b) ||
            (inTeamB && match.score_b > match.score_a)

        if (won) wins++
        if (match.score_a === match.score_b) draws++
    }

    let winRatio = matchesPlayed > 0 ? `${((wins / matchesPlayed) * 100).toFixed(1)}%` : 0
    let goalsPerGame = matchesPlayed > 0 ? `${(goals / matchesPlayed).toFixed(1)}` : 0

    return { goals, wins, matchesPlayed, draws, winRatio, goalsPerGame }
}
