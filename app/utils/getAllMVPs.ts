import { Player } from '@/app/types';

type Match = {
    id: string;
    team_a: string[];
    team_b: string[];
    score_a: number;
    score_b: number;
    goals: { [playerId: string]: number };
    date: string;
    assists: { [playerId: string]: number };
};

export function getAllMVPs(players: Player[], matches: Match[]) {
    return players.map((player) => {
        let goals = 0;
        let wins = 0;
        let matchesPlayed = 0;
        let assists = 0;

        matches.forEach((match) => {
            const inTeamA = match.team_a.includes(player.id);
            const inTeamB = match.team_b.includes(player.id);
            if (!inTeamA && !inTeamB) return;

            matchesPlayed++;

            const didWin =
                (inTeamA && match.score_a > match.score_b) ||
                (inTeamB && match.score_b > match.score_a);

            if (didWin) wins++;

            goals += match.goals?.[player.id] || 0;

            assists += match.assists?.[player.id] || 0;
        });

        let mvpScore = 0;

        if (matchesPlayed > 0) {
            const goalRate = goals / matchesPlayed;
            const assistRate = assists / matchesPlayed;
            const winRate = wins / matchesPlayed;

            mvpScore =
                (goalRate * 40) +
                (assistRate * 20) +
                (winRate * 25) +
                (Math.log1p(matchesPlayed) * 10) +
                (goals * 2) +
                (assists * 2);

            /*mvpScore = Math.min(100, Number(mvpScore.toFixed(2)));*/
        }

        return {
            id: player.id,
            name: player.name,
            goals,
            assists,
            wins,
            matchesPlayed,
            mvpScore,
        };
    });
}
