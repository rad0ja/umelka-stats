import { Player } from '@/app/types';

type Match = {
    id: string;
    team_a: string[];
    team_b: string[];
    score_a: number;
    score_b: number;
    goals: { [playerId: string]: number };
    date: string;
};

export function getAllMVPs(players: Player[], matches: Match[]) {
    return players.map((player) => {
        let goals = 0;
        let wins = 0;
        let matchesPlayed = 0;

        matches.forEach((match) => {
            const inTeamA = match.team_a.includes(player.id);
            const inTeamB = match.team_b.includes(player.id);
            const hasPlayed = inTeamA || inTeamB;

            if (!hasPlayed) return;

            matchesPlayed++;

            const didWin =
                (inTeamA && match.score_a > match.score_b) ||
                (inTeamB && match.score_b > match.score_a);

            if (didWin) wins++;

            goals += match.goals?.[player.id] || 0;
        });

        const mvpScore = goals * 2 + wins * 1.5 + matchesPlayed;

        return {
            id: player.id,
            name: player.name,
            mvpScore,
        };
    });
}
