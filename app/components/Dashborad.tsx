'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getTrophy, getPlayerName } from "@/app/utils/playerHelpers";

type Player = {
    id: string;
    name: string;
};

type Match = {
    id: string;
    date: string;
    team_a: string[];
    team_b: string[];
    score_a: number;
    score_b: number;
    goals: Record<string, number>;
};

export default function Dashboard() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [matches, setMatches] = useState<Match[]>([]);
    const [goalsByPlayer, setGoalsByPlayer] = useState<Record<string, number>>({});
    const [winsByPlayer, setWinsByPlayer] = useState<Record<string, number>>({});
    const [matchesPlayed, setMatchesPlayed] = useState<Record<string, number>>({});
    const [ showAll, setShowAll] = useState(false);

    const lastMatch = matches.length > 0
    ? [...matches].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        : null;

    const renderMatchTable = (match: Match) => {
        const renderTeam = (team: string[]) => (
            <table className="w-full text-sm border border-gray-300">
                <thead>
                <tr className="bg-gray-100 border-b">
                    <th className="p-2 text-left">Player</th>
                    <th className="p-2 text-left">Goals</th>
                </tr>
                </thead>
                <tbody>
                {team.map((playerId) => (
                    <tr key={playerId} className="border-b">
                        <td className="p-2">{getPlayerName(players, playerId)}</td>
                        <td className="p-2">{match.goals[playerId] || 0}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );

        return (
            <div className="bg-white shadow-md rounded-lg p-4 mb-6">
                <h2 className="text-xl font-semibold text-center mb-2">Last Match Summary</h2>
                <div className="text-center text-2xl font-bold mb-4">
                    <span className="text-base">Team A</span> {match.score_a} : {match.score_b} <span
                    className="text-base">Team B</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-semibold text-center mb-2">Team A</h3>
                        {renderTeam(match.team_a)}
                    </div>
                    <div>
                        <h3 className="font-semibold text-center mb-2">Team B</h3>
                        {renderTeam(match.team_b)}
                    </div>
                </div>
                <p className="text-xs text-gray-500 text-center mt-4">{new Date(match.date).toLocaleDateString()}</p>
            </div>
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            const { data: playersData } = await supabase.from('players').select('*');
            const { data: matchesData } = await supabase.from('matches').select('*');

            if (playersData) setPlayers(playersData);
            if (matchesData) setMatches(matchesData as Match[]);
        };

        fetchData();
    }, []);

    useEffect(() => {
        const goals: Record<string, number> = {};
        const wins: Record<string, number> = {};
        const appearances: Record<string, number> = {};

        matches.forEach((match) => {
            // Count goals
            for (const [playerId, goalCount] of Object.entries(match.goals)) {
                goals[playerId] = (goals[playerId] || 0) + goalCount;
            }

            //Count appearances
            [...match.team_a, ...match.team_b].forEach((playerId) => {
                appearances[playerId] = (appearances[playerId] || 0) + 1;
            });

            // Determine winner
            let winningTeam: string[] = [];
            if (match.score_a > match.score_b) winningTeam = match.team_a;
            else if (match.score_b > match.score_a) winningTeam = match.team_b;

            winningTeam.forEach((playerId) => {
                wins[playerId] = (wins[playerId] || 0) + 1;
            });
        });

        setGoalsByPlayer(goals);
        setWinsByPlayer(wins);
        setMatchesPlayed(appearances);
    }, [matches]);

    const getWinRatio = (id:string) => {
        const wins = winsByPlayer[id] || 0;
        const played = matchesPlayed[id] || 0;
        if (played == 0) return '0%';
        return `${((wins / played) * 100).toFixed(1)}%`;
    }

    const sortedGoals = Object.entries(goalsByPlayer).sort((a, b) => b[1] - a[1]).slice(0, 5);
    const sortedWins = Object.entries(winsByPlayer).sort((a, b) => b[1] - a[1]).slice(0, 5);

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">🏟️ Player Stats Dashboard - Umelka 2025</h1>
            {lastMatch && renderMatchTable(lastMatch)}

            <div className="text-center mb-6">
                <a href="/matches"
                   className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    📋 View All Matches
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-2">🥅 Top Scorers</h2>
                    <ul className="space-y-1">
                        {sortedGoals.map(([id, goals], index) => (
                            <li key={id} className="flex justify-between border-b py-1">
                                <span><span className="text-xl">{getTrophy(index)}</span> {getPlayerName(players, id)}</span>
                                <span className="text-sm text-gray-600">{goals} goals</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-2">🏆 Most Wins</h2>
                    <ul className="space-y-1">
                        {sortedWins.map(([id, wins], index) => (
                            <li key={id} className="flex justify-between border-b py-1">
                                <span><span className="text-xl">{getTrophy(index)}</span> {getPlayerName(players, id)}</span>
                                <span className="text-sm text-gray-600">{wins} wins</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="text-center mb-6 mt-6">
                <a href="/stats"
                   className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                    📋 View All Stats
                </a>
            </div>

        </div>
    );
}
