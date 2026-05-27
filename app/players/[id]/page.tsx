// app/players/[id]/page.tsx
'use client';

import PlayerCard from '@/app/components/PlayerCard';
import { getTrophy } from '@/app/utils/playerHelpers';
import { usePlayerCalculatedScore } from "@/app/hooks/usePlayerCalculatedScore";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";
import PlayerMatchHistory from "@/app/components/PlayerMatchHistory";
import { playerMatchHistory } from "@/app/utils/playerMatchHistory";
import { getAllMVPs } from "@/app/utils/getAllMVPs";
import { useParams } from "next/navigation";
import { computeMostWinsLossesWith } from "@/app/utils/playerVsPlayer";

export default function PlayerDetailPage() {
    const { id } = useParams();
    const playerID = id as string
    const { playerCalc, goalsCalc, matchesPlayedCalc, winsCalc, drawsCalc, assistsCalc } = usePlayerCalculatedScore();
    const { matches , players} = usePlayerMatchData();
    const allData = playerMatchHistory(matches);
    const allMvps = getAllMVPs(players, matches)
    const PvP = computeMostWinsLossesWith(matches, playerID, players)
    const { mvpScore } = getAllMVPs(players, matches).find(p => p.id === playerID) || { mvpScore: 0 };

    if (!playerCalc) return <div className="p-6 text-center">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <PlayerCard
                    name={playerCalc.name}
                    goals={goalsCalc}
                    assists={assistsCalc}
                    wins={winsCalc}
                    draws={drawsCalc}
                    matchesPlayed={matchesPlayedCalc}
                    totalMatches={matches.length}
                    score={mvpScore.toFixed(1)}
                    trophy={getTrophy(0)} // optional
                />
            <h2 className="mb-2 text-xl font-semibold">Most wins with: {PvP.mostWinsWithName} - {PvP.winsCount}</h2>
            <h2 className="mb-2 text-xl font-semibold">Most loses with: {PvP.mostLossesWithName} - {PvP.lossesCount}</h2>
            {/*<GoalProgress />*/}
            <PlayerMatchHistory playerId={playerCalc.id} history={allData} allMVPs={allMvps}/>
        </div>
    );
}
