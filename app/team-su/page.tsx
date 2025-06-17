'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { suggestBalancedTeams, PlayerStat } from '@/app/utils/teamSuggestion';

export default function TeamSuggestionsPage() {
    const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
    const [teamA, setTeamA] = useState<PlayerStat[]>([]);
    const [teamB, setTeamB] = useState<PlayerStat[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const { data: players } = await supabase.from('players').select('*');
            const { data: matches } = await supabase.from('matches').select('*');

            if (!players || !matches) return;

            const statsMap: Record<string, PlayerStat> = {};
            players.forEach((p) => {
                statsMap[p.id] = {
                    id: p.id,
                    name: p.name,
                    goals: 0,
                    wins: 0,
                    matchesPlayed: 0,
                };
            });

            matches.forEach((match) => {
                [...match.team_a, ...match.team_b].forEach((id: string) => {
                    if (statsMap[id]) statsMap[id].matchesPlayed += 1;
                });

                Object.entries(match.goals).forEach(([id, count]) => {
                    if (statsMap[id]) statsMap[id].goals += count;
                });

                const winningTeam =
                    match.score_a > match.score_b ? match.team_a :
                        match.score_b > match.score_a ? match.team_b : [];

                winningTeam.forEach((id: string) => {
                    if (statsMap[id]) statsMap[id].wins += 1;
                });
            });

            const allStats = Object.values(statsMap);
            const [team1, team2] = suggestBalancedTeams(allStats);
            setPlayerStats(allStats);
            setTeamA(team1.players);
            setTeamB(team2.players);
        };

        fetchData();
    }, []);

    const renderTeam = (team: PlayerStat[], title: string) => (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
            <h2 className="text-lg font-bold mb-2">{title}</h2>
            <ul className="space-y-1 text-sm">
                {team.map((p) => (
                    <li key={p.id} className="flex justify-between">
                        <span>{p.name}</span>
                        <span className="text-right">
              🥅 {p.goals} | 🏆 {p.wins} | 🎯 {p.matchesPlayed}
            </span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">🤖 Suggested Teams</h1>
            <div className="grid md:grid-cols-2 gap-6">
                {renderTeam(teamA, 'Team A')}
                {renderTeam(teamB, 'Team B')}
            </div>
        </div>
    );
}
