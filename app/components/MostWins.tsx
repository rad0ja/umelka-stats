'use client';

import { Player } from "@/app/types";
import { getSortedStats } from "@/app/utils/playerHelpers";
import CustomBadgeForPlayer from "@/app/components/CustomBadgeForPlayer";

type Props = {
    wins:Record<string, number>;
    players: Player[];
    showAll?: boolean;
}

export default function MostWins({ wins, players, showAll}: Props) {
    const sortedWins = getSortedStats(wins);
    const displayedWins = showAll ? sortedWins : sortedWins.slice(0, 5);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">🏆 Most Wins</h2>
            <ul className="space-y-1">
                {displayedWins.map(([id, wins], index) => (
                    <li key={id} className="flex justify-between border-b py-1">
                        <CustomBadgeForPlayer id={id} players={players} index={index} />
                        <span className="text-sm text-gray-600 dark:text-white">{wins} wins</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}