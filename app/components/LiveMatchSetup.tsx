// components/LiveMatchSetup.tsx

import React, { useState } from 'react';

type Player = { id: string; name: string };

type Props = {
    players: Player[]; // must be serializable data only (no functions)
    onStart: (teams: { teamA: Player[]; teamB: Player[] }) => void;
};

export default function LiveMatchSetup({ players, onStart }: Props) {
    const [teamA, setTeamA] = useState<Player[]>([]);
    const [teamB, setTeamB] = useState<Player[]>([]);

    const toggle = (setter: React.Dispatch<React.SetStateAction<Player[]>>, p: Player) => {
        setter(prev => (prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]));
    };

    return (
        <div className="p-4">
            <h2 className="font-bold text-xl mb-2">⚽ Select Players</h2>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-1">Team A</h3>
                    {players.map(p => (
                        <button
                            key={p.id}
                            onClick={() => toggle(setTeamA, p)}
                            className={`block w-full px-3 py-1 mb-1 rounded ${teamA.some(x => x.id === p.id) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>

                <div>
                    <h3 className="font-semibold mb-1">Team B</h3>
                    {players.map(p => (
                        <button
                            key={p.id}
                            onClick={() => toggle(setTeamB, p)}
                            className={`block w-full px-3 py-1 mb-1 rounded ${teamB.some(x => x.id === p.id) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            <button
                disabled={teamA.length === 0 || teamB.length === 0}
                onClick={() => onStart({ teamA, teamB })}
                className="mt-4 w-full bg-green-600 text-white py-2 rounded disabled:bg-gray-400"
            >
                ✅ Start Match
            </button>
        </div>
    );
}
