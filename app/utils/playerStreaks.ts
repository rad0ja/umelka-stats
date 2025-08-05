import { PlayerMatchDetail } from "@/app/types";

export function playerStreaks(matches: PlayerMatchDetail[]) {
    let win = 0, maxWin = 0;
    let loss = 0, maxLoss = 0;
    let score = 0, maxScore = 0;
    let noScore = 0, maxNoScore = 0;

    for (const match of matches) {
        // win/loss streaks
        if (match.team_result === 'Win') {
            win ++; loss = 0;
        } else if (match.team_result === 'Loss') {
            loss++; win = 0;
        }
        maxWin = Math.max(maxWin, win);
        maxLoss = Math.max(maxLoss, loss);

        //scoring streaks
        if (match.goals_scored > 0) {
            score++; noScore = 0;
        } else {
            noScore++; score = 0;
        }
        maxScore = Math.max(maxScore, score);
        maxNoScore = Math.max(maxNoScore, noScore);
    }

    return {
        longestWinningStreak: maxWin,
        longestLosingStreak: maxLoss,
        longestScoringStreak: maxScore,
        longestNonScoringStreak: maxNoScore,
    };
}