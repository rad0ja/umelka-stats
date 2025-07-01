'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { suggestBalancedTeams } from '@/app/utils/teamSuggestion';
import { PlayerStat } from '@/app/types'

export default function TeamSuggestionsPage() {
    const [playerStats, setPlayerStats] = useState<PlayerStat[]>([]);
    const [teamA, setTeamA] = useState<PlayerStat[]>([]);
    const [teamB, setTeamB] = useState<PlayerStat[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            //const { data: players } = await supabase.from('players').select('*');
            const { data: matches } = await supabase.from('matches').select('*');
            const players = [{"id":"56d7386b-39d2-4a14-ade4-83138a7b5c3b","name":"Jan Radoch"},
                {"id":"653c6fe7-2bb5-4ea5-8261-fb1aa6f6f6f0","name":"Martin Tomco"},
                {"id":"94b9795a-96d3-4deb-9181-e6fff5e0e96b","name":"Marek Janicek"},
                {"id":"1dc09b4d-f5f1-4c0b-8b74-8cae4555f666","name":"Miky Srubar"},
                {"id":"6e92368a-bc9c-4759-8020-7a0c31f7b003","name":"Martin Schwarz"},
                {"id":"fc8188a6-31e2-4f90-a00a-10b003c82b7c","name":"KOZLIK"},
                {"id":"f15a1855-7f95-4cb4-af6c-405ad4c074cd","name":"Vlada Gromotovic"},
                {"id":"f2434abe-b87c-48ed-9c8c-2a3d6961363a","name":"Lukas Aprias"},
                {"id":"8a53f15d-b18e-4407-9025-ece8cfdc6add","name":"Vaclav Jandek"},
                {"id":"b5a6e728-46ce-4af5-9713-64584c5848a1","name":"Martin Janota"},
                {"id":"ea4e3177-9b49-40cc-9058-b475fc0a92f9","name":"Jan Gunka"}]

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
                    if (statsMap[id]) statsMap[id].goals += count as number;
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
