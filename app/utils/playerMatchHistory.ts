import { AllPlayerRecords, PlayerMatch } from "@/app/types";

function processTeam(
    playerRecords: AllPlayerRecords,
    players: string[],
    teamScore: number,
    oppScore: number,
    goals: Record<string, number>,
    match_id: string,
    match_date: string,
    teamLabel: "A" | "B"
) {
    players.forEach((player_id) => {
        if (!playerRecords[player_id]) {
            playerRecords[player_id] = { matches: [] };
        }

        let team_result: "Win" | "Loss" | "Draw";
        if (teamScore > oppScore) team_result = "Win";
        else if (teamScore < oppScore) team_result = "Loss";
        else team_result = "Draw";

        const goals_by_this_player = goals[player_id] || 0;

        playerRecords[player_id].matches.push({
            match_id,
            date: match_date,
            team_result,
            score: teamLabel === "A"
                ? `${teamScore}-${oppScore}`
                : `${teamScore}-${oppScore}`, // If you want, you could flip for B
            goals_scored: goals_by_this_player,
        });
    });
}

export function playerMatchHistory(matchesData: PlayerMatch[]): AllPlayerRecords {
    const playerRecords: AllPlayerRecords = {};

    for (const match of matchesData) {
        const {
            id: match_id,
            date: match_date,
            score_a,
            score_b,
            team_a,
            team_b,
            goals: goals_scored_in_match,
        } = match;

        processTeam(
            playerRecords,
            team_a,
            score_a,
            score_b,
            goals_scored_in_match,
            match_id,
            match_date,
            "A"
        );
        processTeam(
            playerRecords,
            team_b,
            score_b,
            score_a,
            goals_scored_in_match,
            match_id,
            match_date,
            "B"
        );
    }

    return playerRecords;
}