'use client';

import { Player } from "@/app/types";
import { getPlayerName } from "@/app/utils/playerHelpers";
import { getTrophy, getSortedStats } from "@/app/utils/playerHelpers";

type Props = {
    goals: Record<string, number>;
    players: Player[];
    showAll?: boolean;
}

export default function TopScorers({ goals, players, showAll}: Props) {
    const sortedGoals = getSortedStats(goals)
    const displayedGoals = showAll ? sortedGoals : sortedGoals.slice(0, 5);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">🥅 Top Scorers</h2>
            <ul className="space-y-1">
                {displayedGoals.map(([id, goals], index) => (
                    <li key={id} className="flex justify-between border-b py-1">
            <span>
              <span className="text-xl">{getTrophy(index)}</span> {getPlayerName(players, id)}
            </span>
                        <span className="text-sm text-gray-600 dark:text-white">{goals} goals</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
