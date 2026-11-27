'use client';

import {  getSortedStats } from "@/app/utils/playerHelpers";
import { Player } from "@/app/types";
import LeagueTable from "@/app/components/LeagueTable";
import { usePlayerStats } from "@/app/hooks/usePlayerStats";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";

type Props = {
    players: Player[];
    appearances: Record<string, number>;
    showAll?: boolean;
}

export default function MatchesPlayed({players, appearances, showAll}: Props) {
    const sortedAppearances = getSortedStats(appearances);
    const displayedAppearances = showAll ? sortedAppearances : sortedAppearances.slice(0, 5);

    const { matches } = usePlayerMatchData();
    const { matchesPlayedRatio } = usePlayerStats(matches);

    return (
        <LeagueTable
            title="📅 Matches played"
            unit="Appearances"
            players={players}
            rows={displayedAppearances.map(([id, value]) => ({ id, value, detail: String(matchesPlayedRatio(id)) }))}
        />
    )
}
