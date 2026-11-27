'use client';

import { Player } from "@/app/types";
import LeagueTable from "@/app/components/LeagueTable";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";

type Props = {
    players: Player[];
    goals: Record<string, number>;
    assists: Record<string, number>;
    showAll?: boolean;
}

export default function CanadianPoints({players, goals, assists}: Props) {
    const { matches } = usePlayerMatchData();
    const { canadianPointsTotal } = usePlayerStats(matches);

    const ids = Object.keys(goals).sort((a, b) => ((goals[b] || 0) + assists[b]) - ((goals[a] || 0) + assists[a]));

    return (
        <LeagueTable
            title="🧮 Canadian points"
            unit="Goals + assists"
            players={players}
            rows={ids.map((id) => ({ id, value: canadianPointsTotal(id), detail: `${goals[id] || 0} + ${assists[id] || 0}` }))}
        />
    )
}
