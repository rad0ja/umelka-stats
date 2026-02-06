import { Player, Match, PlayerMatchDetail } from '@/app/types'
import { playerStreaks } from '@/app/utils/playerStreaks'

export function calculatePlayerStats(player: Player, matches: Match[]) {
    let goals = 0
    let wins = 0
    let matchesPlayed = 0
    let draws = 0
    const matchDetails: PlayerMatchDetail[] = []

    for (const match of matches) {
        const inTeamA = match.team_a.includes(player.id)
        const inTeamB = match.team_b.includes(player.id)
        const played = inTeamA || inTeamB

        if (!played) continue

        matchesPlayed++

        const playerGoals = match.goals?.[player.id] ?? 0
        goals += playerGoals

        const won =
            (inTeamA && match.score_a > match.score_b) ||
            (inTeamB && match.score_b > match.score_a)
        const isDraw = match.score_a === match.score_b

        if (won) wins++
        if (isDraw) draws++

        const teamResult: 'Win' | 'Loss' | 'Draw' = won ? 'Win' : isDraw ? 'Draw' : 'Loss'
        const score = inTeamA
            ? `${match.score_a}-${match.score_b}`
            : `${match.score_b}-${match.score_a}`

        matchDetails.push({
            match_id: match.id,
            date: match.date,
            team_result: teamResult,
            score,
            goals_scored: playerGoals,
        })
    }

    const winRatio = matchesPlayed > 0 ? `${((wins / matchesPlayed) * 100).toFixed(1)}%` : 0
    const goalsPerGame = matchesPlayed > 0 ? `${(goals / matchesPlayed).toFixed(1)}` : 0
    const streaks = playerStreaks(matchDetails)

    return { goals, wins, matchesPlayed, draws, winRatio, goalsPerGame, streaks }
}
