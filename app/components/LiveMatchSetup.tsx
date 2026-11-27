// components/LiveMatchSetup.tsx

import React, { useEffect, useState } from 'react';
import { SUGGESTED_TEAMS_KEY } from '@/app/utils/teamSuggestion';

type Player = { id: string; name: string };

type Props = {
    players: Player[]; // must be serializable data only (no functions)
    onStart: (teams: { teamA: Player[]; teamB: Player[] }) => void;
};

export default function LiveMatchSetup({ players, onStart }: Props) {
    const [teamA, setTeamA] = useState<Player[]>([]);
    const [teamB, setTeamB] = useState<Player[]>([]);
    const [prefilled, setPrefilled] = useState(false);

    // Teams picked on /teams ("Use these teams") arrive via sessionStorage; apply them once players load
    useEffect(() => {
        if (players.length === 0) return;
        const raw = sessionStorage.getItem(SUGGESTED_TEAMS_KEY);
        if (!raw) return;
        sessionStorage.removeItem(SUGGESTED_TEAMS_KEY);
        try {
            const { teamA: a, teamB: b } = JSON.parse(raw) as { teamA: string[]; teamB: string[] };
            const pick = (ids: string[]) => ids.map((id) => players.find((p) => p.id === id)).filter((p): p is Player => !!p);
            setTeamA(pick(a));
            setTeamB(pick(b));
            setPrefilled(true);
        } catch { /* ignore a corrupted value */ }
    }, [players]);

    const toggle = (setter: React.Dispatch<React.SetStateAction<Player[]>>, p: Player) => {
        setter(prev => (prev.find(x => x.id === p.id) ? prev.filter(x => x.id !== p.id) : [...prev, p]));
    };

    return (
        <div className="p-4">
            <h2 className="font-bold text-xl mb-2">⚽ Select Players</h2>
            {prefilled && (
                <p className="text-sm text-muted mb-2">Teams pre-filled from the suggestion. You can still change them.</p>
            )}

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="font-semibold mb-1">Team A</h3>
                    {players.map(p => (
                        <button
                            key={p.id}
                            onClick={() => toggle(setTeamA, p)}
                            className={`block w-full px-3 py-1 mb-1 rounded border font-medium transition-colors ${teamA.some(x => x.id === p.id) ? 'bg-pitch border-pitch text-white' : 'bg-surface-2 border-line text-foreground hover:border-pitch'}`}
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
                            className={`block w-full px-3 py-1 mb-1 rounded border font-medium transition-colors ${teamB.some(x => x.id === p.id) ? 'bg-red-card border-red-card text-white' : 'bg-surface-2 border-line text-foreground hover:border-red-card'}`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            <button
                disabled={teamA.length === 0 || teamB.length === 0}
                onClick={() => onStart({ teamA, teamB })}
                className="mt-4 w-full bg-pitch text-white font-semibold py-2 rounded disabled:bg-surface-2 disabled:text-muted"
            >
                ✅ Start Match
            </button>
        </div>
    );
}
