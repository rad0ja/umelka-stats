// app/matches/page.tsx
'use client';

import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import { getPlayerName } from "@/app/utils/playerHelpers";

export default function MatchesPage() {
    const { players, matches, loading } = usePlayerMatchData();

    if (loading) return <div className="text-center">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">📋 All Matches Summary</h1>
            {matches
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((match) => (
                    <div key={match.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
                        <div className="text-center text-lg font-semibold mb-2">
                            <span className="text-base">Team A</span> {match.score_a} : {match.score_b} <span
                            className="text-base">Team B</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[match.team_a, match.team_b].map((team, i) => (
                                <div key={i}>
                                    <h3 className="font-semibold mb-2">{i === 0 ? 'Team A' : 'Team B'}</h3>
                                    <ul className="text-sm space-y-1">
                                        {team.map((id) => (
                                                <li key={id} className="flex justify-between border-b py-1">
                                                    <span>{getPlayerName(players, id)}</span>
                                                    <span>{match.goals[id] || 0} goals</span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                        <div className="text-xs text-gray-500 text-center mt-2">
                            {new Date(match.date).toLocaleDateString()}
                        </div>
                    </div>
                ))}
        </div>
    );
}
