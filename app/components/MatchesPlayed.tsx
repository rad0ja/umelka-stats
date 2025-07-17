'use client';

import {  getSortedStats } from "@/app/utils/playerHelpers";
import { Player } from "@/app/types";
import CustomBadgeForPlayer from "@/app/components/CustomBadgeForPlayer";

type Props = {
    players: Player[];
    appearances: Record<string, number>;
    showAll?: boolean;
}

export default function MatchesPlayed({players, appearances, showAll}: Props) {
    const sortedAppearances = getSortedStats(appearances);
    const displayedAppearances = showAll ? sortedAppearances : sortedAppearances.slice(0, 5);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">📅 Matches Played</h2>
            <ul className="space-y-1">
                {displayedAppearances.map(([id, appearances], index) => (
                    <li key={id} className="flex justify-between border-b py-1">
                        <CustomBadgeForPlayer id={id} players={players} index={index} />
                        <span className="text-sm text-gray-600 dark:text-white">{appearances} matches</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}