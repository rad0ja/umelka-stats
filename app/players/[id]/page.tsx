// app/players/[id]/page.tsx
'use client';

import PlayerCard from '@/app/components/PlayerCard';
import { getTrophy } from '@/app/utils/playerHelpers';
import { usePlayerCalculatedScore } from "@/app/hooks/usePlayerCalculatedScore";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import PlayerMatchHistory from "@/app/components/PlayerMatchHistory";
import { playerMatchHistory } from "@/app/utils/playerMatchHistory";
import {getAllMVPs} from "@/app/utils/getAllMVPs";

export default function PlayerDetailPage() {
    const { playerCalc, goalsCalc, matchesPlayedCalc, winsCalc } = usePlayerCalculatedScore();
    const { matches , players} = usePlayerMatchData();
    const allData = playerMatchHistory(matches);
    const allMvps = getAllMVPs(players, matches)
    console.log(allData)

    const MVPScore = goalsCalc * 2 + winsCalc * 1.5 + matchesPlayedCalc;

    if (!playerCalc) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
                <PlayerCard
                    name={playerCalc.name}
                    goals={goalsCalc}
                    wins={winsCalc}
                    matchesPlayed={matchesPlayedCalc}
                    totalMatches={matches.length}
                    score={MVPScore}
                    trophy={getTrophy(0)} // optional
                />
                <PlayerMatchHistory playerId={playerCalc.id} history={allData} allMVPs={allMvps}/>
        </div>
    );
}
