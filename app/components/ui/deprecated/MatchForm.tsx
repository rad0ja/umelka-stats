'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type Player = {
    id: string;
    name: string;
};

export default function MatchForm() {
    const [players, setPlayers] = useState<Player[]>([]);
    const [teamA, setTeamA] = useState<string[]>([]);
    const [teamB, setTeamB] = useState<string[]>([]);
    const [scoreA, setScoreA] = useState<number>(0);
    const [scoreB, setScoreB] = useState<number>(0);
    const [goals, setGoals] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [season, setSeason] = useState<number>(2)

    // Get most recent Tuesday
    const getLastTuesday = () => {
        const today = new Date();
        const day = today.getDay();
        const diff = (day >= 2 ? day - 2 : 7 - (2 - day));
        const tuesday = new Date(today);
        tuesday.setDate(today.getDate() - diff);
        return tuesday.toISOString().split('T')[0];
    };

    const matchDate = getLastTuesday();

    useEffect(() => {
        const fetchPlayers = async () => {
            const { data, error } = await supabase.from('players').select('*');
            if (error) console.error('Error fetching players:', error);
            else setPlayers(data);
        };
        fetchPlayers();
    }, []);

    const handleGoalChange = (playerId: string, value: number) => {
        setGoals((prev) => ({ ...prev, [playerId]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.from('matches').insert([
            {
                date: matchDate,
                team_a: teamA,
                team_b: teamB,
                score_a: scoreA,
                score_b: scoreB,
                goals,
                season_id: season,
            },
        ]);

        setLoading(false);

        if (error) {
            console.error('Error submitting match:', error);
            alert('Failed to submit match.');
        } else {
            alert('Match submitted successfully!');
            setTeamA([]);
            setTeamB([]);
            setScoreA(0);
            setScoreB(0);
            setGoals({});
            setSeason(2);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">Enter Match for {matchDate}</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block font-semibold mb-2">Team A Players</label>
                    <select
                        size={15}
                        multiple
                        value={teamA}
                        onChange={(e) =>
                            setTeamA(Array.from(e.target.selectedOptions, (opt) => opt.value))
                        }
                        className="w-full border p-2 rounded"
                    >
                        {players.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block font-semibold mb-2">Team B Players</label>
                    <select
                        size={15}
                        multiple
                        value={teamB}
                        onChange={(e) =>
                            setTeamB(Array.from(e.target.selectedOptions, (opt) => opt.value))
                        }
                        className="w-full border p-2 rounded"
                    >
                        {players.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-4">
                    <div>
                        <label className="block font-semibold mb-2">Score Team A</label>
                        <input
                            type="number"
                            value={scoreA}
                            onChange={(e) => setScoreA(Number(e.target.value))}
                            className="border p-2 rounded w-24"
                        />
                    </div>
                    <div>
                        <label className="block font-semibold mb-2">Score Team B</label>
                        <input
                            type="number"
                            value={scoreB}
                            onChange={(e) => setScoreB(Number(e.target.value))}
                            className="border p-2 rounded w-24"
                        />
                    </div>
                </div>

                <label className="block font-semibold mb-2">Season:</label>
                <select
                    className="border p-2 rounded w-24"
                    value={season}
                    onChange={(e) => setSeason(Number(e.target.value))}
                >
                    <option>Salovka</option>
                </select>

                <div>
                    <label className="block font-semibold mb-2">Goals per Player</label>
                    <div className="grid grid-cols-2 gap-4">
                        {players.map((p) => (
                            <div key={p.id} className="flex items-center gap-2">
                                <span className="w-32">{p.name}</span>
                                <input
                                    type="number"
                                    min={0}
                                    value={goals[p.id] || 0}
                                    onChange={(e) =>
                                        handleGoalChange(p.id, Number(e.target.value))
                                    }
                                    className="border p-1 rounded w-16"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    {loading ? 'Submitting...' : 'Submit Match'}
                </button>
            </form>
        </div>
    );
}
