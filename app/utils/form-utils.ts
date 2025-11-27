// utils/form-utils.ts

import { Match } from "@/app/types";

export function getRecentForm(matches: Match[], players: string[], maxGames: number, upToDate?: string | Date): Record<string, string[]> {
    const formMap: Record<string, string[]> = {};

    // Optionally filter matches up to a specific date, then sort by most recent
    const cutoff = upToDate ? new Date(upToDate).getTime() : undefined;
    const recentMatches = [...matches]
        .filter(m => cutoff === undefined || new Date(m.date).getTime() <= cutoff)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const playerId of players) {
        let form: string[] = [];

        for (const match of recentMatches) {
            if (form.length >= maxGames) break;

            const inTeamA = match.team_a.includes(playerId);
            const inTeamB = match.team_b.includes(playerId);

            if (!inTeamA && !inTeamB) continue;

            const isDraw = match.score_a == match.score_b;

            const didWin =
                (inTeamA && match.score_a > match.score_b) ||
                (inTeamB && match.score_b > match.score_a);

            form.push(isDraw ? 'D'
                : didWin ? 'W'
                    : 'L');
        }

        formMap[playerId] = form;
    }

    return formMap;
}