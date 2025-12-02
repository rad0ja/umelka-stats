'use client';
import { supabase } from "@/lib/supabase";

export default function LiveMatchSummary({ teamA, teamB, goals, onDone }: any) {
    const totalA = teamA.reduce((sum: any, p: { id: string | number; }) => sum + (goals[p.id] || 0), 0);
    const totalB = teamB.reduce((sum: any, p: { id: string | number; }) => sum + (goals[p.id] || 0), 0);

    const scorersA = teamA.filter((p: any) => (goals[p.id] || 0) > 0);
    const scorersB = teamB.filter((p: any) => (goals[p.id] || 0) > 0);

    const submitMatch = async () => {
        const { error } = await supabase.from('matches').insert({
            team_a: teamA.map((p: { id: any; }) => p.id),
            team_b: teamB.map((p: { id: any; }) => p.id),
            score_a: totalA,
            score_b: totalB,
            goals,
            date: new Date().toISOString().slice(0, 10),
            season_id: 2
        });
        if (error) console.error(error);
        else onDone();
    };

    return (
        <div className="p-4">
            <h2 className="font-bold text-xl mb-2">📊 Match Summary</h2>
            <div className="mb-4">
                <p>🟦 Team A: {totalA}</p>
                <p>🟥 Team B: {totalB}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <h3 className="font-semibold mb-2">⚽ Team A scorers</h3>
                    {scorersA.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                            {scorersA.map((p: any) => (
                                <li key={p.id}>
                                    {p.name || p.id}: {goals[p.id]}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No goals scored</p>
                    )}
                </div>
                <div>
                    <h3 className="font-semibold mb-2">⚽ Team B scorers</h3>
                    {scorersB.length > 0 ? (
                        <ul className="list-disc pl-5 space-y-1">
                            {scorersB.map((p: any) => (
                                <li key={p.id}>
                                    {p.name || p.id}: {goals[p.id]}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No goals scored</p>
                    )}
                </div>
            </div>

            <button onClick={submitMatch} className="w-full bg-green-600 text-white py-2 rounded">
                ✅ Confirm & Save
            </button>
        </div>
    );
}
