// utils/form-utils.ts

import { Match } from "@/app/types";

export function getRecentForm(matches: Match[], players: string[], maxGames = 5): Record<string, string[]> {
    const formMap: Record<string, string[]> = {};

    // Sort by most recent
    const recentMatches = [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const playerId of players) {
        let form: string[] = [];

        for (const match of recentMatches) {
            if (form.length >= maxGames) break;

            const inTeamA = match.team_a.includes(playerId);
            const inTeamB = match.team_b.includes(playerId);

            if (!inTeamA && !inTeamB) continue;

            const didWin =
                (inTeamA && match.score_a > match.score_b) ||
                (inTeamB && match.score_b > match.score_a);

            form.push(didWin ? 'W' : "L");
        }

        formMap[playerId] = form;
    }

    return formMap;
}