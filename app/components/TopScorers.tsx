'use client';

import { Player } from "@/app/types";
import { getSortedStats } from "@/app/utils/playerHelpers";
import LeagueTable from "@/app/components/LeagueTable";

type Props = {
    goals: Record<string, number>;
    players: Player[];
    showAll?: boolean;
}

export default function TopScorers({ goals, players, showAll}: Props) {
    const sortedGoals = getSortedStats(goals)
    const displayedGoals = showAll ? sortedGoals : sortedGoals.slice(0, 5);

    return (
        <LeagueTable
            title="🥅 Top scorers"
            unit="Goals"
            players={players}
            rows={displayedGoals.map(([id, value]) => ({ id, value }))}
        />
    );
}
