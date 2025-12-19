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

export interface PlayerStatsProps {
    data: {
        player: any
        stats: {
            goals: number
            wins: number
            matchesPlayed: number
            draws: number
        }
        goalTarget: number
}}
export interface HomeMatch {
    id: number;
    team1: string;
    team2: string;
    score1: number;
    score2: number;
    date: string;
    location: string;
    status: 'win' | 'loss' | 'draw';
}

export interface HomeEvent {
    id: number;
    title: string;
    opponent: string | null;
    date: string;
    time: string;
    location: string;
    players: number;
    needed: number;
}

export interface HomeStat {
    label: string;
    value: number | string;
    icon: string;
}

export interface HomePlayerStats {
    name: string;
    avatar: string;
    stats: HomeStat[];
}

export type HomeMatchStatus = 'win' | 'loss' | 'draw';
