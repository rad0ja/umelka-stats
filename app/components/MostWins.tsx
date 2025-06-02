'use client';

import { Player } from "@/app/types";
import {getPlayerName, getSortedWins, getTrophy} from "@/app/utils/playerHelpers";

type Props = {
    wins: Record<string, number>;
    players: Player[];
    showAll?: boolean;
};

export default function MostWins({ wins, players, showAll}: Props) {
    const sortedWins = getSortedWins(wins);
    const displayedWins = showAll ? sortedWins : sortedWins.slice(0, 5);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">🏆 Most Wins</h2>
            <ul className="space-y-1">
                {displayedWins.map(([id, wins], index) => (
                    <li key={id} className="flex justify-between border-b py-1">
                        <span><span className="text-xl">{getTrophy(index)}</span> {getPlayerName(players, id)}</span>
                        <span className="text-sm text-gray-600 dark:text-white">{wins} wins</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}