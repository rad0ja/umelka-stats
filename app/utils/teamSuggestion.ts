// lib/teamSuggestion.ts
'use client'

import { PlayerStat, SuggestedTeam} from "@/app/types";

export function suggestBalancedTeams(players: PlayerStat[]): [SuggestedTeam, SuggestedTeam] {
    // 1. Calculate a weighted score for each player
    const scoredPlayers = players.map((p) => ({
        ...p,
        score: p.goals * 2 + p.wins * 1.5 + p.matchesPlayed
    }));

    // 2. Sort by score descending
    scoredPlayers.sort((a, b) => b.score - a.score);

    console.log(scoredPlayers)

    // 3. Distribute players alternating to balance score
    const teamA: SuggestedTeam = { players: [], totalScore: 0 };
    const teamB: SuggestedTeam = { players: [], totalScore: 0 };

    scoredPlayers.forEach((player) => {
        if (teamA.totalScore <= teamB.totalScore) {
            teamA.players.push(player);
            teamA.totalScore += player.score;
        } else {
            teamB.players.push(player);
            teamB.totalScore += player.score;
        }
    });

    return [teamA, teamB];
}
