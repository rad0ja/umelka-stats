'use client';

import { Player } from "@/app/types";
import { getPlayerName, getSortedStats, getTrophy } from "@/app/utils/playerHelpers";
import Link from 'next/link';

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
            <ul>
                {displayedWins.map(([id, wins], index) => (
                    <li key={id} className="border-b py-1">
                        <Link
                            href={`/players/${id}`}
                            className="flex justify-between hover:underline text-blue-600 dark:text-blue-400"
                        >
        <span>
          <span className="text-xl">{getTrophy(index)}</span> {getPlayerName(players, id)}
        </span>
                            <span className="text-sm text-gray-600 dark:text-white">{wins} wins</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}