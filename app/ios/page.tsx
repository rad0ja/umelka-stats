'use client'

import { useState, useEffect } from 'react';
import { Menu, X, Home, Calendar, Users, Trophy, Bell, User, ChevronRight, MapPin, Clock, ChevronDown, ChevronUp, Cuboid } from 'lucide-react';

interface Player {
    id: string;
    name: string;
    goals: number;
    avatar: string;
}

interface Match {
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

interface Event {
    id: number;
    title: string;
    opponent: string | null;
    date: string;
    time: string;
    location: string;
    players: number;
    needed: number;
}

interface Stat {
    label: string;
    value: number | string;
    icon: string;
}

interface PlayerStats {
    name: string;
    avatar: string;
    stats: Stat[];
}

export default function FotbalekHomepage() {
    const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loadingMatchId, setLoadingMatchId] = useState<string | null>(null);
    const [currentPlayerId] = useState<string>("player1");
    const [activeTab, setActiveTab] = useState<'home' | 'matches' | 'teams' | 'stats'>('home');

    const fetchRecentMatches = async () => {
        const mockMatches: Match[] = [
            {
                id: "1",
                team1: "Team A",
                team2: "Team B",
                score1: 3,
                score2: 2,
                date: "2024-11-29",
                location: "Central Park Field",
                status: "win",
                teamAIds: ["player1", "player2", "player3", "player4", "player5"],
                teamBIds: ["player6", "player7", "player8", "player9", "player10"]
            },
            {
                id: "2",
                team1: "Team A",
                team2: "Team B",
                score1: 1,
                score2: 1,
                date: "2024-11-26",
                location: "Riverside Stadium",
                status: "draw",
                teamAIds: ["player1", "player2", "player3", "player4", "player5"],
                teamBIds: ["player6", "player7", "player8", "player9", "player10"]
            },
            {
                id: "3",
                team1: "Team A",
                team2: "Team B",
                score1: 2,
                score2: 4,
                date: "2024-11-23",
                location: "Downtown Arena",
                status: "loss",
                teamAIds: ["player1", "player2", "player3", "player4", "player5"],
                teamBIds: ["player6", "player7", "player8", "player9", "player10"]
            }
        ];

        setMatches(mockMatches);
    };

    useEffect(() => {
        fetchRecentMatches();
    }, []);

    const toggleAccordion = async (matchId: string) => {
        if (expandedMatch === matchId) {
            setExpandedMatch(null);
            return;
        }

        const match = matches.find(m => m.id === matchId);
        if (match && !match.teamAPlayers) {
            setLoadingMatchId(matchId);

            const mockPlayers = [
                { id: "player1", name: "John Doe" },
                { id: "player2", name: "Mike Smith" },
                { id: "player3", name: "Alex Johnson" },
                { id: "player4", name: "Chris Brown" },
                { id: "player5", name: "David Lee" },
                { id: "player6", name: "Tom Wilson" },
                { id: "player7", name: "Sam Davis" },
                { id: "player8", name: "Ryan Clark" },
                { id: "player9", name: "Paul Martinez" },
                { id: "player10", name: "Kevin White" }
            ];

            const mockGoals: Record<string, number> = {
                "player1": 2,
                "player2": 1,
                "player8": 1,
                "player9": 1
            };

            const getInitials = (name: string): string => {
                return name.split(' ').map(n => n[0]).join('');
            };

            const teamAPlayers: Player[] = match.teamAIds.map(id => {
                const player = mockPlayers.find(p => p.id === id);
                return {
                    id,
                    name: player?.name || "Unknown",
                    goals: mockGoals[id] || 0,
                    avatar: getInitials(player?.name || "??")
                };
            });

            const teamBPlayers: Player[] = match.teamBIds.map(id => {
                const player = mockPlayers.find(p => p.id === id);
                return {
                    id,
                    name: player?.name || "Unknown",
                    goals: mockGoals[id] || 0,
                    avatar: getInitials(player?.name || "??")
                };
            });

            setMatches(matches.map(m =>
                m.id === matchId
                    ? { ...m, teamAPlayers, teamBPlayers }
                    : m
            ));

            setLoadingMatchId(null);
        }

        setExpandedMatch(matchId);
    };

    const upcomingEvents: Event[] = [
        {
            id: 1,
            title: "Friendly Match",
            opponent: "White Knights",
            date: "2024-12-05",
            time: "18:00",
            location: "North Field",
            players: 12,
            needed: 14
        },
        {
            id: 2,
            title: "League Game",
            opponent: "Black Panthers",
            date: "2024-12-08",
            time: "15:30",
            location: "Main Stadium",
            players: 14,
            needed: 14
        }
    ];

