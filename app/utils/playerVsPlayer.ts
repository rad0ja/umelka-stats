import {Player} from "@/app/types";

interface Match {
    id: string;
    date: string;
    team_a: string[];
    team_b: string[];
    score_a: number;
    score_b: number;
    goals: Record<string, number>;
    season_id: number;
}

interface PlayerStats {
    wins: number;
    losses: number;
    draws: number;
}

interface PlayerResult {
    playerId: string | null;
    count: number;
}

interface ComputeResult {
    mostWinsWith: string | null;
    mostWinsWithName: string | null;
    winsCount: number;
    mostLossesWith: string | null;
    mostLossesWithName: string | null;
    lossesCount: number;
    mostDrawsWith: string | null;
    mostDrawsWithName: string | null;
    drawsCount: number;
    allPlayerStats: Record<string, PlayerStats>;
}

function buildPlayerMap(players: Player[]): Record<string, string> {
    return Object.fromEntries(
        players.map(player => [player.id, player.name])
    );
}

export function computeMostWinsLossesWith(matches: Match[], myPlayerId: string, players: Player[]): ComputeResult {

    const playerMap = buildPlayerMap(players);
    const playerStats: Record<string, PlayerStats> = {};

    matches.forEach(match => {
        const isTeamA = match.team_a.includes(myPlayerId);
        const isTeamB = match.team_b.includes(myPlayerId);

        // Skip if I'm not in this match
        if (!isTeamA && !isTeamB) return;

        const myTeam = isTeamA ? match.team_a : match.team_b;
        const myScore = isTeamA ? match.score_a : match.score_b;
        const opponentScore = isTeamA ? match.score_b : match.score_a;

        const didWin = myScore > opponentScore;
        const didLose = myScore < opponentScore;
        const isDraw = myScore === opponentScore;

        // Iterate through teammates (excluding myself)
        myTeam.forEach(playerId => {
            if (playerId === myPlayerId) return;

            if (!playerStats[playerId]) {
                playerStats[playerId] = { wins: 0, losses: 0, draws: 0 };
            }

            if (didWin) {
                playerStats[playerId].wins++;
            } else if (didLose) {
                playerStats[playerId].losses++;
            } else if (isDraw) {
                playerStats[playerId].draws++;
            }
        });
    });

    // Find player with most wins
    let mostWinsWith: PlayerResult = { playerId: null, count: 0 };
    // Find player with most losses
    let mostLossesWith: PlayerResult = { playerId: null, count: 0 };
    // Find player with most draws
    let mostDrawsWith: PlayerResult = { playerId: null, count: 0 };

    Object.entries(playerStats).forEach(([playerId, stats]) => {
        if (stats.wins > mostWinsWith.count) {
            mostWinsWith = { playerId, count: stats.wins };
        }
        if (stats.losses > mostLossesWith.count) {
            mostLossesWith = { playerId, count: stats.losses };
        }
        if (stats.draws > mostDrawsWith.count) {
            mostDrawsWith = { playerId, count: stats.draws };
        }
    });

    return {
        mostWinsWith: mostWinsWith.playerId,
        mostWinsWithName: mostWinsWith.playerId
            ? playerMap[mostWinsWith.playerId] ?? null
            : null,
        winsCount: mostWinsWith.count,

        mostLossesWith: mostLossesWith.playerId,
        mostLossesWithName: mostLossesWith.playerId
            ? playerMap[mostLossesWith.playerId] ?? null
            : null,
        lossesCount: mostLossesWith.count,

        mostDrawsWith: mostDrawsWith.playerId,
        mostDrawsWithName: mostDrawsWith.playerId
            ? playerMap[mostDrawsWith.playerId] ?? null
            : null,
        drawsCount: mostDrawsWith.count,

        allPlayerStats: playerStats
    };
}

// Example usage:
// const result = computeMostWinsLossesWith(matchesArray, "your-player-id-here");
// console.log(`Most wins with: ${result.mostWinsWith} (${result.winsCount} wins)`);
// console.log(`Most losses with: ${result.mostLossesWith} (${result.lossesCount} losses)`);
// console.log(`Most draws with: ${result.mostDrawsWith} (${result.drawsCount} draws)`);