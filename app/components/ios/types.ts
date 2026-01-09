export interface Player {
    id: string;
    name: string;
    goals: number;
    avatar: string;
}

export interface Match {
    id: string;
    team1: string;
    team2: string;
    score1: number;
    score2: number;
    date: string;
    location: string;
    status: 'win' | 'loss' | 'draw';
    teamAIds: string[];
    teamBIds: string[];
    teamAPlayers?: Player[];
    teamBPlayers?: Player[];
}

export interface Event {
    id: number;
    title: string;
    opponent: string | null;
    date: string;
    time: string;
    location: string;
    players: number;
    needed: number;
}

export interface Stat {
    label: string;
    value: number | string;
    icon: string;
}

export interface PlayerStats {
    name: string;
    avatar: string;
    stats: Stat[];
}
