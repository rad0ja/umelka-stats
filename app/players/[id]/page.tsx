// app/players/[id]/page.tsx
'use client';

import PlayerCard from '@/app/components/PlayerCard';
import { getTrophy } from '@/app/utils/playerHelpers';
import { usePlayerCalculatedScore } from "@/app/hooks/usePlayerCalculatedScore";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData"; // if used

export default function PlayerDetailPage() {
    const { player, goals, matchesPlayed, wins } = usePlayerCalculatedScore();
    const { matches } = usePlayerMatchData();

    const MVPScore = goals * 2 + wins * 1.5 + matchesPlayed;

    if (!player) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
                <PlayerCard
                    name={player.name}
                    goals={goals}
                    wins={wins}
                    matchesPlayed={matchesPlayed}
                    totalMatches={matches.length}
                    score={MVPScore}
                    trophy={getTrophy(0)} // optional
                />
        </div>
    );
}
