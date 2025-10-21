
import { useState } from 'react';
import { Player } from "@/app/types";

export default function LiveGoalTracker({ teamA, teamB, onFinish }: { teamA: Player[]; teamB: Player[]; onFinish: (goals: Record<string, number>) => void }) {
    const [goals, setGoals] = useState<Record<string, number>>({});

    const addGoal = (id: string) =>
        setGoals(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

    const removeGoal = (id: string) =>
        setGoals(prev => ({ ...prev, [id]: (prev[id] || 0) - 1 }));

    const totalA = teamA.reduce((sum: number, p: Player) => sum + (goals[p.id] || 0), 0);
    const totalB = teamB.reduce((sum: number, p: Player) => sum + (goals[p.id] || 0), 0);

    return (
        <div className="p-4">
            <h2 className="font-bold text-xl mb-2">🎯 Live Goal Tracker</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{ label: 'Team Barevni', team: teamA }, { label: 'Team Zeleni', team: teamB }].map(({ label, team }) => (
                    <div key={label}>
                        <h3 className="font-semibold mb-2">{label}</h3>
                        {team.map((p: Player) => (
                            <div key={p.id} className="mb-3">
                                <button
                                    onClick={() => addGoal(p.id)}
                                    className="w-4/5 bg-blue-500 text-white py-2 rounded-md"
                                >
                                    {p.name} ({goals[p.id] || 0})
                                </button>
                                <button
                                    onClick={() => removeGoal(p.id)}
                                    className="w-1/5 bg-red-600 text-white py-2 rounded-md"
                                >
                                    -
                                </button>
                            </div>
                        ))}
                    </div>
                ))}
            </div>

            <div className="mt-4 text-center font-bold">
                🟦 {totalA} : {totalB} 🟥
            </div>

            <button
                onClick={() => onFinish(goals)}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded"
            >
                ✅ Finish Match
            </button>
        </div>
    );
}
