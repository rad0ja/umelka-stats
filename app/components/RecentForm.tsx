'use client';

import RecentFormBadge from "@/app/components/RecentFormBadge";
import { getRecentForm } from "@/app/utils/form-utils";
import { usePlayerMatchData } from "@/app/hooks/usePlayerMatchData";

export default function RecentForm() {
    const { players, matches, loading } = usePlayerMatchData();
    const recentForm = getRecentForm(matches, players.map(p => p.id));
    const sortedByMatchCount = players
        .map((player) => ({
            ...player,
            matchCount: recentForm[player.id]?.length || 0,
        }))
        .sort((a, b) => b.matchCount - a.matchCount);

    return (
        <div>
            <h2 className="text-xl font-semibold mb-2">🚀 Recent Form</h2>
            <ul className="space-y-1">
                {sortedByMatchCount.map(player => (
                    <li key={player.id} className="flex justify-between border-b py-1">
            <span>
                <div className="font-bold">{player.name}</div>
            </span>
                        <span className="text-sm text-gray-600 dark:text-white">
                                <RecentFormBadge form={recentForm[player.id] || []}/>
                            </span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

