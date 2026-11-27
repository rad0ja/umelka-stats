'use client';

import { Player } from "@/app/types";
import { getSortedStats } from "@/app/utils/playerHelpers";
import LeagueTable from "@/app/components/LeagueTable";

type Props = {
    wins:Record<string, number>;
    players: Player[];
    showAll?: boolean;
}

export default function MostWins({ wins, players, showAll}: Props) {
    const sortedWins = getSortedStats(wins);
    const displayedWins = showAll ? sortedWins : sortedWins.slice(0, 5);

    return (
        <LeagueTable
            title="🏆 Most wins"
            unit="Wins"
            players={players}
            rows={displayedWins.map(([id, value]) => ({ id, value }))}
        />
    );
}
