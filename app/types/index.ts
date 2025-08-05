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

interface GoalRecord {
    [playerId : string]: number;
}

export interface PlayerMatch {
    id: string;
    date: string;
    team_a: string[];
    team_b: string[];
    score_a: number;
    score_b: number;
    goals: GoalRecord;
}

export interface PlayerMatchDetail {
    match_id: string;
    date: string;
    team_result: 'Win' | 'Loss' | 'Draw';
    score: string
    goals_scored: number
}

export interface PlayerRecord {
    matches: PlayerMatchDetail[];
}

export interface AllPlayerRecords {
    [playerId: string]: PlayerRecord;
}