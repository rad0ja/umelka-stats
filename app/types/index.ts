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
    assists: Record<string, number>;
    // Player who took the jerseys home to wash and bring to the next match
    jersey_player_id?: string | null;
    // Storage path of the photo of the whiteboard the score was tallied on (bucket `board-photos`)
    board_photo_path?: string | null;
};

export type PlayerStat = {
    id: string;
    name: string;
    goals: number;
    wins: number;
    matchesPlayed: number;
};

// A player's strength for team suggestions (see app/utils/teamSuggestion.ts).
// The per-stat values are already blended season + all-time and shrunk toward the group average.
export type PlayerRating = {
    id: string;
    name: string;
    rating: number;          // ~50 = average of the attending players, ±10 ≈ one standard deviation
    seasonMatches: number;
    allTimeMatches: number;
    winScore: number;        // (wins + draws/2) / matches
    goalsPerGame: number;
    assistsPerGame: number;
    form: string[];          // last results, newest first ('W' | 'D' | 'L')
    formScore: number;
};

export type TeamSplit = {
    teamA: string[];         // player ids
    teamB: string[];
    strengthA: number;       // sum of ratings + chemistry (+ odd-player compensation)
    strengthB: number;
    diff: number;            // |strengthA - strengthB|, lower = more balanced
    winChanceA: number;      // 0..1, rough estimate from the strength difference
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