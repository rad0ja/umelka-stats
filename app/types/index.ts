export type Player = {
    id: string;
    name: string;
};

export type Match = {
    id: string;
    date: string;
    team_a: string[];
    team_b: string[];
    score_a: number;
    score_b: number;
    goals: Record<string, number>;
};

export type PlayerStat = {
    id: string;
    name: string;
    goals: number;
    wins: number;
    matchesPlayed: number;
};

export type SuggestedTeam = {
    players: PlayerStat[];
    totalScore: number;
};