    const playerStats: PlayerStats = {
        name: "John Doe",
        avatar: "JD",
        stats: [
            { label: "Matches", value: 28, icon: "⚽" },
            { label: "Goals", value: 12, icon: "⚽" },
            { label: "Assists", value: 8, icon: "🎯" },
            { label: "Win Rate", value: "64%", icon: "🏆" }
        ]
    };

    const formatDate = (dateStr: string): string => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const getStatusColor = (status: 'win' | 'loss' | 'draw'): string => {
        switch(status) {
            case 'win': return 'bg-green-500/10 text-green-600 border border-green-500/20';
            case 'loss': return 'bg-red-500/10 text-red-600 border border-red-500/20';
            case 'draw': return 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
            default: return 'bg-gray-500/10 text-gray-600 border border-gray-500/20';
        }
    };

    const getStatusText = (status: 'win' | 'loss' | 'draw'): string => {
        switch(status) {
            case 'win': return 'W';
            case 'loss': return 'L';
            case 'draw': return 'D';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 sm:max-w-4xl sm:mx-auto sm:p-6 pt-safe">
            {/* iOS-style Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200 pt-safe">
                <div className="px-4 pt-3 pb-2">
                    <div className="flex items-center justify-between mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                            <div className="text-white font-bold text-xl">⚽</div>
                        </div>
                        <button className="relative p-2">
                            <Bell className="w-6 h-6 text-gray-700" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">3</span>
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
                    <p className="text-sm text-gray-500">{playerStats.name}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="px-4 pb-24 space-y-6 mt-4">
                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-2">
                    {playerStats.stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-3 shadow-sm"
                        >
                            <div className="text-xl mb-1">{stat.icon}</div>
                            <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                            <div className="text-xs text-gray-500">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Recent Matches Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-bold text-gray-900">Recent Matches</h2>
                        <button className="text-emerald-600 text-sm font-semibold">
                            See All
                        </button>
                    </div>

                    <div className="space-y-3">
                        {matches.map((match: Match) => {
                            const playerInTeamA = match.teamAIds?.includes(currentPlayerId);
                            const playerInTeamB = match.teamBIds?.includes(currentPlayerId);
                            const isDraw = match.status === "draw";

                            return (
                                <div
                                    key={match.id}
                                    className="bg-white rounded-2xl shadow-sm overflow-hidden border-l-4 border-green-500/10"
                                >
                                    <div
                                        className="p-4"
                                        onClick={() => toggleAccordion(match.id)}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs text-gray-500">{formatDate(match.date)}</span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(match.status)}`}>
                        {getStatusText(match.status)}
                      </span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-gray-900">{match.team1}</span>
                                                    <span className="text-2xl font-bold text-emerald-600">{match.score1}</span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-lg font-bold text-gray-900">{match.team2}</span>
                                                    <span className="text-2xl font-bold text-gray-500">{match.score2}</span>
                                                </div>
                                            </div>

                                            <ChevronDown
                                                className={`w-5 h-5 text-gray-400 transition-transform ${
                                                    expandedMatch === match.id ? "rotate-180" : ""
                                                }`}
                                            />
                                        </div>

                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-2">
                                            <MapPin className="w-3 h-3" />
                                            {match.location}
                                        </div>
                                    </div>

                                    {expandedMatch === match.id && (
                                        <div className="px-4 pb-4 border-t border-gray-100">
                                            {loadingMatchId === match.id ? (
                                                <p className="text-gray-500 text-center py-4 text-sm">Loading...</p>
                                            ) : (
                                                <div className="space-y-3 mt-3">
                                                    {/* Team A */}
                                                    <div
                                                        className={`rounded-xl p-3 ${
                                                            isDraw
                                                                ? "bg-orange-500/5"
                                                                : playerInTeamA
                                                                    ? match.status === "win"
                                                                        ? "bg-green-500/5"
                                                                        : "bg-red-500/5"
                                                                    : "bg-gray-50"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-6 h-6 bg-emerald-500 rounded-lg flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">A</span>
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-900">{match.team1}</span>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            {match.teamAPlayers?.map((player: Player) => (
                                                                <div
                                                                    key={player.id}
                                                                    className={`flex items-center justify-between p-2 rounded-lg ${
                                                                        player.id === currentPlayerId
                                                                            ? "bg-blue-500/10 border border-blue-500/20"
                                                                            : "bg-white/50"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        {/*<div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">*/}
                                                                        {/*    {player.avatar}*/}
                                                                        {/*</div>*/}
                                                                        <span className={`text-sm font-medium ${
                                                                            player.id === currentPlayerId ? "text-blue-600" : "text-gray-900"
                                                                        }`}>
                                      {player.name}
                                    </span>
                                                                        <span className="text-xs font-bold px-1 py-1 rounded bg-green-500 text-white">
                                                                            W
                                                                        </span><span className="text-xs font-bold px-1 py-1 rounded bg-green-500 text-white">
                                                                            L
                                                                        </span><span className="text-xs font-bold px-1 py-1 rounded bg-green-500 text-white">
                                                                            D
                                                                        </span>
                                                                    </div>
                                                                    {player.goals > 0 && (
                                                                        <span className="text-xs font-semibold text-emerald-600">
                                      ⚽ {player.goals}
                                    </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Team B */}
                                                    <div
                                                        className={`rounded-xl p-3 ${
                                                            isDraw
                                                                ? "bg-orange-500/5"
                                                                : playerInTeamB
                                                                    ? match.status === "win"
                                                                        ? "bg-green-500/5"
                                                                        : "bg-red-500/5"
                                                                    : "bg-gray-50"
                                                        }`}
                                                    >
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-6 h-6 bg-gray-500 rounded-lg flex items-center justify-center">
                                                                <span className="text-white text-xs font-bold">B</span>
                                                            </div>
                                                            <span className="text-sm font-semibold text-gray-900">{match.team2}</span>
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            {match.teamBPlayers?.map((player: Player) => (
                                                                <div
                                                                    key={player.id}
                                                                    className={`flex items-center justify-between p-2 rounded-lg ${
                                                                        player.id === currentPlayerId
                                                                            ? "bg-blue-500/10 border border-blue-500/20"
                                                                            : "bg-white/50"
                                                                    }`}
                                                                >
                                                                    <div className="flex items-center gap-2">
                                                                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                                                                            {player.avatar}
                                                                        </div>
                                                                        <span className={`text-sm font-medium ${
                                                                            player.id === currentPlayerId ? "text-blue-600" : "text-gray-900"
                                                                        }`}>
                                      {player.name}
                                    </span>
                                                                    </div>
                                                                    {player.goals > 0 && (
                                                                        <span className="text-xs font-semibold text-emerald-600">
                                      ⚽ {player.goals}
                                    </span>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Upcoming Events Section */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-xl font-bold text-gray-900">Upcoming</h2>
                        <button className="text-emerald-600 text-sm font-semibold">
                            View All
                        </button>
                    </div>

                    <div className="space-y-3">
                        {upcomingEvents.map((event: Event) => (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl p-4 shadow-sm"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{event.title}</h3>
                                        {event.opponent && (
                                            <p className="text-sm text-gray-500">vs {event.opponent}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-medium text-gray-900">{formatDate(event.date)}</p>
                                        <p className="text-xs text-gray-500">{event.time}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                    <MapPin className="w-3 h-3" />
                                    {event.location}
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                            <span>Players</span>
                                            <span className="font-semibold text-gray-900">{event.players}/{event.needed}</span>
                                        </div>
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${event.players >= event.needed ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                                                style={{width: `${Math.min((event.players / event.needed) * 100, 100)}%`}}
                                            ></div>
                                        </div>
                                    </div>
                                    <button className="ml-3 px-4 py-1.5 bg-emerald-500 text-white text-sm font-semibold rounded-full">
                                        Join
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* iOS-style Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200 pb-safe">
                <div className="flex justify-around items-center h-16 px-4">
                    <button
                        onClick={() => setActiveTab('home')}
                        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}
                    >
                        <Home className="w-6 h-6" />
                        <span className="text-xs font-medium">Home</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('matches')}
                        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'matches' ? 'text-emerald-600' : 'text-gray-400'}`}
                    >
                        <Calendar className="w-6 h-6" />
                        <span className="text-xs font-medium">Matches</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('teams')}
                        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'teams' ? 'text-emerald-600' : 'text-gray-400'}`}
                    >
                        <Users className="w-6 h-6" />
                        <span className="text-xs font-medium">Teams</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('stats')}
                        className={`flex flex-col items-center justify-center gap-1 ${activeTab === 'stats' ? 'text-emerald-600' : 'text-gray-400'}`}
                    >
                        <Trophy className="w-6 h-6" />
                        <span className="text-xs font-medium">Stats</span>
                    </button>
                </div>
            </div>
        </div>
    );
}