'use client'

import { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { Match, Player } from './types';
import Link from 'next/link';

interface RecentMatchesProps {
    currentPlayerId: string;
}

export default function RecentMatches({ currentPlayerId }: RecentMatchesProps) {
    const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
    const [matches, setMatches] = useState<Match[]>([]);
    const [loadingMatchId, setLoadingMatchId] = useState<string | null>(null);

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
        <div>
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900">Recent Matches</h2>
                <button className="text-emerald-600 text-sm font-semibold">
                    See All
                </button>
                <Link className="text-emerald-600 text-sm font-semibold" href="/stats">
                    See Alles
                </Link>
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
                                                                <span className={`text-sm font-medium ${
                                                                    player.id === currentPlayerId ? "text-blue-600" : "text-gray-900"
                                                                }`}>
                                                                    {player.name}
                                                                </span>
                                                                <span className="text-xs font-bold px-1 py-1 rounded bg-green-500 text-white">
                                                                    W
                                                                </span>
                                                                <span className="text-xs font-bold px-1 py-1 rounded bg-green-500 text-white">
                                                                    L
                                                                </span>
                                                                <span className="text-xs font-bold px-1 py-1 rounded bg-green-500 text-white">
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
    );
}
