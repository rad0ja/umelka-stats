import { AllPlayerRecords, PlayerMatch } from "@/app/types";


export function playerMatchHistory(matchesData: PlayerMatch[]): AllPlayerRecords {
    const playerRecords: AllPlayerRecords = {};

    for (const match of matchesData) {
        const { id: match_id, date: match_date, score_a, score_b, team_a, team_b, goals: goals_scored_in_match } = match;

        // Process Team A players
        for (const player_id of team_a) {
            if (!playerRecords[player_id]) {
                playerRecords[player_id] = { matches: [] };
            }

            let team_result: 'Win' | 'Loss' | 'Draw';
            if (score_a > score_b) {
                team_result = 'Win';
            } else if (score_a < score_b) {
                team_result = 'Loss';
            } else {
                team_result = 'Draw'
            }

            const goals_by_this_player = goals_scored_in_match[player_id] || 0;

            playerRecords[player_id].matches.push({
                match_id,
                date: match_date,
                team_result,
                score: `${score_a}-${score_b}`,
                goals_scored: goals_by_this_player
            });
        }

        // Process Team B players
        for (const player_id of team_b) {
            if (!playerRecords[player_id]) {
                playerRecords[player_id] = { matches: [] };
            }

            let team_result: 'Win' | 'Loss' | 'Draw';
            if (score_b > score_a) {
                team_result = 'Win';
            } else if (score_b < score_a) {
                team_result = 'Loss';
            } else {
                team_result = 'Draw';
            }

            const goals_by_this_player = goals_scored_in_match[player_id] || 0;

            playerRecords[player_id].matches.push({
                match_id,
                date: match_date,
                team_result,
                score: `${score_b}-${score_a}`, // Score is shown from their perspective
                goals_scored: goals_by_this_player
            });
        }
    }

    return playerRecords;
}